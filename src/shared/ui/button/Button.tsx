import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'clear';
    className?: string;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  className = '',
                                                  isLoading = false,
                                                  disabled,
                                                  ...otherProps
                                              }) => {
    const combinedClasses = [
        styles.button,
        styles[variant],
        isLoading ? styles.loading : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={combinedClasses}
            disabled={isLoading || disabled}
            {...otherProps}
        >
            {isLoading && (
                <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className={styles.spinnerHead} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            <span className={isLoading ? styles.hiddenText : ''}>
                {children}
            </span>
        </button>
    );
};