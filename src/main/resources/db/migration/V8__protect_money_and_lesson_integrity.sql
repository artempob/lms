ALTER TABLE courses
    ADD CONSTRAINT ck_courses_price_nonnegative CHECK (price >= 0);

ALTER TABLE wallets
    ADD CONSTRAINT ck_wallets_balance_nonnegative CHECK (balance >= 0);

ALTER TABLE transactions
    ADD CONSTRAINT ck_transactions_amount_positive CHECK (amount > 0),
    ADD CONSTRAINT ck_transactions_type CHECK (type IN ('DEPOSIT', 'WITHDRAWAL'));

ALTER TABLE lessons
    ADD CONSTRAINT ck_lessons_ordinal_positive CHECK (ordinal_number > 0),
    ADD CONSTRAINT uq_lessons_course_order UNIQUE (course_id, ordinal_number);

DROP INDEX public.idx_lessons_course_order;

ALTER TABLE lesson_progress
    ADD CONSTRAINT fk_lesson_progress_lesson
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
