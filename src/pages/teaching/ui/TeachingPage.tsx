import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user';
import { CourseSummary } from '@/entities/course/model/types';
import { apiClient, getApiError } from '@/shared/api';
import { Loader } from '@/shared/ui';

export const TeachingPage: React.FC = () => {
    const userId = useAuthStore(state => state.user?.id);
    const courses = useQuery({
        queryKey: ['courses', 'authored', userId],
        queryFn: async ({ signal }) => (await apiClient.get<CourseSummary[]>('/courses/authored', { signal })).data,
        enabled: Boolean(userId),
    });
    if (courses.isLoading) return <Loader center />;
    return <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Мои материалы</h1>
            <Link className="rounded-lg bg-blue-600 px-4 py-3 text-white" to="/courses/new">Создать курс</Link>
        </div>
        {courses.error && <p role="alert" className="text-red-600">{getApiError(courses.error)}</p>}
        {courses.data?.length === 0 && <p>Вы ещё не создали ни одного курса.</p>}
        {courses.data?.map(course => <article key={course.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm">
            <div><h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-600">{course.status === 'PUBLISHED' ? 'Опубликован' : 'Черновик'}</p></div>
            <Link className="text-blue-600" to={`/courses/${course.id}/edit`}>Управление курсом →</Link>
        </article>)}
    </main>;
};
