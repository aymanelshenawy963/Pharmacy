import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { basketService } from '../services/basketService';
import { orderService } from '../services/orderService';
import { deliveryMethods } from '../data/store';
import notify from '../utils/notifications';
import { shippingAddressSchema } from '../validation/checkoutSchema';
import { parseZodError } from '../utils/validation';

const INITIAL_ADDRESS = {
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
};

export default function useCheckout() {
    const navigate = useNavigate();
    const { items, subtotal, clearCart, refreshCartProducts } = useCart();
    const [address, setAddress] = useState(INITIAL_ADDRESS);
    const [deliveryMethodId, setDeliveryMethodId] = useState(2);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        refreshCartProducts();
    }, [refreshCartProducts]);

    const selectedDelivery = deliveryMethods.find((m) => m.id === deliveryMethodId);
    const deliveryPrice = selectedDelivery?.price ?? 0;
    const total = Math.max(0, subtotal + deliveryPrice);

    const validate = () => {
        const result = shippingAddressSchema.safeParse(address);
        if (result.success) {
            setErrors({});
            return true;
        }
        setErrors(parseZodError(result.error));
        return false;
    };

    const handleChange = (key, value) => {
        setAddress((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            notify.error('Please fill in all required fields.');
            return;
        }

        const basketId = basketService.getBasketId();
        if (!basketId) {
            notify.error('Something went wrong. Please try again.');
            return;
        }

        setSubmitting(true);
        try {
            await orderService.createOrder({
                basketId,
                deliveryMethodId,
                shippingAddress: {
                    firstName: address.firstName.trim(),
                    lastName: address.lastName.trim(),
                    street: address.street.trim(),
                    city: address.city.trim(),
                    state: address.state.trim(),
                    zipCode: address.zipCode.trim(),
                },
            });

            await clearCart();
            notify.success('Order placed successfully!');
            navigate('/account/orders');
        } catch (err) {
            notify.errorFromApi(err, 'Failed to place order.');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        items,
        subtotal,
        address,
        errors,
        deliveryMethodId,
        setDeliveryMethodId,
        deliveryPrice,
        total,
        submitting,
        handleChange,
        handleSubmit,
    };
}
