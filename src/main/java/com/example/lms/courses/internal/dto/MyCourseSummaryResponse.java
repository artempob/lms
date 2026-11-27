package com.example.lms.courses.internal.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record MyCourseSummaryResponse(
        UUID id,
        UUID authorId,
        String title,
        BigDecimal price,
        String status,
        int completedLessons,
        int totalLessons
) {}
