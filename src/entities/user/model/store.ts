import { create } from 'zustand';
import { User } from './types';

interface AuthState {
    user: User | null;
    isAuth: boolean;
    isLoading: boolean;

    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuth: false,
    isLoading: !!localStorage.getItem('access_token'),

    setAuth: (user, token) => {
        localStorage.setItem('access_token', token);
        set({ user, isAuth: true, isLoading: false });
    },

    setUser: (user) => {
        set({ user, isAuth: true, isLoading: false });
    },

    logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isAuth: false, isLoading: false });
    },

    setLoading: (isLoading) => {
        set({ isLoading });
    },
}));
