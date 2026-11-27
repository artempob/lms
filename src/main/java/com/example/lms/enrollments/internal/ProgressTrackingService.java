package com.example.lms.enrollments.internal;

import com.example.lms.common.NotFoundException;
import com.example.lms.courses.CourseLessonLookup;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProgressTrackingService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository progressRepository;
    private final CourseLessonLookup courseLessonLookup;
    private final LearningQueryService learning;

    public ProgressTrackingService(
            EnrollmentRepository enrollmentRepository,
            LessonProgressRepository progressRepository,
            CourseLessonLookup courseLessonLookup,
            LearningQueryService learning
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
        this.courseLessonLookup = courseLessonLookup;
        this.learning = learning;
    }

    @Transactional
    public void markLessonAsCompleted(
            UUID studentId,
            UUID courseId,
            UUID lessonId
    ) {
        learning.requireAccess(studentId, courseId);
        EnrollmentEntity enrollment = enrollmentRepository
                .findForUpdate(studentId, courseId)
                .filter(e -> "ACTIVE".equals(e.getStatus()))
                .orElseThrow(() -> new AccessDeniedException(
                        "Активная запись на курс не найдена"
                ));

        if (!courseLessonLookup.existsInCourse(courseId, lessonId)) {
            throw new NotFoundException(
                    "Урок не найден в указанном курсе"
            );
        }

        if (progressRepository.existsByEnrollmentIdAndLessonId(
                enrollment.getId(),
                lessonId
        )) {
            return;
        }

        LessonProgressEntity progress = new LessonProgressEntity();
        progress.setEnrollmentId(enrollment.getId());
        progress.setLessonId(lessonId);

        progressRepository.save(progress);
    }
}
