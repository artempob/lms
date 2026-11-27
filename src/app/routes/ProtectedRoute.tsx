import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { Loader } from '@/shared/ui';

export const ProtectedRoute: React.FC = () => {
    const { isAuth, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <Loader />
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};