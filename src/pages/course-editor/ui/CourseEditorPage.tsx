import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user';
import { useCourseDetails } from '@/entities/course/api/useCourseDetails';
import { apiClient, getApiError } from '@/shared/api';
import { Button, Loader } from '@/shared/ui';

export const CourseEditorPage: React.FC = () => {
    const { courseId = '' } = useParams<{ courseId: string }>();
    const user = useAuthStore(state => state.user);
    const course = useCourseDetails(courseId);
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [contentUrl, setContentUrl] = useState('');
    const [notice, setNotice] = useState('');
    const refresh = () => Promise.all([
        queryClient.invalidateQueries({ queryKey: ['course', courseId] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
        queryClient.invalidateQueries({ queryKey: ['course-progress', courseId] }),
    ]);
    const lesson = useMutation({
        mutationFn: () => apiClient.post(`/courses/${courseId}/lessons`, {
            title: title.trim(), content: content.trim() || null, contentUrl: contentUrl.trim() || null,
        }),
        onSuccess: async () => {
            setTitle(''); setContent(''); setContentUrl(''); setNotice('Урок добавлен.');
            await refresh();
        },
    });
    const publication = useMutation({
        mutationFn: () => apiClient.post(`/courses/${courseId}/publish`),
        onSuccess: async () => { setNotice('Курс опубликован и появился в каталоге.'); await refresh(); },
    });

    if (course.isLoading) return <Loader center />;
    if (course.error || !course.data) return <p role="alert" className="p-8 text-red-600">{getApiError(course.error, 'Курс не найден.')}</p>;
    if (course.data.authorId !== user?.id) return <p role="alert" className="p-8 text-red-600">Управлять курсом может его автор.</p>;

    return (
        <main className="mx-auto w-full max-w-4xl space-y-6 p-6">
            <Link to="/teaching" className="text-blue-600">← Мои материалы</Link>
            <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold">{course.data.title}</h1>
                <p>Статус: {course.data.status === 'PUBLISHED' ? 'Опубликован' : 'Черновик'}</p>
                <div className="flex flex-wrap gap-3">
                    <Link to={`/courses/${courseId}`} className="rounded-lg border px-4 py-2">Карточка курса</Link>
                    {course.data.lessons.length > 0 && <Link to={`/courses/${courseId}/player`} className="rounded-lg border px-4 py-2">Предпросмотр уроков</Link>}
                    {course.data.status !== 'PUBLISHED' && <Button
                        disabled={!course.data.lessons.length || publication.isPending || lesson.isPending || course.isFetching}
                        isLoading={publication.isPending} onClick={() => { setNotice(''); publication.mutate(); }}>
                        Опубликовать курс
                    </Button>}
                </div>
                {!course.data.lessons.length && <p className="text-sm text-gray-600">Для публикации добавьте хотя бы один урок.</p>}
                {notice && <p role="status" className="text-green-700">{notice}</p>}
                {publication.error && <p role="alert" className="text-red-600">{getApiError(publication.error)}</p>}
            </section>
            <section className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Уроки курса</h2>
                <ol className="space-y-2">
                    {course.data.lessons.map(item => <li key={item.id}>
                        <Link className="text-blue-600" to={`/courses/${courseId}/lessons/${item.id}`}>
                            {item.ordinalNumber}. {item.title}
                        </Link>
                    </li>)}
                </ol>
                {!course.data.lessons.length && <p className="text-gray-500">Уроков пока нет.</p>}
            </section>
            <form className="space-y-4 rounded-xl bg-white p-6 shadow-sm" onSubmit={event => {
                event.preventDefault(); setNotice(''); lesson.mutate();
            }}>
                <h2 className="text-xl font-semibold">Добавить урок</h2>
                <label className="block space-y-2">Название урока
                    <input className="block w-full rounded-lg border p-3" required maxLength={255}
                        value={title} onChange={event => setTitle(event.target.value)} />
                </label>
                <label className="block space-y-2">Текст урока
                    <textarea className="block w-full rounded-lg border p-3" rows={8} maxLength={50000}
                        value={content} onChange={event => setContent(event.target.value)} />
                </label>
                <label className="block space-y-2">Ссылка на видео (необязательно)
                    <input className="block w-full rounded-lg border p-3" type="url" maxLength={1000}
                        placeholder="https://example.com/video.mp4" value={contentUrl}
                        onChange={event => setContentUrl(event.target.value)} />
                </label>
                {lesson.error && <p role="alert" className="text-red-600">{getApiError(lesson.error)}</p>}
                <Button type="submit" disabled={lesson.isPending || !title.trim()} isLoading={lesson.isPending}>Добавить урок</Button>
            </form>
        </main>
    );
};
