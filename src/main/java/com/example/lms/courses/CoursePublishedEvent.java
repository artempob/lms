package com.example.lms.courses;

import java.math.BigDecimal;
import java.util.UUID;

public record CoursePublishedEvent(
        UUID courseId,
        UUID authorId,
        String title,
        BigDecimal price
) {}