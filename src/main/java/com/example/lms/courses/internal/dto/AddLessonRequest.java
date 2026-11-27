package com.example.lms.courses.internal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddLessonRequest(
        @NotBlank @Size(max = 255) String title,
        @Size(max = 1000)
        @Pattern(regexp = "^(https?://\\S+)?$", message = "Укажи HTTP или HTTPS ссылку")
        String contentUrl,
        @Size(max = 50000) String content
) {}
