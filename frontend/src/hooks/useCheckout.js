import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { basketService } from '../services/basketService';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { checkoutStorage } from '../services/checkoutStorage';
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
    const { items, subtotal, refreshCartProducts, clearCart } = useCart();
    const [address, setAddress] = useState(INITIAL_ADDRESS);
    const [deliveryMethodId, setDeliveryMethodId] = useState(2);
    const [paymentMethod, setPaymentMethod] = useState('card');
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

    // ── Cash on Delivery ──────────────────────────────────────────────────────
    const handleCodSubmit = async (shippingAddress) => {
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
                shippingAddress,
            });

            // Clear the cart after successful order creation
            await clearCart();
            checkoutStorage.clear();

            // Navigate to success page with cod flag
            navigate('/payment/success?redirect_status=succeeded&payment_method=cod');
        } catch (err) {
            notify.errorFromApi(err, 'Failed to place your order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Card / Stripe ─────────────────────────────────────────────────────────
    const handleCardSubmit = async (shippingAddress) => {
        const basketId = basketService.getBasketId();
        if (!basketId) {
            notify.error('Something went wrong. Please try again.');
            return;
        }

        setSubmitting(true);
        try {
            checkoutStorage.save({ basketId, deliveryMethodId, shippingAddress, paymentMethod: 'card' });

            const paymentResult = await paymentService.createPaymentIntent({
                basketId,
                deliveryMethodId,
            });

            if (!paymentResult?.clientSecret) {
                notify.error('Failed to initialize payment. Please try again.');
                checkoutStorage.clear();
                return;
            }

            const params = new URLSearchParams({
                client_secret: paymentResult.clientSecret,
                basket_id: basketId,
                delivery_method_id: String(deliveryMethodId),
            });

            navigate(`/payment?${params.toString()}`);
        } catch (err) {
            checkoutStorage.clear();
            notify.errorFromApi(err, 'Failed to initialize payment.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Main submit handler ───────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            notify.error('Please fill in all required fields.');
            return;
        }

        const shippingAddress = {
            firstName: address.firstName.trim(),
            lastName: address.lastName.trim(),
            street: address.street.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
            zipCode: address.zipCode.trim(),
        };

        if (paymentMethod === 'cod') {
            await handleCodSubmit(shippingAddress);
        } else {
            await handleCardSubmit(shippingAddress);
        }
    };

    return {
        items,
        subtotal,
        address,
        errors,
        deliveryMethodId,
        setDeliveryMethodId,
        paymentMethod,
        setPaymentMethod,
        deliveryPrice,
        total,
        submitting,
        handleChange,
        handleSubmit,
    };
}
