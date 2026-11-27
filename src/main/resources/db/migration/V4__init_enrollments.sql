CREATE TABLE enrollments (
                             id UUID PRIMARY KEY,
                             student_id UUID NOT NULL,
                             course_id UUID NOT NULL,
                             status VARCHAR(50) NOT NULL, -- ACTIVE, COMPLETED, REVOKED
                             enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Композитный уникальный индекс для защиты от двойных записей
                             CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);

-- Индекс для быстрого поиска всех курсов студента (Read Model)
CREATE INDEX idx_enrollments_student ON enrollments(student_id);