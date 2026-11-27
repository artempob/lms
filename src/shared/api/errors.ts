import { isAxiosError } from 'axios';

export interface ApiError {
    error?: string;
    fields?: Record<string, string>;
}

export const getApiError = (error: unknown, fallback = 'Не удалось выполнить запрос. Попробуйте ещё раз.') => {
    if (isAxiosError<ApiError>(error)) {
        const fields = error.response?.data.fields;
        if (fields && Object.keys(fields).length > 0) {
            return Object.values(fields).join('. ');
        }
        return error.response?.data.error || fallback;
    }
    return fallback;
};
