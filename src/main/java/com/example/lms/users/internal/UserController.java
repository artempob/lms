package com.example.lms.users.internal;

import com.example.lms.common.JwtPrincipal;
import com.example.lms.users.internal.dto.AuthResponse;
import com.example.lms.users.internal.dto.LoginRequest;
import com.example.lms.users.internal.dto.RegisterUserRequest;
import com.example.lms.users.internal.dto.UpdateProfileRequest;
import com.example.lms.users.internal.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterUserRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(@AuthenticationPrincipal JwtPrincipal principal) {
        return userService.getCurrentUser(principal.id());
    }

    @PatchMapping("/me")
    public UserResponse updateProfile(@AuthenticationPrincipal JwtPrincipal principal,
                                      @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(principal.id(), request);
    }
}
