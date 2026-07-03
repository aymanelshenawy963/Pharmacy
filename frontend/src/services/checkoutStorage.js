const CHECKOUT_DATA_KEY = 'pharmacy-checkout-data';

export const checkoutStorage = {
    save({ basketId, deliveryMethodId, shippingAddress, paymentMethod }) {
        try {
            localStorage.setItem(
                CHECKOUT_DATA_KEY,
                JSON.stringify({ basketId, deliveryMethodId, shippingAddress, paymentMethod })
            );
        } catch {
            // storage unavailable
        }
    },

    get() {
        try {
            const raw = localStorage.getItem(CHECKOUT_DATA_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    clear() {
        localStorage.removeItem(CHECKOUT_DATA_KEY);
    },
};
