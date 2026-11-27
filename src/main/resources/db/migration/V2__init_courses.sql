CREATE TABLE courses (
                         id UUID PRIMARY KEY,
                         title VARCHAR(255) NOT NULL,
                         description TEXT,
                         author_id UUID NOT NULL, -- Ссылка на пользователей из модуля users
                         price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
                         status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
                         id UUID PRIMARY KEY,
                         course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
                         title VARCHAR(255) NOT NULL,
                         content TEXT,
                         content_url VARCHAR(1000),
                         sequence_order INT NOT NULL,
                         ordinal_number INT NOT NULL,
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_author ON courses(author_id);
CREATE INDEX idx_lessons_course_order ON lessons(course_id, sequence_order);