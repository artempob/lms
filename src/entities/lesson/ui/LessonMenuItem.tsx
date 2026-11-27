import React from 'react';
import styles from './LessonMenuItem.module.scss';

interface LessonMenuItemProps {
    title: string;
    index: number;
    isActive?: boolean;
    isCompleted?: boolean;
    isLocked?: boolean;
    onClick?: () => void;
}

export const LessonMenuItem: React.FC<LessonMenuItemProps> = ({
                                                                  title,
                                                                  index,
                                                                  isActive = false,
                                                                  isCompleted = false,
                                                                  isLocked = false,
                                                                  onClick,
                                                              }) => {
    const itemClass = [
        styles.item,
        isActive ? styles.active : '',
        isLocked ? styles.locked : ''
    ].filter(Boolean).join(' ');

    return (
        <button
            className={itemClass}
            onClick={onClick}
            disabled={isLocked}
            type="button"
        >
            <div className={styles.iconWrapper}>
                {isLocked ? (
                    <svg className={`${styles.icon} ${styles.iconLocked}`} viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                    </svg>
                ) : isCompleted ? (
                    <svg className={`${styles.icon} ${styles.iconCompleted}`} viewBox="0 0 24 24">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                ) : (
                    <span className={styles.index}>{index}</span>
                )}
            </div>

            <span className={styles.title} title={title}>
                {title}
            </span>
        </button>
    );
};