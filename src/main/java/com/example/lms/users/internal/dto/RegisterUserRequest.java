package com.example.lms.users.internal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(
        @NotBlank(message = "Имя обязательно")
        @Size(max = 255)
        String name,

        @NotBlank
        @Email(message = "Неверный формат email")
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(min = 6, message = "Пароль должен быть не менее 6 символов")
        String password
) {}
