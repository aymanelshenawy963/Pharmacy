const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223',
    maxRetries: 3,
    retryBaseDelay: 2000,
    headers: {
        'Content-Type': 'application/json',
    },
};

export const BASE_URL = API_CONFIG.baseURL;

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default API_CONFIG;
