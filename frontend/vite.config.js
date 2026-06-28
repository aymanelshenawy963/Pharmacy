import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/Medical-Store-Website/',
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:5223',
                changeOrigin: true,
            },
            '/Images': {
                target: 'http://localhost:5223',
                changeOrigin: true,
            },
        },
    },
});