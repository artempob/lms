package com.example.lms.enrollments.internal;

import com.example.lms.common.JwtPrincipal;
import com.example.lms.enrollments.internal.dto.CourseSyllabusResponse;
import com.example.lms.enrollments.internal.dto.LessonResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
public class EnrollmentController {

    private final ProgressTrackingService progressTrackingService;
    private final LearningQueryService learning;

    public EnrollmentController(ProgressTrackingService progressTrackingService,
                                LearningQueryService learning) {
        this.progressTrackingService = progressTrackingService;
        this.learning = learning;
    }

    @GetMapping("/{courseId}/lessons/{lessonId}")
    public LessonResponse getLesson(@PathVariable UUID courseId, @PathVariable UUID lessonId,
                                     @AuthenticationPrincipal JwtPrincipal principal) {
        return learning.getLesson(principal.id(), courseId, lessonId);
    }

    @GetMapping("/{courseId}/syllabus")
    public CourseSyllabusResponse getSyllabus(@PathVariable UUID courseId,
                                              @AuthenticationPrincipal JwtPrincipal principal) {
        return learning.getSyllabus(principal.id(), courseId);
    }

    @PostMapping("/{courseId}/lessons/{lessonId}/complete")
    public ResponseEntity<Void> completeLesson(
            @PathVariable UUID courseId,
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal JwtPrincipal principal) {  

        progressTrackingService.markLessonAsCompleted(principal.id(), courseId, lessonId);

        return ResponseEntity.ok().build();
    }
}
