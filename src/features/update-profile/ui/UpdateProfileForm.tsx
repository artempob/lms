import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/entities/user';
import { Input, Button } from '@/shared/ui';
import { updateProfileApi } from '../api/updateProfile';
import { updateProfileSchema, UpdateProfileFormData } from '../model/schema';
import styles from './UpdateProfileForm.module.scss';

export const UpdateProfileForm: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const onSubmit = async (data: UpdateProfileFormData) => {
        setStatus(null);
        try {
            const updatedUser = await updateProfileApi(data);

            if (setUser) {
                setUser(updatedUser);
            } else {
                useAuthStore.setState({ user: updatedUser });
            }

            setStatus({ type: 'success', text: 'Данные профиля успешно обновлены' });
        } catch (error) {
            setStatus({ type: 'error', text: 'Ошибка при сохранении данных профиля' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {status && (
                <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                    {status.text}
                </div>
            )}

            <div className={styles.grid}>
                <Input
                    label="Имя"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                />
                <Input
                    label="Фамилия"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                />
            </div>

            <div className={styles.actions}>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={!isDirty || isSubmitting}
                >
                    Сохранить изменения
                </Button>
            </div>
        </form>
    );
};