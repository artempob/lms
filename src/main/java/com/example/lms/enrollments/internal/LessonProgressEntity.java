package com.example.lms.enrollments.internal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "lesson_progress")
@Getter
@Setter
@NoArgsConstructor
public class LessonProgressEntity {

    @Id
    private UUID id;

    @Column(name = "enrollment_id", nullable = false)
    private UUID enrollmentId;

    @Column(name = "lesson_id", nullable = false)
    private UUID lessonId;

    @Column(name = "completed_at", nullable = false, updatable = false)
    private OffsetDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) this.id = UUID.randomUUID();
        this.completedAt = OffsetDateTime.now();
    }
}