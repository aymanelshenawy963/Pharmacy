import { apiGet, apiPost, apiPut } from './apiClient';
import { authStorage } from './authStorage';
import { AUTH_ENDPOINTS } from '../constants/auth';

export const authService = {
    async login(email, password) {
        return apiPost(AUTH_ENDPOINTS.LOGIN, { email, password });
    },

    async register({ email, userName, password, firstName, lastName }) {
        return apiPost(AUTH_ENDPOINTS.REGISTER, { email, userName, password, firstName, lastName });
    },

    async forgotPassword(email) {
        return apiPost(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    },

    async resetPassword({ email, code, newPassword }) {
        return apiPost(AUTH_ENDPOINTS.RESET_PASSWORD, { email, code, newPassword });
    },

    async confirmEmailByOtp(email, code) {
        return apiPost(AUTH_ENDPOINTS.CONFIRM_EMAIL, { email, code });
    },

    async resendConfirmationEmail(email) {
        return apiPost(AUTH_ENDPOINTS.RESEND_CONFIRMATION, { email });
    },

    async refreshToken(token, refreshToken) {
        return apiPost(AUTH_ENDPOINTS.REFRESH_TOKEN, { token, refreshToken });
    },

    async revokeRefreshToken() {
        const token = authStorage.getToken();
        const refreshToken = authStorage.getRefreshToken();

        if (!token || !refreshToken) {
            authStorage.clear();
            return;
        }

        try {
            await apiPut(AUTH_ENDPOINTS.REVOKE_REFRESH_TOKEN, { token, refreshToken });
        } catch {
            // Fire and forget
        } finally {
            authStorage.clear();
        }
    },
};
