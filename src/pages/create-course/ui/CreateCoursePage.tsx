import React from 'react';
import { CreateCourseForm } from '@/features/create-course';
import styles from './CreateCoursePage.module.scss';

export const CreateCoursePage: React.FC = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Создание нового курса</h1>
                    <p className={styles.subtitle}>
                        Заполните базовую информацию. Уроки можно будет добавить позже.
                    </p>
                </div>

                <CreateCourseForm />
            </div>
        </div>
    );
};