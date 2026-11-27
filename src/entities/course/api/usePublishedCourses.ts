import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { CourseSummary } from '../model/types';

interface FetchCoursesParams {
    limit?: number;
    offset?: number;
    q?: string;
}

export const usePublishedCourses = ({ limit = 20, offset = 0, q = '' }: FetchCoursesParams = {}) => {
    return useQuery<CourseSummary[]>({
        queryKey: ['courses', 'published', { limit, offset, q }],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get<CourseSummary[]>('/courses', {
                params: { limit, offset, q }, signal,
            });
            return response.data;
        },
    });
};
