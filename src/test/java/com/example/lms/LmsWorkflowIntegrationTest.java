package com.example.lms;

import com.example.lms.common.TokenIssuer;
import com.example.lms.users.UserCreatedEvent;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.MockMvcPrint;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.support.TransactionTemplate;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.util.Arrays;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(print = MockMvcPrint.NONE)
@ActiveProfiles("test")
class LmsWorkflowIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired DataSource dataSource;
    @Autowired TokenIssuer tokens;
    @Autowired PasswordEncoder passwords;
    @Autowired ApplicationEventPublisher events;
    @Autowired TransactionTemplate transactions;

    Actor student;
    Actor teacher;
    Actor otherTeacher;

    @BeforeEach
    void prepareIsolatedDatabase() throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            assertThat(connection.getMetaData().getURL())
                    .matches("jdbc:postgresql://(?:localhost|127\\.0\\.0\\.1):[0-9]+/lms_test(?:\\?.*)?");
        }
        jdbc.execute("alter table enrollments drop constraint if exists test_reject_enrollment");
        jdbc.execute("truncate lesson_progress, enrollments, transactions, billing_products, lessons, courses, wallets, users, event_publication cascade");
        student = actor("student@example.test", "STUDENT", "1000.00");
        teacher = actor("teacher@example.test", "TEACHER", "0.00");
        otherTeacher = actor("other@example.test", "TEACHER", "0.00");
    }

    @Test
    void registrationStoresNameAndCreatesExactlyOneZeroBalanceWallet() throws Exception {
        var result = mvc.perform(post("/api/v1/users/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Иван Иванов\",\"email\":\"new@example.test\",\"password\":\"test-pass-123\"}"))
                .andExpect(status().isOk()).andReturn();
        String token = JsonPath.read(body(result), "$.token");
        mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.firstName").value("Иван"))
                .andExpect(jsonPath("$.lastName").value("Иванов"));
        mvc.perform(get("/api/v1/billing/wallets/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.balance").value(0));
        mvc.perform(post("/api/v1/users/register").contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Иван\",\"email\":\"new@example.test\",\"password\":\"test-pass-123\"}"))
                .andExpect(status().isConflict());
        assertThat(jdbc.queryForObject("select count(*) from wallets w join users u on u.id=w.user_id where u.email='new@example.test'", Integer.class)).isEqualTo(1);
    }

    @Test
    void invalidCredentialsReturnUnauthorizedAndValidLoginReturnsUsableToken() throws Exception {
        jdbc.update("update users set email='Student@Example.Test' where id=?", student.id());
        mvc.perform(post("/api/v1/users/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"student@example.test\",\"password\":\"wrong-pass\"}"))
                .andExpect(status().isUnauthorized());
        var login = mvc.perform(post("/api/v1/users/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"STUDENT@example.test\",\"password\":\"test-pass-123\"}"))
                .andExpect(status().isOk()).andReturn();
        String token = JsonPath.read(body(login), "$.token");
        mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(student.id().toString()));
    }

    @Test
    void anonymousAndInvalidTokensCannotAccessPersonalData() throws Exception {
        mvc.perform(get("/api/v1/courses")).andExpect(status().isOk());
        mvc.perform(get("/api/v1/courses/my")).andExpect(status().isUnauthorized())
                .andExpect(header().string("WWW-Authenticate", "Bearer"));
        mvc.perform(get("/api/v1/billing/wallets/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer invalid"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/v1/purchases").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void draftVisibilityAndAuthorListAreScopedToCurrentAuthor() throws Exception {
        UUID draft = course(teacher, "0.00", false);
        UUID another = course(teacher, "0.00", false);
        mvc.perform(get("/api/v1/courses/" + draft)).andExpect(status().isNotFound());
        mvc.perform(auth(get("/api/v1/courses/" + draft), student)).andExpect(status().isNotFound());
        mvc.perform(auth(get("/api/v1/courses/" + draft), otherTeacher)).andExpect(status().isNotFound());
        mvc.perform(auth(get("/api/v1/courses/" + draft), teacher)).andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(draft.toString()));
        mvc.perform(auth(get("/api/v1/courses/" + UUID.randomUUID()), teacher)).andExpect(status().isNotFound());
        mvc.perform(auth(get("/api/v1/courses/authored"), teacher)).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
        mvc.perform(auth(get("/api/v1/courses/authored"), otherTeacher)).andExpect(status().isOk())
                .andExpect(content().json("[]"));
        mvc.perform(auth(get("/api/v1/courses/authored"), student)).andExpect(status().isForbidden());
        assertThat(another).isNotEqualTo(draft);
    }

    @Test
    void onlyAuthorCanAddLessonsOrPublishAndEmptyCoursesCannotBePublished() throws Exception {
        UUID draft = course(teacher, "0.00", false);
        mvc.perform(auth(post("/api/v1/courses/" + draft + "/lessons"), otherTeacher)
                .contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"Lesson\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(auth(post("/api/v1/courses/" + draft + "/publish"), otherTeacher))
                .andExpect(status().isForbidden());
        mvc.perform(auth(post("/api/v1/courses/" + draft + "/publish"), teacher))
                .andExpect(status().isConflict());
        mvc.perform(auth(post("/api/v1/courses"), student).contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Forbidden course\",\"price\":0}"))
                .andExpect(status().isForbidden());
        assertThat(jdbc.queryForObject("select count(*) from lessons", Integer.class)).isZero();
    }

    @Test
    void invalidInputReturnsClientErrorsAndCannotCreateNegativePrices() throws Exception {
        mvc.perform(auth(post("/api/v1/courses"), teacher).contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Invalid course\",\"price\":-100}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.fields.price").exists());
        mvc.perform(auth(post("/api/v1/courses"), teacher).contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Invalid course\",\"price\":1.123}"))
                .andExpect(status().isBadRequest());
        mvc.perform(auth(post("/api/v1/purchases"), student).contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.fields.courseId").exists());
        mvc.perform(auth(post("/api/v1/purchases"), student).contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"not-a-uuid\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/v1/courses/not-a-uuid")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/v1/courses?limit=-1")).andExpect(status().isBadRequest());
        assertThat(jdbc.queryForObject("select count(*) from courses", Integer.class)).isZero();
    }

    @Test
    void databaseRejectsNegativeBalancesEvenWhenApiIsBypassed() {
        assertThatThrownBy(() -> jdbc.update("update wallets set balance=-1 where user_id=?", student.id()))
                .isInstanceOf(DataIntegrityViolationException.class);
        assertBalance("1000.00");
    }

    @Test
    void freePurchaseCreatesAccessWithoutMoneyMovementAndRejectsRepeat() throws Exception {
        UUID id = course(teacher, "0.00", true);
        purchase(student, id, 200);
        purchase(student, id, 409);
        assertBalance("1000.00");
        assertThat(count("transactions")).isZero();
        assertThat(count("enrollments")).isEqualTo(1);
    }

    @Test
    void draftAndUnaffordableCoursesCannotBePurchased() throws Exception {
        purchase(student, course(teacher, "0.00", false), 409);
        purchase(student, course(teacher, "2000.00", true), 409);
        assertBalance("1000.00");
        assertThat(count("transactions")).isZero();
        assertThat(count("enrollments")).isZero();
    }

    @Test
    void paidPurchaseDebitsWalletCreatesJournalAndGrantsAccess() throws Exception {
        UUID id = course(teacher, "300.00", true);
        purchase(student, id, 200);
        purchase(student, id, 409);
        assertBalance("700.00");
        assertThat(count("transactions")).isEqualTo(1);
        assertThat(jdbc.queryForObject("select amount from transactions", BigDecimal.class)).isEqualByComparingTo("300.00");
        assertThat(jdbc.queryForObject("select type from transactions", String.class)).isEqualTo("WITHDRAWAL");
        assertThat(count("enrollments")).isEqualTo(1);
        mvc.perform(auth(get("/api/v1/billing/wallets/me"), student)).andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(700)).andExpect(jsonPath("$.userId").value(student.id().toString()));
    }

    @Test
    void enrollmentFailureRollsBackDebitAndJournalWithoutLeakingSqlToClient() throws Exception {
        UUID id = course(teacher, "300.00", true);
        jdbc.execute("alter table enrollments add constraint test_reject_enrollment check (course_id <> '" + id + "')");
        try {
            var result = mvc.perform(auth(post("/api/v1/purchases"), student)
                    .contentType(MediaType.APPLICATION_JSON).content("{\"courseId\":\"" + id + "\"}"))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.error").value("Внутренняя ошибка сервера"))
                    .andExpect(jsonPath("$.requestId").exists()).andReturn();
            assertThat(body(result)).doesNotContain("test_reject_enrollment", "insert into", "jdbc:");
            assertBalance("1000.00");
            assertThat(count("transactions")).isZero();
            assertThat(count("enrollments")).isZero();
        } finally {
            jdbc.execute("alter table enrollments drop constraint test_reject_enrollment");
        }
    }

    @Test
    void simultaneousPurchasesWaitForWalletAndChargeExactlyOnce() throws Exception {
        UUID id = course(teacher, "100.00", true);
        int[] statuses = concurrentWithLock("wallets", "select id from wallets where user_id=? for update", student.id(),
                () -> mvc.perform(auth(post("/api/v1/purchases"), student).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\":\"" + id + "\"}")).andReturn().getResponse().getStatus());
        assertThat(statuses).containsExactlyInAnyOrder(200, 409);
        assertBalance("900.00");
        assertThat(count("transactions")).isEqualTo(1);
        assertThat(count("enrollments")).isEqualTo(1);
    }

    @Test
    void lessonContentRequiresEnrollmentAndProgressSurvivesRepeatedCompletion() throws Exception {
        UUID id = course(teacher, "0.00", true);
        UUID lesson = firstLesson(id);
        String path = lessonPath(id, lesson);
        mvc.perform(auth(get(path), student)).andExpect(status().isForbidden());
        mvc.perform(auth(get("/api/v1/courses/" + id + "/syllabus"), student)).andExpect(status().isForbidden());
        purchase(student, id, 200);
        mvc.perform(auth(get(path), student)).andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Lesson **body**"))
                .andExpect(jsonPath("$.isCompleted").value(false)).andExpect(jsonPath("$.canComplete").value(true));
        mvc.perform(auth(post(path + "/complete"), student)).andExpect(status().isOk());
        mvc.perform(auth(post(path + "/complete"), student)).andExpect(status().isOk());
        mvc.perform(auth(get(path), student)).andExpect(jsonPath("$.isCompleted").value(true));
        mvc.perform(auth(get("/api/v1/courses/" + id + "/syllabus"), student))
                .andExpect(status().isOk()).andExpect(jsonPath("$.completedLessons").value(1))
                .andExpect(jsonPath("$.totalLessons").value(1));
        mvc.perform(auth(get("/api/v1/courses/my"), student)).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].completedLessons").value(1)).andExpect(jsonPath("$[0].totalLessons").value(1));
        assertThat(count("lesson_progress")).isEqualTo(1);
    }

    @Test
    void authorCanPreviewDraftWithoutBuyingButCannotWriteStudentProgress() throws Exception {
        UUID id = course(teacher, "0.00", false);
        UUID lesson = addLesson(teacher, id);
        mvc.perform(auth(get(lessonPath(id, lesson)), teacher)).andExpect(status().isOk())
                .andExpect(jsonPath("$.canComplete").value(false));
        mvc.perform(auth(get(lessonPath(id, lesson)), student)).andExpect(status().isNotFound());
        mvc.perform(auth(post(lessonPath(id, lesson) + "/complete"), teacher)).andExpect(status().isForbidden());
        assertThat(count("lesson_progress")).isZero();
    }

    @Test
    void lessonFromAnotherCourseCannotBeReadOrCompletedUnderPurchasedCourse() throws Exception {
        UUID purchased = course(teacher, "0.00", true);
        UUID other = course(teacher, "0.00", true);
        UUID lesson = firstLesson(other);
        purchase(student, purchased, 200);
        mvc.perform(auth(get(lessonPath(purchased, lesson)), student)).andExpect(status().isNotFound());
        mvc.perform(auth(post(lessonPath(purchased, lesson) + "/complete"), student)).andExpect(status().isNotFound());
        assertThat(count("lesson_progress")).isZero();
    }

    @Test
    void simultaneousCompletionWaitsForEnrollmentAndCreatesOneProgressRow() throws Exception {
        UUID id = course(teacher, "0.00", true);
        UUID lesson = firstLesson(id);
        purchase(student, id, 200);
        UUID enrollment = jdbc.queryForObject("select id from enrollments where student_id=? and course_id=?", UUID.class, student.id(), id);
        int[] statuses = concurrentWithLock("enrollments", "select id from enrollments where id=? for update", enrollment,
                () -> mvc.perform(auth(post(lessonPath(id, lesson) + "/complete"), student))
                        .andReturn().getResponse().getStatus());
        assertThat(statuses).containsExactly(200, 200);
        assertThat(count("lesson_progress")).isEqualTo(1);
    }

    @Test
    void simultaneousLessonCreationAssignsDistinctOrdinalNumbers() throws Exception {
        UUID id = course(teacher, "0.00", false);
        int[] statuses = concurrentWithLock("courses", "select id from courses where id=? for update", id,
                () -> mvc.perform(auth(post("/api/v1/courses/" + id + "/lessons"), teacher)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"Concurrent lesson\"}"))
                        .andReturn().getResponse().getStatus());
        assertThat(statuses).containsExactly(201, 201);
        assertThat(jdbc.queryForList("select ordinal_number from lessons where course_id=? order by ordinal_number", Integer.class, id))
                .containsExactly(1, 2);
    }

    @Test
    void repeatedUserEventsDoNotResetWalletOrCreateDuplicates() {
        transactions.executeWithoutResult(tx -> {
            events.publishEvent(new UserCreatedEvent(student.id(), "student@example.test"));
            events.publishEvent(new UserCreatedEvent(student.id(), "student@example.test"));
        });
        assertThat(jdbc.queryForObject("select count(*) from wallets where user_id=?", Integer.class, student.id())).isEqualTo(1);
        assertBalance("1000.00");
    }

    private Actor actor(String email, String role, String balance) {
        UUID id = UUID.randomUUID();
        jdbc.update("insert into users(id,email,password_hash,role,first_name,last_name) values (?,?,?,?,?,?)",
                id, email, passwords.encode("test-pass-123"), role, "Test", role);
        jdbc.update("insert into wallets(id,user_id,balance) values (?,?,?)", UUID.randomUUID(), id, new BigDecimal(balance));
        return new Actor(id, tokens.generateToken(id, email, role));
    }

    private UUID course(Actor author, String price, boolean published) throws Exception {
        var result = mvc.perform(auth(post("/api/v1/courses"), author).contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Integration course\",\"price\":" + price + "}"))
                .andExpect(status().isCreated()).andReturn();
        UUID id = UUID.fromString(JsonPath.read(body(result), "$.id"));
        if (published) {
            addLesson(author, id);
            mvc.perform(auth(post("/api/v1/courses/" + id + "/publish"), author)).andExpect(status().isOk());
        }
        return id;
    }

    private UUID addLesson(Actor author, UUID courseId) throws Exception {
        var result = mvc.perform(auth(post("/api/v1/courses/" + courseId + "/lessons"), author)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"First lesson\",\"content\":\"Lesson **body**\"}"))
                .andExpect(status().isCreated()).andReturn();
        return UUID.fromString(JsonPath.read(body(result), "$.id"));
    }

    private void purchase(Actor buyer, UUID courseId, int expected) throws Exception {
        mvc.perform(auth(post("/api/v1/purchases"), buyer).contentType(MediaType.APPLICATION_JSON)
                .content("{\"courseId\":\"" + courseId + "\"}"))
                .andExpect(status().is(expected));
    }

    private int[] concurrentWithLock(String table, String lockSql, UUID id, Callable<Integer> request) throws Exception {
        var pool = Executors.newFixedThreadPool(2);
        try (Connection blocker = dataSource.getConnection()) {
            blocker.setAutoCommit(false);
            try (var statement = blocker.prepareStatement(lockSql)) {
                statement.setObject(1, id);
                try (var rows = statement.executeQuery()) { assertThat(rows.next()).isTrue(); }
            }
            var first = pool.submit(request);
            var second = pool.submit(request);
            try {
                long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(8);
                int waiting;
                do {
                    waiting = jdbc.queryForObject("select count(*) from pg_stat_activity where datname=current_database() and state='active' and wait_event_type='Lock' and query ilike ?", Integer.class, "%" + table + "%");
                    if (waiting >= 2) break;
                    Thread.sleep(25);
                } while (System.nanoTime() < deadline);
                assertThat(waiting).as("both requests reached the database lock").isGreaterThanOrEqualTo(2);
            } finally {
                blocker.rollback();
            }
            return new int[]{first.get(10, TimeUnit.SECONDS), second.get(10, TimeUnit.SECONDS)};
        } finally {
            pool.shutdownNow();
            pool.awaitTermination(10, TimeUnit.SECONDS);
        }
    }

    private UUID firstLesson(UUID id) {
        return jdbc.queryForObject("select id from lessons where course_id=? order by ordinal_number limit 1", UUID.class, id);
    }

    private void assertBalance(String expected) {
        assertThat(jdbc.queryForObject("select balance from wallets where user_id=?", BigDecimal.class, student.id()))
                .isEqualByComparingTo(expected);
    }

    private int count(String table) {
        assertThat(Arrays.asList("transactions", "enrollments", "lesson_progress", "lessons", "courses")).contains(table);
        return jdbc.queryForObject("select count(*) from " + table, Integer.class);
    }

    private MockHttpServletRequestBuilder auth(MockHttpServletRequestBuilder request, Actor actor) {
        return request.header("Authorization", "Bearer " + actor.token());
    }

    private String body(MvcResult result) throws Exception {
        return result.getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
    }

    private String lessonPath(UUID course, UUID lesson) {
        return "/api/v1/courses/" + course + "/lessons/" + lesson;
    }

    private record Actor(UUID id, String token) {}
}
