import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: process.env.LMS_API_PROXY_TARGET || 'http://localhost:8080',
                changeOrigin: true,
            },
        },
    },
});
