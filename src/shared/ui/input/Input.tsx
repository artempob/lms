import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    const inputClasses = [
        styles.input,
        error ? styles.inputError : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <input className={inputClasses} {...props} />
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};