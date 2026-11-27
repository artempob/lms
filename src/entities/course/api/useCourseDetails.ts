import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/base';
import { CourseDetails } from '../model/types';
import { useAuthStore } from '@/entities/user';

export const useCourseDetails = (courseId: string) => {
    const userId = useAuthStore((state) => state.user?.id);
    return useQuery({
        queryKey: ['course', courseId, userId],
        queryFn: async ({ signal }) => {
            const { data } = await apiClient.get<CourseDetails>(`/courses/${courseId}`, { signal });
            return data;
        },
        enabled: !!courseId,
    });
};
