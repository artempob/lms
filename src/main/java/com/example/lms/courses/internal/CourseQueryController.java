package com.example.lms.courses.internal;

import com.example.lms.courses.internal.dto.CourseDetailsResponse;
import com.example.lms.courses.internal.dto.CourseSummaryResponse;
import com.example.lms.courses.internal.dto.MyCourseSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import com.example.lms.common.NotFoundException;
import com.example.lms.common.JwtPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;


@RestController
@RequestMapping("/api/v1/courses")
public class CourseQueryController {

    private final CourseQueryService courseQueryService;

    public CourseQueryController(CourseQueryService courseQueryService) {
        this.courseQueryService = courseQueryService;
    }

    @GetMapping
    public ResponseEntity<List<CourseSummaryResponse>> getCatalog(
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit,
            @RequestParam(defaultValue = "0") @Min(0) int offset,
            @RequestParam(defaultValue = "") @Size(max = 255) String q) {

        List<CourseSummaryResponse> courses = courseQueryService.findPublishedCourses(limit, offset, q);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/my")
    public ResponseEntity<List<MyCourseSummaryResponse>> getMyCourses(
            @AuthenticationPrincipal JwtPrincipal principal
    ) {
        List<MyCourseSummaryResponse> myCourses = courseQueryService.findMyCourses(principal.id());
        return ResponseEntity.ok(myCourses);
    }

    @GetMapping("/authored")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<CourseSummaryResponse> getAuthoredCourses(
            @AuthenticationPrincipal JwtPrincipal principal
    ) {
        return courseQueryService.findAuthoredCourses(principal.id());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailsResponse> getCourseDetails(
            @PathVariable UUID id,
            @AuthenticationPrincipal JwtPrincipal principal
    ) {
        UUID viewerId = principal != null ? principal.id() : null;

        CourseDetailsResponse course = courseQueryService
                .findCourseDetailsById(id, viewerId)
                .orElseThrow(() -> new NotFoundException(
                        "Курс не найден"
                ));

        return ResponseEntity.ok(course);
    }
}
