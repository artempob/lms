package com.example.lms.users.internal;

import com.example.lms.common.NotFoundException;
import com.example.lms.users.internal.dto.UpdateProfileRequest;
import com.example.lms.users.internal.dto.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {
    private final UserRepository users;

    public UserService(UserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        return response(findUser(userId));
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        UserEntity user = findUser(userId);
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        return response(user);
    }

    private UserEntity findUser(UUID userId) {
        return users.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
    }

    private UserResponse response(UserEntity user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFirstName(),
                user.getLastName(), user.getRole());
    }
}
