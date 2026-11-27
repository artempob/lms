import React from 'react';
import { PageHeader } from '@/shared/ui';
import { CourseCatalogList } from '@/widgets/course-catalog-list';
import styles from './CatalogPage.module.scss';

export const CatalogPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <PageHeader
                title="Каталог курсов"
                description="Выберите интересующий курс и начните обучение прямо сейчас"
            />
            <CourseCatalogList />
        </div>
    );
};
