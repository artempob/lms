package com.example.lms.enrollments.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.Optional;
import java.util.UUID;
interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, UUID> {
    boolean existsByStudentIdAndCourseId(UUID studentId, UUID courseId);
    Optional<EnrollmentEntity> findByStudentIdAndCourseId(UUID studentId, UUID courseId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from EnrollmentEntity e where e.studentId = :studentId and e.courseId = :courseId")
    Optional<EnrollmentEntity> findForUpdate(@Param("studentId") UUID studentId,
                                            @Param("courseId") UUID courseId);
}
