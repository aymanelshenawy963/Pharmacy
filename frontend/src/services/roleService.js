import { apiGet, apiPost, apiPut } from './apiClient';

export const roleService = {
    async getAll(includeDisabled = false) {
        return apiGet('/api/Roles', includeDisabled ? { includeDisabled: 'true' } : {});
    },

    async create({ name }) {
        return apiPost('/api/Roles', { name });
    },

    async update(id, { name }) {
        return apiPut(`/api/Roles/${id}`, { name });
    },

    async toggleStatus(id) {
        return apiPut(`/api/Roles/${id}/toggle-status`);
    },
};
