import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiBaseURL = env.VITE_API_BASE_URL || 'http://localhost:5223';

    return {
        base: '/Medical-Store-Website/',
        plugins: [react()],
        server: {
            host: '0.0.0.0',
            proxy: {
                '/api': {
                    target: apiBaseURL,
                    changeOrigin: true,
                    timeout: 30000,
                    proxyTimeout: 30000,
                },
                '/Images': {
                    target: apiBaseURL,
                    changeOrigin: true,
                    timeout: 30000,
                    proxyTimeout: 30000,
                },
                '/Auth': {
                    target: apiBaseURL,
                    changeOrigin: true,
                    timeout: 30000,
                    proxyTimeout: 30000,
                },
                '/me': {
                    target: apiBaseURL,
                    changeOrigin: true,
                    timeout: 30000,
                    proxyTimeout: 30000,
                },
            },
        },
    };
});
