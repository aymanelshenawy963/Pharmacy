const API_CONFIG = {
    baseURL: import.meta.env.PROD ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223') : '',
};

export const BASE_URL = API_CONFIG.baseURL;

export default API_CONFIG;
