import { z } from 'zod';

export const createCourseSchema = z.object({
    title: z.string().trim()
        .min(3, 'Название должно содержать минимум 3 символа')
        .max(255, 'Название не должно превышать 255 символов'),

    description: z.string().max(10000, 'Описание слишком длинное').optional(),

    price: z.number({ message: 'Укажите корректную цену (число)' })
        .min(0, 'Цена не может быть отрицательной')
        .max(99999999.99, 'Цена слишком большая'),
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;
