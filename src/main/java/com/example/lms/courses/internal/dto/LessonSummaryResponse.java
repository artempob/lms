package com.example.lms.courses.internal.dto;

import java.util.UUID;

public record LessonSummaryResponse(
        UUID id,
        String title,
        Integer ordinalNumber
) {}