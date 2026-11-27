import { apiClient } from '@/shared/api';
import { User } from '@/entities/user';

export interface UpdateProfileDto {
    firstName: string;
    lastName: string;
}

export const updateProfileApi = async (data: UpdateProfileDto): Promise<User> => {
    const response = await apiClient.patch<User>('/users/me', data);
    return response.data;
};