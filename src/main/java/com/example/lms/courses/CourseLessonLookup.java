package com.example.lms.courses;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseLessonLookup {

    boolean existsInCourse(UUID courseId, UUID lessonId);

    Optional<CourseInfo> findCourse(UUID courseId);

    List<LessonInfo> findLessons(UUID courseId);

    Optional<LessonData> findLesson(UUID courseId, UUID lessonId);

    record CourseInfo(UUID id, UUID authorId, String title, CourseStatus status) {}

    record LessonInfo(UUID id, String title, int ordinalNumber) {}

    record LessonData(UUID id, UUID courseId, String title, String content, String videoUrl) {}
}
