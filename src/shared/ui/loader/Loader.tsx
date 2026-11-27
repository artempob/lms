import React from 'react';
import styles from './Loader.module.scss';

interface LoaderProps {
    center?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ center }) => {
    const loaderElement = <div className={styles.loader} />;

    if (center) {
        return <div className={styles.center}>{loaderElement}</div>;
    }

    return loaderElement;
};