import React from 'react';
import { useLessonDetails, LessonContent } from '@/entities/lesson';
import { CompleteLessonButton } from '@/features/mark-lesson-complete';

interface LessonViewerProps {
    courseId: string;
    lessonId: string;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ courseId, lessonId }) => {
    const { data: lesson, isLoading, isError } = useLessonDetails(courseId, lessonId);

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6" />
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
            </div>
        );
    }

    if (isError || !lesson) {
        return (
            <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 flex flex-col items-center justify-center text-center">
                <svg className="w-12 h-12 mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-bold">Не удалось загрузить урок</h3>
                <p className="mt-1 text-sm">Возможно, он был удален или у вас нет к нему доступа.</p>
            </div>
        );
    }

    return (
        <>
            <LessonContent
                title={lesson.title}
                videoUrl={lesson.videoUrl}
                content={lesson.content}
            />

            {lesson.canComplete ? <CompleteLessonButton
                courseId={courseId}
                lessonId={lesson.id}
                isCompleted={lesson.isCompleted}
            /> : <p className="mt-6 text-sm text-gray-500">Вы просматриваете свой курс.</p>}
        </>
    );
};
