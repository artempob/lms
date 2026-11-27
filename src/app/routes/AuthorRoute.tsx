import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';

export const AuthorRoute = () => {
    const role = useAuthStore(state => state.user?.role);
    return role === 'TEACHER' || role === 'ADMIN'
        ? <Outlet /> : <Navigate to="/" replace />;
};
