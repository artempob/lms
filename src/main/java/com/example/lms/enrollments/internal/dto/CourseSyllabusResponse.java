package com.example.lms.enrollments.internal.dto;

import java.util.List;
import java.util.UUID;

public record CourseSyllabusResponse(
        UUID courseId,
        String title,
        List<Lesson> lessons,
        long completedLessons,
        int totalLessons,
        boolean canComplete
) {
    public record Lesson(UUID id, String title, int ordinalNumber, boolean isCompleted) {}
}
