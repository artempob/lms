import React from 'react';
import styles from './CourseInfo.module.scss';

interface CourseInfoProps {
    title: string;
    description?: string;
    authorFirstName: string;
    authorLastName: string;
    className?: string;
}

export const CourseInfo: React.FC<CourseInfoProps> = ({
                                                          title,
                                                          description,
                                                          authorFirstName,
                                                          authorLastName,
                                                          className
                                                      }) => {
    const initials = `${authorFirstName?.[0] || ''}${authorLastName?.[0] || ''}`;

    return (
        <div className={className ? `${styles.container} ${className}` : styles.container}>
            <h1 className={styles.title}>{title}</h1>

            {description && (
                <p className={styles.description}>{description}</p>
            )}

            <div className={styles.authorWrapper}>
                <div className={styles.avatar}>
                    {initials}
                </div>
                <div className={styles.authorDetails}>
                    <p className={styles.authorLabel}>Автор курса</p>
                    <p className={styles.authorName}>
                        {authorFirstName} {authorLastName}
                    </p>
                </div>
            </div>
        </div>
    );
};