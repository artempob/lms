import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/base';
import { CreateCourseFormValues } from '../model/createCourseSchema.ts';

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateCourseFormValues) => {
            const response = await apiClient.post<{ id: string }>('/courses', data);
            return response.data.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};
