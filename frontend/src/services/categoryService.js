import { apiGet, apiPost, apiPut, apiRequest } from './apiClient';

export const categoryService = {
    async getAll() {
        return apiGet('/api/Categories');
    },

    async getById(id) {
        return apiGet(`/api/Categories/${id}`);
    },

    async create({ name, description }) {
        return apiPost('/api/Categories', { name, description });
    },

    async update(id, { name, description }) {
        return apiPut(`/api/Categories/${id}`, { name, description });
    },

    async remove(id) {
        return apiRequest(`/api/Categories/${id}`, { method: 'DELETE' });
    },
};
