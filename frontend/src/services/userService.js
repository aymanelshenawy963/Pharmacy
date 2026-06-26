import { apiGet, apiPost, apiPut } from './apiClient';

export const userService = {
    async getAll() {
        return apiGet('/api/Users');
    },

    async getById(id) {
        return apiGet(`/api/Users/${id}`);
    },

    async create({ email, userName, firstName, lastName, password, roles }) {
        return apiPost('/api/Users', { email, userName, firstName, lastName, password, roles });
    },

    async update(id, { email, userName, firstName, lastName, roles }) {
        return apiPut(`/api/Users/${id}`, { email, userName, firstName, lastName, roles });
    },

    async toggleStatus(id) {
        return apiPut(`/api/Users/${id}/toggle-status`);
    },

    async unlock(id) {
        return apiPut(`/api/Users/${id}/unlock`);
    },
};
