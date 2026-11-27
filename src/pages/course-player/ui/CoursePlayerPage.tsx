import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useCourseSyllabus } from '@/entities/course';
import { getApiError } from '@/shared/api';
import { Button, Loader } from '@/shared/ui';

export const CoursePlayerPage: React.FC = () => {
    const { courseId = '' } = useParams<{ courseId: string }>();
    const syllabus = useCourseSyllabus(courseId);
    if (syllabus.isLoading) return <Loader center />;
    if (syllabus.error) return <div className="p-8 text-center" role="alert">
        <p className="mb-4 text-red-600">{getApiError(syllabus.error)}</p>
        <Button variant="secondary" onClick={() => void syllabus.refetch()}>Повторить</Button>
    </div>;
    const firstLesson = syllabus.data?.lessons[0];
    if (!firstLesson) return <div className="p-8 text-center">
        <p className="mb-4">В этом курсе пока нет уроков.</p>
        <Link className="text-blue-600" to={`/courses/${courseId}`}>К описанию курса</Link>
    </div>;
    return <Navigate replace to={`/courses/${courseId}/lessons/${firstLesson.id}`} />;
};
