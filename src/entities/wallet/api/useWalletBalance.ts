import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { useAuthStore } from '@/entities/user';
import { Wallet } from '../model/types';

export const useWalletBalance = () => {
    const { isAuth, user } = useAuthStore();

    return useQuery<Wallet>({
        queryKey: ['wallet', 'balance', user?.id],
        queryFn: async ({ signal }) => {
            const response = await apiClient.get<Wallet>('/billing/wallets/me', { signal });
            return response.data;
        },
        enabled: isAuth && Boolean(user?.id),
    });
};
