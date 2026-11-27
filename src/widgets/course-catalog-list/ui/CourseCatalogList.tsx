import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard, usePublishedCourses } from '@/entities/course';
import { Button, Input } from '@/shared/ui';
import styles from './CourseCatalogList.module.scss';

const PAGE_SIZE = 20;

export const CourseCatalogList: React.FC = () => {
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const courses = usePublishedCourses({ limit: PAGE_SIZE + 1, offset: page * PAGE_SIZE, q: query });

    return (
        <div className={styles.container}>
            <form className={styles.filterPanel} onSubmit={event => {
                event.preventDefault(); setQuery(search.trim()); setPage(0);
            }}>
                <div className={styles.searchInput}>
                    <Input aria-label="Поиск курсов" placeholder="Поиск по названию курса..."
                        value={search} onChange={event => setSearch(event.target.value)} />
                </div>
                <Button type="submit" variant="secondary">Найти</Button>
            </form>
            {courses.isLoading && <p role="status">Загрузка каталога...</p>}
            {courses.isError && (
                <div role="alert" className={styles.emptyState}>
                    <p>Не удалось загрузить каталог.</p>
                    <Button variant="secondary" onClick={() => void courses.refetch()}>Повторить</Button>
                </div>
            )}
            <div className={styles.grid}>
                {courses.data?.slice(0, PAGE_SIZE).map(course => (
                    <CourseCard key={course.id} course={course} actionSlot={
                        <Button onClick={() => navigate(`/courses/${course.id}`)}>Подробнее</Button>
                    } />
                ))}
            </div>
            {courses.isSuccess && courses.data.length === 0 && (
                <div className={styles.emptyState}>Курсы не найдены. Попробуйте изменить запрос.</div>
            )}
            {courses.isSuccess && (page > 0 || courses.data.length > PAGE_SIZE) && (
                <div className="flex items-center justify-center gap-4 py-4">
                    <Button variant="secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Назад</Button>
                    <span>Страница {page + 1}</span>
                    <Button variant="secondary" disabled={courses.data.length <= PAGE_SIZE} onClick={() => setPage(p => p + 1)}>Далее</Button>
                </div>
            )}
        </div>
    );
};
