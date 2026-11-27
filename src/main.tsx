import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app/App';
import { QueryProvider } from '@/app/providers/QueryProvider';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Не найден корневой элемент #root в index.html');
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <QueryProvider>
            <App />
        </QueryProvider>
    </React.StrictMode>
);