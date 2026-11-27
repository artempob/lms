import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { Lesson } from '../model/types';
import { useAuthStore } from '@/entities/user';

export const useLessonDetails = (courseId: string, lessonId: string) => {
    const { isAuth, user } = useAuthStore();
    return useQuery<Lesson>({
        queryKey: ['lesson', courseId, lessonId, user?.id],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get<Lesson>(`/courses/${courseId}/lessons/${lessonId}`, { signal });
            return response.data;
        },
        enabled: isAuth && Boolean(user?.id && courseId && lessonId),
    });
};
