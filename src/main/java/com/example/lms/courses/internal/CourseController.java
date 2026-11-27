package com.example.lms.courses.internal;

import com.example.lms.courses.internal.dto.AddLessonRequest;
import com.example.lms.courses.internal.dto.CreateCourseRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.lms.common.JwtPrincipal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseCommandService courseCommandService;

    public CourseController(CourseCommandService courseCommandService) {
        this.courseCommandService = courseCommandService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Map<String, UUID>> createCourse(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody CreateCourseRequest request
    ) {
        UUID courseId = courseCommandService.createCourse(
                principal.id(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("id", courseId));
    }

    @PostMapping("/{courseId}/lessons")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Map<String, UUID>> addLesson(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody AddLessonRequest request
    ) {
        UUID lessonId = courseCommandService.addLesson(
                courseId,
                principal.id(),
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("id", lessonId));
    }

    @PostMapping("/{courseId}/publish")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Void> publishCourse(
            @PathVariable UUID courseId,
            @AuthenticationPrincipal JwtPrincipal principal
    ) {
        courseCommandService.publishCourse(
                courseId,
                principal.id()
        );

        return ResponseEntity.ok().build();
    }
}