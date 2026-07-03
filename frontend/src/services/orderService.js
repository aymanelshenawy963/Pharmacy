import { apiGet, apiPost, apiPut } from './apiClient';

export const orderService = {
    async createOrder(orderData) {
        return apiPost('/api/Orders', orderData);
    },

    async getMyOrders() {
        return apiGet('/api/Orders');
    },

    async getOrderById(id) {
        return apiGet(`/api/Orders/${id}`);
    },

    async cancelOrder(id) {
        return apiPut(`/api/Orders/${id}/cancel`);
    },

    async getAllOrders() {
        return apiGet('/api/Orders/all');
    },

    async getOrderByIdAdmin(id) {
        return apiGet(`/api/Orders/${id}/admin`);
    },

    async updateOrderStatus(id, status) {
        return apiPut(`/api/Orders/${id}/status`, { status });
    },
};
