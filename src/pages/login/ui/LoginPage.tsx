import React from 'react';
import { LoginForm } from '@/features/auth/ui/login-by-email/index.ts';
import styles from './LoginPage.module.scss';

export const LoginPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Вход в систему</h1>
                <p className={styles.subtitle}>Добро пожаловать в платформу управления курсами</p>
            </div>

            <div className={styles.card}>
                <LoginForm />
            </div>
        </div>
    );
};