import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { CourseSyllabus } from '../model/types';
import { useAuthStore } from '@/entities/user';

export const useCourseSyllabus = (courseId: string) => {
    const { isAuth, user } = useAuthStore();
    return useQuery<CourseSyllabus>({
        queryKey: ['course-progress', courseId, user?.id],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get<CourseSyllabus>(`/courses/${courseId}/syllabus`, { signal });
            return response.data;
        },
        enabled: isAuth && Boolean(user?.id && courseId),
    });
};
