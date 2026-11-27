import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourseSyllabus } from '@/entities/course';
import { LessonMenuItem } from '@/entities/lesson';
import { getApiError } from '@/shared/api';
import { Button } from '@/shared/ui';
import styles from './CourseSidebar.module.scss';

interface CourseSidebarProps { courseId: string; activeLessonId?: string }

export const CourseSidebar: React.FC<CourseSidebarProps> = ({ courseId, activeLessonId }) => {
    const navigate = useNavigate();
    const syllabus = useCourseSyllabus(courseId);
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <Link to={`/courses/${courseId}`} className="text-sm text-blue-600">← К курсу</Link>
                <h2 className={styles.title}>Программа курса</h2>
                {syllabus.data && <p className="mt-2 text-sm text-gray-600">
                    Пройдено {syllabus.data.completedLessons} из {syllabus.data.totalLessons}
                </p>}
            </div>
            {syllabus.isLoading && <p className="p-4" role="status">Загрузка программы...</p>}
            {syllabus.error && <div className="p-4" role="alert">
                <p className={styles.errorText}>{getApiError(syllabus.error)}</p>
                <Button variant="secondary" onClick={() => void syllabus.refetch()}>Повторить</Button>
            </div>}
            <nav className={styles.nav}>
                <ul className={styles.lessonList}>
                    {syllabus.data?.lessons.map(lesson => (
                        <li key={lesson.id}>
                            <LessonMenuItem title={lesson.title} index={lesson.ordinalNumber}
                                isActive={lesson.id === activeLessonId} isCompleted={lesson.isCompleted}
                                onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)} />
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
