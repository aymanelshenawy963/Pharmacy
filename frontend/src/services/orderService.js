import { apiGet, apiPost, apiRequest } from './apiClient';

export const orderService = {
    async createOrder({ basketId, deliveryMethodId, shippingAddress }) {
        return apiPost('/api/Orders', {
            basketId,
            deliveryMethodId,
            shippingAddress,
        });
    },

    async getMyOrders() {
        return apiGet('/api/Orders');
    },

    async getOrderById(id) {
        return apiGet(`/api/Orders/${id}`);
    },

    async cancelOrder(id) {
        return apiRequest(`/api/Orders/${id}/cancel`, { method: 'PUT' });
    },
};
