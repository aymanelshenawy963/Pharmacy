import { STORAGE_KEYS } from '../constants/auth';

export const authStorage = {
    setAuth(authData) {
        try {
            localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
                id: authData.id,
                email: authData.email,
                firstName: authData.firstName,
                lastName: authData.lastName,
            }));
            localStorage.setItem(STORAGE_KEYS.EXPIRES_IN, String(authData.expiresIn));
        } catch {
            // Silently fail — localStorage may be full or disabled
        }
    },

    getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    getRefreshToken() {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    getUser() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.USER);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    setUser(userData) {
        try {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
            }));
        } catch {
            // Silently fail
        }
    },

    getExpiresIn() {
        const val = localStorage.getItem(STORAGE_KEYS.EXPIRES_IN);
        return val ? Number(val) : null;
    },

    clear() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.EXPIRES_IN);
    },

    isAuthenticated() {
        return Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN));
    },
};
