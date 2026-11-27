import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { useWalletBalance } from '@/entities/wallet';
import { useMyCourses } from '@/entities/course/api/useMyCourses';
import { Button } from '@/shared/ui';
import { getApiError } from '@/shared/api';
import { usePurchaseCourse } from '../api/usePurchaseCourse';

interface PurchaseCourseButtonProps {
    courseId: string;
    price: number;
}

export const PurchaseCourseButton: React.FC<PurchaseCourseButtonProps> = ({ courseId, price }) => {
    const isAuth = useAuthStore(state => state.isAuth);
    const wallet = useWalletBalance();
    const courses = useMyCourses();
    const purchase = usePurchaseCourse();
    const navigate = useNavigate();

    if (!isAuth) return <Button onClick={() => navigate('/login')}>Войти для покупки</Button>;
    if (wallet.isLoading || courses.isLoading) return <Button disabled>Загрузка...</Button>;
    if (wallet.isError || courses.isError || !wallet.data) {
        return (
            <div className="flex flex-col items-end gap-2">
                <p role="alert" className="text-sm text-red-600">Не удалось получить данные для покупки.</p>
                <Button variant="secondary" onClick={() => { void wallet.refetch(); void courses.refetch(); }}>
                    Повторить
                </Button>
            </div>
        );
    }
    if (courses.data?.some(course => course.id === courseId)) {
        return <Button onClick={() => navigate(`/courses/${courseId}/player`)}>Перейти к обучению</Button>;
    }

    const enoughMoney = wallet.data.balance >= price;
    return (
        <div className="flex flex-col items-end gap-2">
            <Button onClick={() => purchase.mutate(courseId)} disabled={!enoughMoney || purchase.isPending} isLoading={purchase.isPending}>
                {price === 0 ? 'Записаться бесплатно' : `Купить за ${price.toLocaleString('ru-RU')} ₽`}
            </Button>
            {!enoughMoney && <p className="text-sm text-red-600">Недостаточно средств на балансе</p>}
            {purchase.error && <p role="alert" className="text-sm text-red-600">{getApiError(purchase.error)}</p>}
        </div>
    );
};
