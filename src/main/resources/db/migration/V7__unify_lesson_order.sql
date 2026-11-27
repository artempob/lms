DROP INDEX public.idx_lessons_course_order;

ALTER TABLE public.lessons
    DROP COLUMN sequence_order;

CREATE INDEX idx_lessons_course_order
    ON public.lessons (course_id, ordinal_number);