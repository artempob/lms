CREATE TABLE lesson_progress (
                                 id UUID PRIMARY KEY,
                                 enrollment_id UUID NOT NULL REFERENCES enrollments(id),
                                 lesson_id UUID NOT NULL,
                                 completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                 CONSTRAINT uq_enrollment_lesson UNIQUE (enrollment_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);