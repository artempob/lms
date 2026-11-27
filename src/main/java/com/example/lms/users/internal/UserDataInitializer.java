package com.example.lms.users.internal;

import com.example.lms.users.Role;
import com.example.lms.users.UserCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
class UserDataInitializer implements CommandLineRunner {  

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher events;

    @Override
    @Transactional
    public void run(String... args) {
        initAdmin();
        initTeacher();
        userRepository.findByEmailIgnoreCase("admin@lms.com").ifPresent(user ->
                events.publishEvent(new UserCreatedEvent(user.getId(), user.getEmail())));
        userRepository.findByEmailIgnoreCase("teacher@lms.com").ifPresent(user ->
                events.publishEvent(new UserCreatedEvent(user.getId(), user.getEmail())));
    }

    private void initAdmin() {
        String adminEmail = "admin@lms.com";
        if (!userRepository.existsByEmailIgnoreCase(adminEmail)) {
            UserEntity admin = new UserEntity();
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode("admin"));
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);
            log.info("Создан дефолтный пользователь ADMIN ({} / admin)", adminEmail);
        }
    }

    private void initTeacher() {
        String teacherEmail = "teacher@lms.com";
        if (!userRepository.existsByEmailIgnoreCase(teacherEmail)) {
            UserEntity teacher = new UserEntity();
            teacher.setEmail(teacherEmail);
            teacher.setPasswordHash(passwordEncoder.encode("teacher"));
            teacher.setFirstName("John");
            teacher.setLastName("Teacher");
            teacher.setRole(Role.TEACHER);

            userRepository.save(teacher);
            log.info("Создан дефолтный пользователь TEACHER ({} / teacher)", teacherEmail);
        }
    }
}
