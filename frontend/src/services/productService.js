import { apiGet, apiRequest } from './apiClient';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223';

export const productService = {
    async getAll(params = {}) {
        return apiGet('/api/Products', params);
    },

    async getById(id) {
        return apiGet(`/api/Products/${id}`);
    },

    async create(formData) {
        const token = (await import('./authStorage')).authStorage.getToken();
        const response = await fetch(`${BASE_URL}/api/Products`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
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

        return response.json();
    },

    async update(id, formData) {
        const token = (await import('./authStorage')).authStorage.getToken();
        const response = await fetch(`${BASE_URL}/api/Products/${id}`, {
            method: 'PUT',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
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

        return response.status === 204 ? null : response.json();
    },

    async remove(id) {
        return apiRequest(`/api/Products/${id}`, { method: 'DELETE' });
    },
};
