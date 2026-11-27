import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '@/shared/api';

interface CompleteLessonParams {
    courseId: string;
    lessonId: string;
}

export const useCompleteLesson = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, CompleteLessonParams>({
        mutationFn: async ({ courseId, lessonId }) => {
            await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
        },
        onSuccess: (_, variables) => Promise.all([
            queryClient.invalidateQueries({ queryKey: ['course-progress', variables.courseId] }),
            queryClient.invalidateQueries({ queryKey: ['lesson', variables.courseId, variables.lessonId] }),
            queryClient.invalidateQueries({ queryKey: ['courses', 'my'] }),
        ]),
    });
};
