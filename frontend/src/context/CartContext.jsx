import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';

const CartContext = createContext(null);
const STORAGE_KEY = 'jaya-medical-cart';

const readStoredCart = () => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export function CartProvider({ children }) {
    const [items, setItems] = useState(readStoredCart);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (product, quantity = 1) => {
        setItems((currentItems) => {
            const existing = currentItems.find((item) => item.id === product.id);
            if (existing) {
                return currentItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
                );
            }

            return [...currentItems, { ...product, quantity }];
        });
    };

    const setItemQuantity = (productId, quantity) => {
        if (quantity < 1) {
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        );
    };

    const removeFromCart = (productId) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    };

    const clearCart = () => setItems([]);

    const cartCount = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items],
    );

    const subtotal = useMemo(
        () => items.reduce((total, item) => total + item.price * item.quantity, 0),
        [items],
    );

    const cartProducts = useMemo(
        () => items.map((item) => products.find((product) => product.id === item.id) || item),
        [items],
    );

    const value = {
        items,
        cartProducts,
        cartCount,
        subtotal,
        addToCart,
        setItemQuantity,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used inside CartProvider');
    }
    return context;
};