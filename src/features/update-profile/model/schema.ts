import { z } from 'zod';

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'Имя не может быть пустым'),
    lastName: z.string().min(1, 'Фамилия не может быть пустой'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;