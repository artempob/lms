import React from 'react';
import { useParams } from 'react-router-dom';
import { CourseSidebar } from '@/widgets/course-sidebar';
import { LessonViewer } from '@/widgets/lesson-viewer';
import styles from './LessonPage.module.scss';

export const LessonPage: React.FC = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();

    if (!courseId || !lessonId) return null;

    return (
        <div className={styles.page}>
            <CourseSidebar courseId={courseId} activeLessonId={lessonId} />
            <main className={styles.mainContent}>
                <LessonViewer courseId={courseId} lessonId={lessonId} />
            </main>
        </div>
    );
};