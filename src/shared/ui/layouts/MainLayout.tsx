import React, { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, className = '' }) => {
    return (
        <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
            {children}
        </div>
    );
};