package com.example.lms.users.internal;

import com.example.lms.common.TokenIssuer;
import com.example.lms.common.ConflictException;
import com.example.lms.users.Role;
import com.example.lms.users.UserCreatedEvent;  
import com.example.lms.users.internal.dto.AuthResponse;
import com.example.lms.users.internal.dto.LoginRequest;
import com.example.lms.users.internal.dto.RegisterUserRequest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.BadCredentialsException;
import java.util.Locale;
import java.nio.charset.StandardCharsets;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenIssuer jwtUtils;
    private final ApplicationEventPublisher eventPublisher;  

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       TokenIssuer jwtUtils,
                       ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public AuthResponse register(RegisterUserRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email уже зарегистрирован");
        }

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Пароль слишком длинный");
        }

        UserEntity user = new UserEntity();
        user.setEmail(email);
        String[] name = request.name().trim().split("\\s+", 2);
        user.setFirstName(name[0]);
        user.setLastName(name.length > 1 ? name[1] : "");
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.STUDENT);

        userRepository.save(user);
        eventPublisher.publishEvent(new UserCreatedEvent(user.getId(), user.getEmail()));

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(request.email().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new BadCredentialsException("Неверный email или пароль"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Неверный email или пароль");
        }

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token);
    }
}
