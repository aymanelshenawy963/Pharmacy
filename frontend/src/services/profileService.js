import { apiGet, apiPut } from './apiClient';

export const profileService = {
    async getProfile() {
        return apiGet('/me/profile');
    },

    async updateProfile({ firstName, lastName }) {
        return apiPut('/me/update-profile', { firstName, lastName });
    },

    async changePassword({ currentPassword, newPassword }) {
        return apiPut('/me/change-password', { currentPassword, newPassword });
    },
};
