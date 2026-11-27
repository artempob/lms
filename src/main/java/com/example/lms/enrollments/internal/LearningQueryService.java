package com.example.lms.enrollments.internal;

import com.example.lms.common.NotFoundException;
import com.example.lms.courses.CourseLessonLookup;
import com.example.lms.courses.CourseStatus;
import com.example.lms.enrollments.internal.dto.CourseSyllabusResponse;
import com.example.lms.enrollments.internal.dto.LessonResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class LearningQueryService {
    private final CourseLessonLookup courses;
    private final EnrollmentRepository enrollments;
    private final LessonProgressRepository progress;

    public LearningQueryService(CourseLessonLookup courses, EnrollmentRepository enrollments,
                                LessonProgressRepository progress) {
        this.courses = courses;
        this.enrollments = enrollments;
        this.progress = progress;
    }

    public LessonResponse getLesson(UUID userId, UUID courseId, UUID lessonId) {
        Access access = requireAccess(userId, courseId);
        var lesson = courses.findLesson(courseId, lessonId)
                .orElseThrow(() -> new NotFoundException("Урок не найден в указанном курсе"));
        boolean completed = access.enrollmentId() != null
                && progress.existsByEnrollmentIdAndLessonId(access.enrollmentId(), lessonId);
        return new LessonResponse(lesson.id(), lesson.courseId(), lesson.title(),
                lesson.content(), lesson.videoUrl(), completed, access.enrollmentId() != null);
    }

    public CourseSyllabusResponse getSyllabus(UUID userId, UUID courseId) {
        Access access = requireAccess(userId, courseId);
        Set<UUID> completed = access.enrollmentId() == null ? Set.of()
                : progress.findByEnrollmentId(access.enrollmentId()).stream()
                        .map(LessonProgressEntity::getLessonId).collect(Collectors.toSet());
        var lessons = courses.findLessons(courseId).stream()
                .map(l -> new CourseSyllabusResponse.Lesson(l.id(), l.title(),
                        l.ordinalNumber(), completed.contains(l.id())))
                .toList();
        return new CourseSyllabusResponse(courseId, access.course().title(), lessons,
                lessons.stream().filter(CourseSyllabusResponse.Lesson::isCompleted).count(),
                lessons.size(), access.enrollmentId() != null);
    }

    Access requireAccess(UUID userId, UUID courseId) {
        var course = courses.findCourse(courseId)
                .orElseThrow(() -> new NotFoundException("Курс не найден"));
        boolean author = course.authorId().equals(userId);
        if (course.status() != CourseStatus.PUBLISHED && !author) {
            throw new NotFoundException("Курс не найден");
        }
        UUID enrollmentId = enrollments.findByStudentIdAndCourseId(userId, courseId)
                .filter(e -> "ACTIVE".equals(e.getStatus()))
                .map(EnrollmentEntity::getId).orElse(null);
        if (!author && enrollmentId == null) {
            throw new AccessDeniedException("Нет активной записи на курс");
        }
        return new Access(course, enrollmentId);
    }

    record Access(CourseLessonLookup.CourseInfo course, UUID enrollmentId) {}
}
