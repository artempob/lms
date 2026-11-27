import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/shared/api/base';
import { Button } from '@/shared/ui';
import { useAuthStore } from '@/entities/user';
import styles from './LoginForm.module.scss';
import { getApiError } from '@/shared/api';
import { useQueryClient } from '@tanstack/react-query';

interface LoginFormData {
    email: string;
    password: string;
}

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const loginResponse = await apiClient.post('/users/login', data);
            const token = loginResponse.data.token;

            if (token) {
                const userResponse = await apiClient.get('/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                queryClient.clear();
                setAuth(userResponse.data, token);

                navigate('/');
            } else {
                setErrorMessage('Сервер не вернул данные для входа.');
            }
        } catch (error: unknown) {
            setErrorMessage(getApiError(error, 'Не удалось войти. Попробуйте ещё раз.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {errorMessage && (
                <div className={styles.errorToast} role="alert">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                        {...register('email', { required: 'Email обязателен' })}
                        type="email"
                        placeholder="Введите email"
                        className={styles.formInput}
                    />
                    {errors.email && <p className={styles.formError}>{errors.email.message}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Пароль</label>
                    <input
                        {...register('password', { required: 'Пароль обязателен' })}
                        type="password"
                        placeholder="••••••••"
                        className={styles.formInput}
                    />
                    {errors.password && <p className={styles.formError}>{errors.password.message}</p>}
                </div>

                <Button type="submit" disabled={isLoading} variant="primary">
                    {isLoading ? 'Авторизация...' : 'Войти'}
                </Button>

                <Button type="button" onClick={() => navigate('/register')} variant="secondary">
                    Зарегистрироваться
                </Button>
            </form>
        </>
    );
};
