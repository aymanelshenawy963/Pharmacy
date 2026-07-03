import { apiPost } from './apiClient';

export const paymentService = {
    async createPaymentIntent({ basketId, deliveryMethodId }) {
        return apiPost('/api/Payments', {
            basketId,
            deliveryMethodId,
        });
    },
};
