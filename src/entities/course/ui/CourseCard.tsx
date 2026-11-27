import React, { ReactNode } from 'react';
import { CourseProgress } from './CourseProgress';
import styles from './CourseCard.module.scss';

export interface Course {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
}

interface CourseCardProps {
    course: Course;
    progress?: number;
    actionSlot?: ReactNode;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, progress, actionSlot }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className={styles.image} />
                ) : (
                    <div className={styles.noImage}>Нет изображения</div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{course.title}</h3>

                {course.description && (
                    <p className={styles.description}>{course.description}</p>
                )}

                {typeof progress === 'number' && (
                    <div className={styles.progressWrapper}>
                        <CourseProgress progress={progress} showLabel={true} />
                    </div>
                )}

                <div className={styles.footer}>
                    <span className={styles.price}>
                        {course.price === 0 ? 'Бесплатно' : `${course.price} ₽`}
                    </span>

                    {actionSlot && (
                        <div className={styles.actions}>
                            {actionSlot}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};