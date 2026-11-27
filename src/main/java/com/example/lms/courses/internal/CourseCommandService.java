package com.example.lms.courses.internal;

import com.example.lms.common.ConflictException;
import com.example.lms.common.NotFoundException;
import com.example.lms.courses.CoursePublishedEvent;
import com.example.lms.courses.CourseStatus;
import com.example.lms.courses.internal.dto.AddLessonRequest;
import com.example.lms.courses.internal.dto.CreateCourseRequest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.util.UUID;

@Service
@Transactional
public class CourseCommandService {

    private final CourseRepository courseRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CourseCommandService(CourseRepository courseRepository,
                                ApplicationEventPublisher eventPublisher) {
        this.courseRepository = courseRepository;
        this.eventPublisher = eventPublisher;
    }

    public UUID createCourse(UUID authorId, CreateCourseRequest request) {
        CourseEntity course = new CourseEntity();
        course.setAuthorId(authorId);
        course.setTitle(request.title().trim());
        course.setDescription(request.description());
        course.setPrice(request.price());
        course.setStatus(CourseStatus.DRAFT);

        CourseEntity savedCourse = courseRepository.save(course);
        return savedCourse.getId();
    }

    public UUID addLesson(
            UUID courseId,
            UUID authorId,
            AddLessonRequest request
    ) {
        CourseEntity course = getCourseAndVerifyAuthor(
                courseId,
                authorId
        );

        LessonEntity lesson = new LessonEntity();
        lesson.setCourse(course);
        lesson.setTitle(request.title().trim());
        lesson.setContent(request.content());
        lesson.setContentUrl(request.contentUrl());
        lesson.setOrdinalNumber(course.getLessons().stream()
                .mapToInt(LessonEntity::getOrdinalNumber).max().orElse(0) + 1);

        course.getLessons().add(lesson);
        courseRepository.flush();

        return lesson.getId();
    }

    public void publishCourse(UUID courseId, UUID authorId) {
        CourseEntity course = getCourseAndVerifyAuthor(courseId, authorId);

        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new ConflictException("Курс уже опубликован");
        }

        if (course.getLessons().isEmpty()) {
            throw new ConflictException("Нельзя опубликовать курс без уроков");
        }

        course.setStatus(CourseStatus.PUBLISHED);
        courseRepository.save(course);

        eventPublisher.publishEvent(new CoursePublishedEvent(
                course.getId(),
                course.getAuthorId(),
                course.getTitle(),
                course.getPrice()
        ));
    }

    private CourseEntity getCourseAndVerifyAuthor(UUID courseId, UUID authorId) {
        CourseEntity course = courseRepository.findForUpdate(courseId)
                .orElseThrow(() -> new NotFoundException("Курс не найден"));

        if (!course.getAuthorId().equals(authorId)) {
            throw new AccessDeniedException("У вас нет прав для редактирования этого курса");
        }
        return course;
    }
}
