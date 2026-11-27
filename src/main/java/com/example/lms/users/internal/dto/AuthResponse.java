package com.example.lms.users.internal.dto;
import jakarta.validation.constraints.NotBlank;

public record AuthResponse(
        @NotBlank
        String token
) {}