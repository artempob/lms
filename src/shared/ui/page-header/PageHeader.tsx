import React, { ReactNode } from 'react';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
    title: string;
    description?: string;
    actionSlot?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                          title,
                                                          description,
                                                          actionSlot
                                                      }) => {
    return (
        <div className={styles.container}>
            <div>
                <h1 className={styles.title}>{title}</h1>
                {description && (
                    <p className={styles.description}>{description}</p>
                )}
            </div>

            {actionSlot && (
                <div className={styles.actions}>
                    {actionSlot}
                </div>
            )}
        </div>
    );
};