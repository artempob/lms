import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import styles from './MainLayout.module.scss';

export const MainLayout: React.FC = () => {
    return (
        <div className={styles.appContainer}>
            <Header />

            <div className={styles.mainWrapper}>
                <Sidebar />

                <main className={styles.contentArea}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};