import React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard, useMyCourses } from '@/entities/course';
import styles from './UserCoursesList.module.scss';

export const UserCoursesList: React.FC = () => {
    const { data: courses = [], isLoading, isError } = useMyCourses();

    if (isLoading) {
        return (
            <div className={styles.loader}>
                <span>Загрузка ваших курсов...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.error}>
                Произошла ошибка при загрузке курсов. Попробуйте обновить страницу.
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <p className={styles.emptyText}>Вы пока не записаны ни на один курс</p>
                <Link to="/" className={styles.primaryLink}>
                    Перейти в каталог
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    course={course}
                    progress={course.totalLessons === 0 ? 0 : Math.round(course.completedLessons * 100 / course.totalLessons)}
                    actionSlot={
                        <Link
                            to={`/courses/${course.id}/player`}
                            className={styles.actionSlotLink}
                        >
                            Продолжить обучение
                        </Link>
                    }
                />
            ))}
        </div>
    );
};
