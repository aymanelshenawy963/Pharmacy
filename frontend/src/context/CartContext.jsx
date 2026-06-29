import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { basketService } from '../services/basketService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

function normalizeBasketItem(item) {
    return {
        id: item.productId,
        productId: item.productId,
        name: item.productName,
        productName: item.productName,
        description: item.description || '',
        image: item.image || '',
        price: item.price,
        quantity: item.quantity,
        category: item.category || '',
    };
}

function toBasketItem(product, quantity) {
    return {
        id: product.id,
        productId: product.id,
        name: product.name,
        productName: product.name,
        description: product.description || '',
        image: product.photos?.[0] || product.image || '',
        price: product.newPrice ?? product.price,
        quantity,
        category: product.categoryName || product.category || '',
    };
}

function computeSubtotal(items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function computeCartCount(items) {
    return items.reduce((total, item) => total + item.quantity, 0);
}

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const syncInProgress = useRef(false);

    // Sync basket from backend on mount / auth change
    useEffect(() => {
        if (!isAuthenticated) {
            setItems([]);
            return;
        }

        if (syncInProgress.current) return;
        syncInProgress.current = true;

        (async () => {
            setIsLoading(true);
            try {
                const basket = await basketService.getBasket();
                const normalized = (basket.items || []).map(normalizeBasketItem);
                setItems(normalized);
            } catch {
                setItems([]);
            } finally {
                setIsLoading(false);
                syncInProgress.current = false;
            }
        })();
    }, [isAuthenticated]);

    // Persist basket to backend
    const persistBasket = useCallback(async (updatedItems) => {
        const basketId = basketService.getBasketId() || basketService.generateBasketId();
        const payload = {
            id: basketId,
            paymentIntentId: null,
            clientSecret: null,
            items: updatedItems.map((item) => ({
                productId: item.productId ?? item.id,
                productName: item.productName ?? item.name,
                description: item.description || '',
                image: item.image || '',
                price: item.price,
                quantity: item.quantity,
                category: item.category || '',
            })),
        };
        try {
            await basketService.updateBasket(payload);
        } catch {
            // Error already shown by basketService; silently swallow to avoid console noise
        }
    }, []);

    const addToCart = useCallback(async (product, quantity = 1) => {
        if (!isAuthenticated) {
            toast.error('Please sign in to add items to your cart.');
            return false;
        }

        const newItem = toBasketItem(product, quantity);

        setItems((currentItems) => {
            const existing = currentItems.find((item) => item.id === newItem.id);
            const updated = existing
                ? currentItems.map((item) =>
                      item.id === newItem.id
                          ? { ...item, quantity: item.quantity + quantity }
                          : item,
                  )
                : [...currentItems, newItem];

            persistBasket(updated).catch(() => {});

            return updated;
        });

        return true;
    }, [isAuthenticated, persistBasket]);

    const setItemQuantity = useCallback(async (productId, quantity) => {
        if (quantity < 1 || !isAuthenticated) return;

        setItems((currentItems) => {
            const updated = currentItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item,
            );

            persistBasket(updated).catch(() => {});

            return updated;
        });
    }, [isAuthenticated, persistBasket]);

    const removeFromCart = useCallback(async (productId) => {
        if (!isAuthenticated) return;

        setItems((currentItems) => {
            const updated = currentItems.filter((item) => item.id !== productId);

            persistBasket(updated).catch(() => {});

            return updated;
        });
    }, [isAuthenticated, persistBasket]);

    const clearCart = useCallback(async () => {
        if (!isAuthenticated) return;

        setItems([]);
        try {
            await basketService.deleteBasket();
        } catch {
            // Error handled silently — basket cleared locally
        }
    }, [isAuthenticated]);

    const cartCount = useMemo(() => computeCartCount(items), [items]);
    const subtotal = useMemo(() => computeSubtotal(items), [items]);

    const value = useMemo(
        () => ({
            items,
            cartItems: items,
            cartCount,
            subtotal,
            isLoading,
            addToCart,
            setItemQuantity,
            removeFromCart,
            clearCart,
        }),
        [items, cartCount, subtotal, isLoading, addToCart, setItemQuantity, removeFromCart, clearCart],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used inside CartProvider');
    }
    return context;
};
