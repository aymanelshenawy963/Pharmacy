import { apiGet, apiPost } from './apiClient';

export const reviewService = {
    async getByProduct(productId) {
        return apiGet(`/api/reviews/${productId}`);
    },

    async create(data) {
        return apiPost('/api/reviews', data);
    },
};
