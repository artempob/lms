package com.example.lms.enrollments.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

interface LessonProgressRepository extends JpaRepository<LessonProgressEntity, UUID> {
    boolean existsByEnrollmentIdAndLessonId(UUID enrollmentId, UUID lessonId);
    List<LessonProgressEntity> findByEnrollmentId(UUID enrollmentId);
}
