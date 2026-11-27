package com.example.lms.common;

import java.util.UUID;

public interface TokenIssuer {
    String generateToken(UUID userId, String email, String role);
}
