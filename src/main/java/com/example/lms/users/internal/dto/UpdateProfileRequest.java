package com.example.lms.users.internal.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank(message = "Имя не может быть пустым")
        String firstName,

        @NotBlank(message = "Фамилия не может быть пустой")
        String lastName
) {}