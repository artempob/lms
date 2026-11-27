import React from 'react';
import { useAuthStore } from '@/entities/user';
import { PageHeader, Input } from '@/shared/ui';
import { UpdateProfileForm } from '@/features/update-profile';
import styles from './ProfilePage.module.scss';

export const ProfilePage: React.FC = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className={styles.page}>
            <PageHeader
                title="Мой профиль"
                description="Управление личными данными и настройками аккаунта"
            />

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Личная информация</h2>

                <UpdateProfileForm />
            </div>

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Системная информация</h2>

                <div className={styles.formGrid}>
                    <Input
                        label="Email"
                        value={user.email}
                        readOnly
                    />

                    <div className={styles.infoBlock}>
                        <span className={styles.fieldLabel}>Роль в системе</span>
                        <div className={styles.roleBadge}>
                            {user.role.toLowerCase()}
                        </div>
                    </div>

                    <div className={styles.infoBlock}>
                        <span className={styles.fieldLabel}>Текущий баланс</span>
                        <div className={styles.balanceValue}>
                            {user.balance !== undefined ? `${user.balance} ₽` : '0 ₽'}
                        </div>
                    </div>

                    <div className={styles.fullWidth}>
                        <Input
                            label="ID Пользователя (UUID)"
                            value={user.id}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};