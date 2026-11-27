package com.example.lms.users;
import java.util.UUID;
public record UserCreatedEvent(UUID userId, String email) {}