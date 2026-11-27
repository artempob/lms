import React from 'react';
import { EnrollmentStatus } from '../model/types';

interface EnrollmentStatusBadgeProps {
    status: EnrollmentStatus | string;
    className?: string;
}

export const EnrollmentStatusBadge: React.FC<EnrollmentStatusBadgeProps> = ({ status, className = '' }) => {
    const getBadgeConfig = () => {
        switch (status) {
            case 'ACTIVE':
                return { styles: 'bg-blue-50 text-blue-700 border-blue-200', text: 'В процессе' };
            case 'COMPLETED':
                return { styles: 'bg-green-50 text-green-700 border-green-200', text: 'Завершен' };
            case 'REVOKED':
                return { styles: 'bg-red-50 text-red-700 border-red-200', text: 'Доступ закрыт' };
            default:
                return { styles: 'bg-gray-50 text-gray-700 border-gray-200', text: status };
        }
    };

    const config = getBadgeConfig();

    return (
        <span className={`px-3 py-1 border text-xs font-semibold rounded-full ${config.styles} ${className}`}>
            {config.text}
        </span>
    );
};