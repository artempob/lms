import React from 'react';
import styles from './CourseProgress.module.scss';

interface CourseProgressProps {
    progress: number;
    showLabel?: boolean;
    className?: string;
}

export const CourseProgress: React.FC<CourseProgressProps> = ({
                                                                  progress,
                                                                  showLabel = true,
                                                                  className
                                                              }) => {
    const clampedProgress = Math.min(Math.max(Math.round(progress), 0), 100);
    const isCompleted = clampedProgress === 100;

    const wrapperClass = className ? `${styles.wrapper} ${className}` : styles.wrapper;
    const fillClass = isCompleted ? `${styles.fill} ${styles.completed}` : styles.fill;

    return (
        <div className={wrapperClass}>
            {showLabel && (
                <div className={styles.header}>
                    <span className={styles.label}>Прогресс</span>
                    <span className={styles.percentage}>{clampedProgress}%</span>
                </div>
            )}
            <div className={styles.track}>
                <div
                    className={fillClass}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
};