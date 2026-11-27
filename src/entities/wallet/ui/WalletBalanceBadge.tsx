import React from 'react';


interface WalletBalanceBadgeProps {
    balance?: number;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
}
export const WalletBalanceBadge: React.FC<WalletBalanceBadgeProps> = ({ balance, isLoading, isError, onRetry }) => {
    if (isLoading) {
        return <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-full" />;
    }

    if (isError || balance == null) {
        return <button type="button" onClick={onRetry} className="text-sm text-red-600">
            Баланс недоступен. Повторить
        </button>;
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
            <span>🪙</span>
            <span aria-label="Баланс">{balance.toLocaleString('ru-RU')} ₽</span>
        </div>
    );
};
