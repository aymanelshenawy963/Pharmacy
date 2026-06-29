import { apiGet, apiPost, apiPut, apiRequest } from './apiClient';
import { authStorage } from './authStorage';

export const authService = {
    async login(email, password) {
        return apiPost('/Auth/login', { email, password });
    },

    async register({ email, userName, password, firstName, lastName }) {
        return apiPost('/Auth/register', { email, userName, password, firstName, lastName });
    },

    async forgotPassword(email) {
        return apiPost('/Auth/forgot-password', { email });
    },

    async resetPassword({ email, code, newPassword }) {
        return apiPost('/Auth/reset-password', { email, code, newPassword });
    },

    async confirmEmailByOtp(email, code) {
        return apiPost('/Auth/confirm-email', { email, code });
    },

    async resendConfirmationEmail(email) {
        return apiPost('/Auth/resend-confirmation-email', { email });
    },

    async refreshToken(token, refreshToken) {
        return apiPost('/Auth/refresh-token', { token, refreshToken });
    },

    async revokeRefreshToken() {
        const token = authStorage.getToken();
        const refreshToken = authStorage.getRefreshToken();

        if (!token || !refreshToken) {
            authStorage.clear();
            return;
        }

        try {
            await apiPut('/Auth/revoke-refresh-token', { token, refreshToken });
        } catch {
            // Fire and forget
        } finally {
            authStorage.clear();
        }
    },
};
