import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import styles from './Sidebar.module.scss';

export const Sidebar: React.FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);

    if (!isAuth) return null;

    const navLinks = [
        {
            path: '/',
            label: 'Каталог',
            icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
        },
        {
            path: '/my-courses',
            label: 'Мои курсы',
            icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
        },
        {
            path: '/profile',
            label: 'Профиль',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
        },
    ];

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            isActive ? `${styles.link} ${styles.linkActive}` : styles.link
                        }
                    >
                        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                        </svg>
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
