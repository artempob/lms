package com.example.lms.courses.internal.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CourseDetailsResponse(
        UUID id,
        UUID authorId,
        String authorFirstName,
        String authorLastName,
        String title,
        String description,
        BigDecimal price,
        String status,
        List<LessonSummaryResponse> lessons
) {}