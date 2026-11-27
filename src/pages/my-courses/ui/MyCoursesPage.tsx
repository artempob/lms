import { FC } from 'react';
import { PageHeader } from '@/shared/ui/page-header';
import { UserCoursesList } from '@/widgets/user-courses-list';
import styles from './MyCoursesPage.module.scss';

export const MyCoursesPage: FC = () => {
    return (
            <div className={styles.container}>
                <PageHeader
                    title="Мои курсы"
                    description="Здесь собраны все программы, на которые вы записаны."
                />
                <UserCoursesList />
            </div>
    );
};
