import React from 'react';
import { RegisterForm } from '@/features/register';
import styles from './RegisterPage.module.scss';

export const RegisterPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Регистрация</h1>
                <p className={styles.subtitle}>Создайте аккаунт для начала работы</p>
            </div>

            <div className={styles.card}>
                <RegisterForm />
            </div>
        </div>
    );
};