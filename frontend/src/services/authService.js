import { apiGet, apiPost, apiPut } from './apiClient';
import { authStorage } from './authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223';

export const authService = {
    /**
     * POST /Auth/login
     * Returns AuthToReturnDTO on 200
     * Throws on 401 (invalid credentials) and 403 (email not confirmed / disabled)
     */
    async login(email, password) {
        return apiPost('/Auth/login', { email, password });
    },

    /**
     * POST /Auth/register
     * Returns ResponseAPI on 200
     * Throws 409 (duplicate email/username) or 400 on other errors
     */
    async register({ email, userName, password, firstName, lastName }) {
        return apiPost('/Auth/register', { email, userName, password, firstName, lastName });
    },

    /**
     * POST /Auth/forgot-password
     * Returns ResponseAPI on 200
     * Throws 401 "Email is not confirmed" or 400
     */
    async forgotPassword(email) {
        return apiPost('/Auth/forgot-password', { email });
    },

    /**
     * POST /Auth/reset-password
     * Returns ResponseAPI on 200
     * Throws 400 on any failure
     */
    async resetPassword({ email, code, newPassword }) {
        return apiPost('/Auth/reset-password', { email, code, newPassword });
    },

    /**
     * POST /Auth/confirm-email (OTP-based confirmation)
     * Returns ResponseAPI on 200
     * Throws 400/409 on error or already confirmed
     */
    async confirmEmailByOtp(email, code) {
        return apiPost('/Auth/confirm-email', { email, code });
    },

    /**
     * POST /Auth/resend-confirmation-email
     * Returns plain string on 200 (NOT ResponseAPI)
     * Throws 409 if already confirmed
     */
    async resendConfirmationEmail(email) {
        const response = await fetch(`${BASE_URL}/Auth/resend-confirmation-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');
            let body;
            try {
                body = isJson ? await response.json() : await response.text();
            } catch {
                body = null;
            }
            const error = new Error((body && body.message) || `HTTP ${response.status}`);
            error.status = response.status;
            error.body = body;
            throw error;
        }

        // Success returns a plain string, not ResponseAPI
        return response.text();
    },

    /**
     * POST /Auth/refresh-token
     * Returns AuthToReturnDTO on 200
     */
    async refreshToken(token, refreshToken) {
        return apiPost('/Auth/refresh-token', { token, refreshToken });
    },

    /**
     * PUT /Auth/revoke-refresh-token
     * Clears auth storage immediately (fire-and-forget pattern)
     */
    async revokeRefreshToken() {
        const token = authStorage.getToken();
        const refreshToken = authStorage.getRefreshToken();

        // Clear immediately for responsive UX
        authStorage.clear();

        if (!token || !refreshToken) return;

        try {
            await apiPut('/Auth/revoke-refresh-token', { token, refreshToken });
        } catch {
            // Fire and forget — already cleared local storage
        }
    },
};
