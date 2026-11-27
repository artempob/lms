package com.example.lms.common;

import java.util.UUID;

public record JwtPrincipal(UUID id, String email) {}
