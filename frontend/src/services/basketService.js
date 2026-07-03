import { apiGet, apiPost, apiDelete } from './apiClient';

const BASKET_ID_KEY = 'pharmacy-basket-id';
const BASKET_DATA_KEY = 'pharmacy-basket-data';

function getBasketId() {
    return localStorage.getItem(BASKET_ID_KEY);
}

function setBasketId(id) {
    localStorage.setItem(BASKET_ID_KEY, id);
}

function clearBasketId() {
    localStorage.removeItem(BASKET_ID_KEY);
}

function getLocalBasket() {
    try {
        const raw = localStorage.getItem(BASKET_DATA_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveLocalBasket(basket) {
    try {
        localStorage.setItem(BASKET_DATA_KEY, JSON.stringify(basket));
    } catch {
        // storage full or unavailable
    }
}

function clearLocalBasket() {
    localStorage.removeItem(BASKET_DATA_KEY);
}

function generateBasketId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const basketService = {
    getBasketId,
    setBasketId,
    clearBasketId,
    generateBasketId,

    async getBasket() {
        let basketId = getBasketId();
        if (!basketId) {
            basketId = generateBasketId();
            setBasketId(basketId);
        }

        // Try backend first
        try {
            const basket = await apiGet(`/api/Baskets/${basketId}`);
            // Backend returned a basket — sync it to localStorage as backup
            if (basket && Array.isArray(basket.items)) {
                saveLocalBasket(basket);
            }
            return basket;
        } catch (err) {
            if (err.status === 404) {
                // Basket doesn't exist on backend yet — check localStorage fallback
                const local = getLocalBasket();
                if (local && local.items && local.items.length > 0) {
                    // Try to push the local basket to backend in the background
                    this.updateBasket(local).catch(() => {});
                    return local;
                }
                return { id: basketId, paymentIntentId: null, clientSecret: null, items: [] };
            }
            // Backend unreachable (403, 405, network) — fall back to localStorage
            const local = getLocalBasket();
            if (local && local.items && local.items.length > 0) {
                return local;
            }
            return { id: basketId, paymentIntentId: null, clientSecret: null, items: [] };
        }
    },

    async updateBasket(basket) {
        // Always save to localStorage first (immediate persistence)
        saveLocalBasket(basket);

        try {
            const result = await apiPost('/api/Baskets', basket);
            if (result && result.id) {
                setBasketId(result.id);
            }
            return result;
        } catch (err) {
            // Backend failed, but localStorage already has the data — cart survives
            if (err.status === 403 || err.status === 405) {
                const friendly = new Error('Cart saved locally. Sign in with a customer account to sync across devices.');
                friendly.status = err.status;
                throw friendly;
            }
            throw err;
        }
    },

    async deleteBasket() {
        clearLocalBasket();
        const basketId = getBasketId();
        if (!basketId) return;
        try {
            await apiDelete(`/api/Baskets/${basketId}`);
        } catch {
            // Ignore errors on delete
        }
        clearBasketId();
    },

    buildBasketItem(product, quantity) {
        return {
            productId: product.id,
            productName: product.name,
            description: product.description || '',
            image: product.photos?.[0] || '',
            price: product.newPrice,
            quantity,
            category: product.categoryName || '',
        };
    },
};
