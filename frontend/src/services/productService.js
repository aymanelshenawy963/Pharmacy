import { apiGet, apiRequest, apiFormData } from './apiClient';

export const productService = {
    async getAll(params = {}) {
        return apiGet('/api/Products', params);
    },

    async getById(id) {
        return apiGet(`/api/Products/${id}`);
    },

    async create(formData) {
        return apiFormData('/api/Products', 'POST', formData);
    },

    async update(id, formData) {
        return apiFormData(`/api/Products/${id}`, 'PUT', formData);
    },

    async remove(id) {
        return apiRequest(`/api/Products/${id}`, { method: 'DELETE' });
    },
};
