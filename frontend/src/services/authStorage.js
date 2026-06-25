const KEYS = {
    TOKEN: 'jaya-auth-token',
    REFRESH_TOKEN: 'jaya-refresh-token',
    USER: 'jaya-auth-user',
    EXPIRES_IN: 'jaya-auth-expires',
};

export const authStorage = {
    setAuth(authData) {
        try {
            localStorage.setItem(KEYS.TOKEN, authData.token);
            localStorage.setItem(KEYS.REFRESH_TOKEN, authData.refreshToken);
            localStorage.setItem(KEYS.USER, JSON.stringify({
                id: authData.id,
                email: authData.email,
                firstName: authData.firstName,
                lastName: authData.lastName,
            }));
            localStorage.setItem(KEYS.EXPIRES_IN, String(authData.expiresIn));
        } catch (e) {
            console.error('authStorage.setAuth failed', e);
        }
    },

    getToken() {
        return localStorage.getItem(KEYS.TOKEN);
    },

    getRefreshToken() {
        return localStorage.getItem(KEYS.REFRESH_TOKEN);
    },

    getUser() {
        try {
            const raw = localStorage.getItem(KEYS.USER);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    getExpiresIn() {
        const val = localStorage.getItem(KEYS.EXPIRES_IN);
        return val ? Number(val) : null;
    },

    clear() {
        localStorage.removeItem(KEYS.TOKEN);
        localStorage.removeItem(KEYS.REFRESH_TOKEN);
        localStorage.removeItem(KEYS.USER);
        localStorage.removeItem(KEYS.EXPIRES_IN);
    },

    isAuthenticated() {
        return Boolean(localStorage.getItem(KEYS.TOKEN));
    },
};
