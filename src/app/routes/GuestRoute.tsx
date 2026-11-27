import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { Loader } from '@/shared/ui';

export const GuestRoute: React.FC = () => {
    const { isAuth, isLoading } = useAuthStore();

    if (isLoading) {
        return <Loader center />;
    }

    if (isAuth) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};