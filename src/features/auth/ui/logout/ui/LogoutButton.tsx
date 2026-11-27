import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { useQueryClient } from '@tanstack/react-query';

export const LogoutButton: React.FC = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        queryClient.clear();
        logout();
        navigate('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
            Выйти
        </button>
    );
};
