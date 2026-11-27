import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { MyCourseSummary } from '../model/types';
import { useAuthStore } from '@/entities/user';

export const useMyCourses = () => {
    const { isAuth, user } = useAuthStore();

    return useQuery<MyCourseSummary[]>({
        queryKey: ['courses', 'my', user?.id],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get<MyCourseSummary[]>('/courses/my', { signal });
            return response.data;
        },
        enabled: isAuth && Boolean(user?.id),
    });
};
