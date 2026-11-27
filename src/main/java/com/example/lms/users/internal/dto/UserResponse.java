package com.example.lms.users.internal.dto;

import com.example.lms.users.Role;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Role role
) {}