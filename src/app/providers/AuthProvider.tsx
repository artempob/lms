import React, { useEffect, useState } from 'react';
import { isAxiosError, isCancel } from 'axios';
import { useAuthStore } from '@/entities/user';
import { apiClient } from '@/shared/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setUser, logout, setLoading } = useAuthStore();
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setFailed(false);
        const restore = async () => {
            if (!localStorage.getItem('access_token')) {
                logout();
                return;
            }
            setLoading(true);
            try {
                const response = await apiClient.get('/users/me', { signal: controller.signal });
                if (!controller.signal.aborted) setUser(response.data);
            } catch (error) {
                if (controller.signal.aborted || isCancel(error)) return;
                if (isAxiosError(error) && error.response?.status === 401) {
                    logout();
                } else {
                    setFailed(true);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        void restore();
        return () => controller.abort();
    }, [setUser, logout, setLoading, attempt]);

    if (failed) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
                <h1 className="text-xl font-semibold">Не удалось связаться с сервером</h1>
                <p>Проверьте соединение и повторите попытку.</p>
                <button className="rounded-lg bg-blue-600 px-5 py-3 text-white" onClick={() => setAttempt(v => v + 1)}>
                    Повторить
                </button>
            </main>
        );
    }
    return <>{children}</>;
};
