package com.example.lms.enrollments.internal.dto;

import java.util.UUID;

public record LessonResponse(
        UUID id,
        UUID courseId,
        String title,
        String content,
        String videoUrl,
        boolean isCompleted,
        boolean canComplete
) {}
