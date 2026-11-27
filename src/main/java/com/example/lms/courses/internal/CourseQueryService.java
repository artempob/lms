package com.example.lms.courses.internal;

import com.example.lms.courses.internal.dto.CourseDetailsResponse;
import com.example.lms.courses.internal.dto.CourseSummaryResponse;
import com.example.lms.courses.internal.dto.LessonSummaryResponse;
import com.example.lms.courses.internal.dto.MyCourseSummaryResponse;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.lms.jooq.Tables.COURSES;
import static com.example.lms.jooq.Tables.LESSONS;
import static com.example.lms.jooq.Tables.ENROLLMENTS;  
import static org.jooq.impl.DSL.multiset;
import static org.jooq.impl.DSL.select;
import static com.example.lms.jooq.Tables.USERS;
import static com.example.lms.jooq.Tables.LESSON_PROGRESS;
import static org.jooq.impl.DSL.selectCount;
import com.example.lms.courses.CourseLessonLookup;
import com.example.lms.courses.CourseStatus;
import org.jooq.Condition;


@Service
@Transactional(readOnly = true)
public class CourseQueryService implements CourseLessonLookup {

    private final DSLContext dsl;

    public CourseQueryService(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public boolean existsInCourse(UUID courseId, UUID lessonId) {
        return dsl.fetchExists(
                dsl.selectFrom(LESSONS)
                        .where(LESSONS.ID.eq(lessonId))
                        .and(LESSONS.COURSE_ID.eq(courseId))
        );
    }

    @Override
    public Optional<CourseInfo> findCourse(UUID courseId) {
        return dsl.select(COURSES.ID, COURSES.AUTHOR_ID, COURSES.TITLE, COURSES.STATUS)
                .from(COURSES)
                .where(COURSES.ID.eq(courseId))
                .fetchOptional(r -> new CourseInfo(r.value1(), r.value2(), r.value3(),
                        CourseStatus.valueOf(r.value4())));
    }

    @Override
    public List<LessonInfo> findLessons(UUID courseId) {
        return dsl.select(LESSONS.ID, LESSONS.TITLE, LESSONS.ORDINAL_NUMBER)
                .from(LESSONS)
                .where(LESSONS.COURSE_ID.eq(courseId))
                .orderBy(LESSONS.ORDINAL_NUMBER.asc(), LESSONS.ID.asc())
                .fetch(r -> new LessonInfo(r.value1(), r.value2(), r.value3()));
    }

    @Override
    public Optional<LessonData> findLesson(UUID courseId, UUID lessonId) {
        return dsl.select(LESSONS.ID, LESSONS.COURSE_ID, LESSONS.TITLE,
                        LESSONS.CONTENT, LESSONS.CONTENT_URL)
                .from(LESSONS)
                .where(LESSONS.ID.eq(lessonId).and(LESSONS.COURSE_ID.eq(courseId)))
                .fetchOptional(r -> new LessonData(r.value1(), r.value2(), r.value3(),
                        r.value4(), r.value5()));
    }

    public List<CourseSummaryResponse> findPublishedCourses(int limit, int offset, String query) {
        return dsl.select(
                        COURSES.ID,
                        COURSES.AUTHOR_ID,
                        COURSES.TITLE,
                        COURSES.PRICE,
                        COURSES.STATUS
                )
                .from(COURSES)
                .where(COURSES.STATUS.eq("PUBLISHED"))
                .and(COURSES.TITLE.containsIgnoreCase(query.trim()))
                .orderBy(COURSES.CREATED_AT.desc())
                .limit(limit)
                .offset(offset)
                .fetchInto(CourseSummaryResponse.class);
    }

    public List<MyCourseSummaryResponse> findMyCourses(UUID userId) {
        return dsl.select(
                        COURSES.ID,
                        COURSES.AUTHOR_ID,
                        COURSES.TITLE,
                        COURSES.PRICE,
                        COURSES.STATUS,
                        selectCount().from(LESSON_PROGRESS)
                                .join(LESSONS).on(LESSONS.ID.eq(LESSON_PROGRESS.LESSON_ID))
                                .where(LESSON_PROGRESS.ENROLLMENT_ID.eq(ENROLLMENTS.ID))
                                .and(LESSONS.COURSE_ID.eq(COURSES.ID)).asField("completedLessons"),
                        selectCount().from(LESSONS)
                                .where(LESSONS.COURSE_ID.eq(COURSES.ID)).asField("totalLessons")
                )
                .from(COURSES)
                .join(ENROLLMENTS).on(COURSES.ID.eq(ENROLLMENTS.COURSE_ID))
                .where(ENROLLMENTS.STUDENT_ID.eq(userId))
                .and(ENROLLMENTS.STATUS.eq("ACTIVE"))
                .orderBy(ENROLLMENTS.ENROLLED_AT.desc())
                .fetchInto(MyCourseSummaryResponse.class);
    }

    public List<CourseSummaryResponse> findAuthoredCourses(UUID authorId) {
        return dsl.select(COURSES.ID, COURSES.AUTHOR_ID, COURSES.TITLE,
                        COURSES.PRICE, COURSES.STATUS)
                .from(COURSES)
                .where(COURSES.AUTHOR_ID.eq(authorId))
                .orderBy(COURSES.CREATED_AT.desc())
                .fetchInto(CourseSummaryResponse.class);
    }

    public Optional<CourseDetailsResponse> findCourseDetailsById(
            UUID courseId,
            UUID viewerId
    ) {
        Condition visibility = COURSES.STATUS.eq(
                CourseStatus.PUBLISHED.name()
        );

        if (viewerId != null) {
            visibility = visibility.or(
                    COURSES.AUTHOR_ID.eq(viewerId)
            );
        }
        return dsl.select(
                        COURSES.ID,
                        COURSES.AUTHOR_ID,
                        USERS.FIRST_NAME.as("authorFirstName"),
                        USERS.LAST_NAME.as("authorLastName"),
                        COURSES.TITLE,
                        COURSES.DESCRIPTION,
                        COURSES.PRICE,
                        COURSES.STATUS,
                        multiset(
                                select(LESSONS.ID, LESSONS.TITLE, LESSONS.ORDINAL_NUMBER)
                                        .from(LESSONS)
                                        .where(LESSONS.COURSE_ID.eq(COURSES.ID))
                                        .orderBy(LESSONS.ORDINAL_NUMBER.asc())
                        ).as("lessons").convertFrom(r -> r.into(LessonSummaryResponse.class))
                )
                .from(COURSES)
                .leftJoin(USERS).on(COURSES.AUTHOR_ID.eq(USERS.ID))
                .where(COURSES.ID.eq(courseId))
                .and(visibility)
                .fetchOptionalInto(CourseDetailsResponse.class);
    }
}
