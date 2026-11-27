import React from 'react';
import { useCompleteLesson } from '../api/useCompleteLesson';
import { Button } from '@/shared/ui';
import { getApiError } from '@/shared/api';

interface CompleteLessonButtonProps {
    courseId: string;
    lessonId: string;
    isCompleted: boolean;
}

export const CompleteLessonButton: React.FC<CompleteLessonButtonProps> = ({ courseId, lessonId, isCompleted }) => {
    const completion = useCompleteLesson();
    if (isCompleted) return <p role="status" className="mt-6 rounded-lg bg-green-50 p-4 font-medium text-green-700">✓ Урок пройден</p>;
    return <div className="mt-6 flex flex-col items-start gap-3">
        <Button disabled={completion.isPending} isLoading={completion.isPending}
            onClick={() => completion.mutate({ courseId, lessonId })}>Завершить урок</Button>
        {completion.error && <p role="alert" className="text-sm text-red-600">{getApiError(completion.error)}</p>}
    </div>;
};
