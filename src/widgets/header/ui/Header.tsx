import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { useWalletBalance, WalletBalanceBadge } from '@/entities/wallet';
import { LogoutButton } from '@/features/auth/ui/logout';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const { data: wallet, isLoading: isWalletLoading, isError: isWalletError, refetch } = useWalletBalance();
    const location = useLocation();

    const getNavLinkClass = (path: string) =>
        location.pathname === path
            ? `${styles.navLink} ${styles.navLinkActive}`
            : styles.navLink;

    if (!user) return null;

    const canCreateCourse = user.role === 'TEACHER' || user.role === 'ADMIN';
    const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

    return (
        <header className={styles.header}>
            <div className={styles.container}>

                <div className={styles.leftSection}>
                    <Link to="/" className={styles.logo}>
                        LMS<span className={styles.logoHub}>Hub</span>
                    </Link>

                    <nav className={styles.nav}>
                        <Link to="/" className={getNavLinkClass('/')}>
                            Каталог
                        </Link>
                        <Link to="/my-courses" className={getNavLinkClass('/my-courses')}>
                            Мои курсы
                        </Link>
                        {canCreateCourse && <Link to="/teaching" className={getNavLinkClass('/teaching')}>
                            Мои материалы
                        </Link>}
                    </nav>
                </div>

                <div className={styles.rightSection}>
                    {canCreateCourse && (
                        <Link to="/courses/new" className={styles.createCourseBtn}>
                            Создать курс
                        </Link>
                    )}

                    {user.role === 'STUDENT' && (
                        <WalletBalanceBadge balance={wallet?.balance} isLoading={isWalletLoading}
                            isError={isWalletError} onRetry={() => void refetch()} />
                    )}

                    <div className={styles.profileWrapper}>
                        <div className={styles.avatar}>
                            {user.firstName?.[0] || user.email[0]}{user.lastName?.[0]}
                        </div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>
                                {displayName}
                            </p>
                            <p className={styles.userRole}>
                                {user.role.toLowerCase()}
                            </p>
                        </div>
                    </div>

                    <LogoutButton />
                </div>

            </div>
        </header>
    );
};
