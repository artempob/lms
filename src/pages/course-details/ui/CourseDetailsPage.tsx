import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseDetails } from '@/entities/course/api/useCourseDetails';
import { useMyCourses } from '@/entities/course/api/useMyCourses';
import { CourseInfo } from '@/entities/course';
import { LessonMenuItem } from '@/entities/lesson';
import { PurchaseCourseButton } from '@/features/purchase-course/ui/PurchaseCourseButton';
import { Button } from '@/shared/ui';
import styles from './CourseDetailsPage.module.scss';
import { useAuthStore } from '@/entities/user';

export const CourseDetailsPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);

    const { data: course, isLoading: isCourseLoading, isError } = useCourseDetails(courseId!);
    const { data: myCourses, isLoading: isMyCoursesLoading } = useMyCourses();

    if (isCourseLoading || isMyCoursesLoading) {
        return (
            <div className={styles.centerState}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (isError || !course) {
        return (
            <div className={styles.centerState}>
                <span className={styles.errorText}>Курс не найден.</span>
            </div>
        );
    }

    const isEnrolled = myCourses?.some((myCourse) => myCourse.id === courseId);
    const isAuthor = course.authorId === user?.id;

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                <div className={styles.card}>
                    <div className={styles.statusWrapper}>
                        <span className={styles.statusBadge}>
                            {course.status === 'PUBLISHED' ? 'Опубликован' : course.status}
                        </span>
                    </div>

                    <CourseInfo
                        title={course.title}
                        description={course.description || 'Описание пока не добавлено.'}
                        authorFirstName={course.authorFirstName || 'Автор курса'}
                        authorLastName={course.authorLastName || ''}
                    />

                    <div className={styles.footer}>
                        <div className={styles.price}>
                            {course.price} ₽
                        </div>

                        {isAuthor ? (
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={() => navigate(`/courses/${courseId}/edit`)}>Управление курсом</Button>
                                <Button variant="secondary" disabled={!course.lessons.length}
                                    onClick={() => navigate(`/courses/${courseId}/player`)}>Предпросмотр</Button>
                            </div>
                        ) : isEnrolled ? (
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/courses/${courseId}/player`)}
                            >
                                Перейти к обучению
                            </Button>
                        ) : (
                            <PurchaseCourseButton courseId={course.id} price={course.price} />
                        )}
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Программа курса</h2>

                    {course.lessons && course.lessons.length > 0 ? (
                        <div className={styles.lessonList}>
                            {course.lessons.map((lesson, index) => (
                                <LessonMenuItem
                                    key={lesson.id}
                                    title={lesson.title}
                                    index={lesson.ordinalNumber || index + 1}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyText}>Уроки скоро появятся.</p>
                    )}
                </div>

            </div>
        </div>
    );
};
