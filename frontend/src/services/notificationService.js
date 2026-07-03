import { apiGet, apiPut } from './apiClient';

export const notificationService = {
    async getAll(status) {
        return apiGet('/api/notifications', { status });
    },

    async getUnreadCount() {
        return apiGet('/api/notifications/count');
    },

    async markAsRead(id) {
        return apiPut(`/api/notifications/${id}/read`);
    },
};
