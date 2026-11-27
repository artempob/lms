import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { createCourseSchema, CreateCourseFormValues } from '../model/createCourseSchema';
import { useCreateCourse } from '../api/useCreateCourse';
import styles from './CreateCourseForm.module.scss';
import { getApiError } from '@/shared/api';

export const CreateCourseForm: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: createCourse, isPending, error } = useCreateCourse();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateCourseFormValues>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
        },
    });

    const onSubmit: SubmitHandler<CreateCourseFormValues> = (data) => {
        createCourse(data, {
            onSuccess: (courseId) => {
                navigate(`/courses/${courseId}/edit`);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Название курса</label>
                <input
                    {...register('title')}
                    type="text"
                    className={styles.input}
                    placeholder="Введите название..."
                />
                {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Описание (необязательно)</label>
                <textarea
                    {...register('description')}
                    rows={4}
                    className={styles.textarea}
                    placeholder="О чем этот курс?"
                />
                {errors.description && <p className={styles.errorText}>{errors.description.message}</p>}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Цена (в рублях)</label>
                <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className={styles.input}
                />
                {errors.price && <p className={styles.errorText}>{errors.price.message}</p>}
            </div>

            {error && (
                <div className={styles.globalError}>
                    {getApiError(error)}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className={styles.submitBtn}
            >
                {isPending ? 'Создание...' : 'Создать курс'}
            </button>
        </form>
    );
};
