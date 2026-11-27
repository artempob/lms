import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '@/shared/api';

export const usePurchaseCourse = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, string>({
        mutationFn: async (courseId) => {
            await apiClient.post('/purchases', { courseId });
        },
        onSettled: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: ['courses', 'my'] }),
            queryClient.invalidateQueries({ queryKey: ['wallet'] }),
        ]),
    });
};
