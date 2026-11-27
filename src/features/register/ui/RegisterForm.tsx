import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/shared/api/base';
import { Button } from '@/shared/ui';
import styles from './RegisterForm.module.scss';
import {RegisterFormData} from '../model/types.ts'
import { getApiError } from '@/shared/api';


export const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            await apiClient.post('/users/register', data);
            navigate('/login');
        } catch (error) {
            setErrorMessage(getApiError(error, 'Не удалось зарегистрироваться. Попробуйте ещё раз.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {errorMessage && <p role="alert" className="text-sm text-red-600">{errorMessage}</p>}
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Имя</label>
                <input
                    {...register('name', { required: 'Имя обязательно' })}
                    type="text"
                    placeholder="Введите ваше имя"
                    className={styles.formInput}
                />
                {errors.name && <p className={styles.formError}>{errors.name.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                    {...register('email', {
                        required: 'Email обязателен',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Неверный формат email'
                        }
                    })}
                    type="email"
                    placeholder="Введите email"
                    className={styles.formInput}
                />
                {errors.email && <p className={styles.formError}>{errors.email.message}</p>}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Пароль</label>
                <input
                    {...register('password', {
                        required: 'Пароль обязателен',
                        minLength: { value: 6, message: 'Минимум 6 символов' }
                    })}
                    type="password"
                    placeholder="••••••••"
                    className={styles.formInput}
                />
                {errors.password && <p className={styles.formError}>{errors.password.message}</p>}
            </div>

            <div className={styles.actions}>
                <Button type="submit" disabled={isLoading} variant="primary">
                    {isLoading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
                </Button>

                <Button
                    type="button"
                    onClick={() => navigate('/login')}
                    variant="clear"
                >
                    Уже есть аккаунт? Войти
                </Button>
            </div>
        </form>
    );
};
