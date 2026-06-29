import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import { useCart } from '../context/CartContext';
import { basketService } from '../services/basketService';
import { orderService } from '../services/orderService';
import { deliveryMethods } from '../services/deliveryService';
import { formatPrice } from '../utils/currency';
import { parseApiError } from '../utils/apiErrorHandler';
import toast from 'react-hot-toast';

const INITIAL_ADDRESS = {
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
};

const ADDRESS_FIELDS = [
    { key: 'firstName', label: 'First Name', placeholder: 'John', colSpan: 'half' },
    { key: 'lastName', label: 'Last Name', placeholder: 'Doe', colSpan: 'half' },
    { key: 'street', label: 'Street Address', placeholder: '123 Main St', colSpan: 'full' },
    { key: 'city', label: 'City', placeholder: 'Cairo', colSpan: 'half' },
    { key: 'state', label: 'State', placeholder: 'Cairo', colSpan: 'half' },
    { key: 'zipCode', label: 'ZIP Code', placeholder: '12345', colSpan: 'half' },
];

export default function Checkout() {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCart();
    const [address, setAddress] = useState(INITIAL_ADDRESS);
    const [deliveryMethodId, setDeliveryMethodId] = useState(2);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const selectedDelivery = deliveryMethods.find((m) => m.id === deliveryMethodId);
    const deliveryPrice = selectedDelivery?.price ?? 0;
    const total = Math.max(0, subtotal + deliveryPrice);

    if (!items.length) {
        return (
            <>
                <Seo title="Checkout" description="Complete your order." />
                <section className="min-h-[calc(100vh-72px)] bg-bg-subtle relative flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-surface max-w-md w-full p-12 text-center relative z-10 rounded-2xl border border-border shadow-sm"
                    >
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                            <Icon name="ShoppingCart" className="h-10 w-10" />
                        </div>
                        <h1 className="font-sans text-3xl font-semibold text-text mb-3">Your cart is empty</h1>
                        <p className="text-text-muted mb-8 leading-relaxed">
                            Add some products before checking out.
                        </p>
                        <Link to="/products" className="glass-button-primary w-full py-3">
                            Browse Products
                        </Link>
                    </motion.div>
                </section>
            </>
        );
    }

    const validate = () => {
        const newErrors = {};
        if (!address.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!address.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!address.street.trim()) newErrors.street = 'Street address is required.';
        if (!address.city.trim()) newErrors.city = 'City is required.';
        if (!address.state.trim()) newErrors.state = 'State is required.';
        if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            toast.error('Please fill in all required fields.');
            return;
        }

        const basketId = basketService.getBasketId();
        if (!basketId) {
            toast.error('Something went wrong. Please try again.');
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
            toast.success('Order placed successfully!');
            navigate('/account/orders');
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Seo title="Checkout" description="Complete your order with shipping and delivery details." />

            <div className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-96 bg-primary/10 blur-[100px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-4 py-12 md:py-20 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <span className="kicker">Checkout</span>
                        <h1 className="display-heading !mb-2">Complete your order</h1>
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.2fr_0.8fr]">
                            {/* Left column — forms */}
                            <div className="space-y-8">
                                {/* Shipping Address */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm"
                                >
                                    <h2 className="font-sans text-xl font-semibold text-text mb-6 flex items-center gap-2">
                                        <Icon name="MapPin" className="h-5 w-5 text-primary" />
                                        Shipping Address
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        {ADDRESS_FIELDS.map((field) => (
                                            <div
                                                key={field.key}
                                                className={field.colSpan === 'full' ? 'col-span-2' : 'col-span-1'}
                                            >
                                                <label className="block text-sm font-medium text-text mb-1.5">
                                                    {field.label} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address[field.key]}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    className={`w-full rounded-xl border bg-bg px-4 py-3 outline-none transition-all duration-300 text-sm placeholder:text-text-muted/60 ${
                                                        errors[field.key]
                                                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                                            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                    }`}
                                                />
                                                {errors[field.key] && (
                                                    <p className="mt-1 text-xs text-red-500">{errors[field.key]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Delivery Method */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm"
                                >
                                    <h2 className="font-sans text-xl font-semibold text-text mb-6 flex items-center gap-2">
                                        <Icon name="Truck" className="h-5 w-5 text-primary" />
                                        Delivery Method
                                    </h2>

                                    <div className="space-y-3">
                                        {deliveryMethods.map((method) => (
                                            <label
                                                key={method.id}
                                                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                    deliveryMethodId === method.id
                                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                        : 'border-border hover:border-primary/30 hover:bg-bg-subtle'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="deliveryMethod"
                                                    value={method.id}
                                                    checked={deliveryMethodId === method.id}
                                                    onChange={(e) => setDeliveryMethodId(Number(e.target.value))}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-border"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-semibold text-text">{method.name}</p>
                                                        <p className="text-sm font-bold text-text">{formatPrice(method.price)}</p>
                                                    </div>
                                                    <p className="text-xs text-text-muted mt-0.5">
                                                        {method.description} — {method.deliveryTime}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right column — order summary */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="space-y-6 lg:sticky lg:top-28 h-fit"
                            >
                                <div className="bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                                    <h2 className="font-sans text-2xl font-semibold text-text mb-6 border-b border-border pb-6">
                                        Order Summary
                                    </h2>

                                    {/* Items */}
                                    <div className="space-y-4 mb-6">
                                        {items.map((item, index) => (
                                            <div key={item.id ?? `checkout-item-${index}`} className="flex items-center gap-3">
                                                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-bg border border-border">
                                                    <img
                                                        src={item.image || 'https://placehold.co/100x100/f7fbfa/0d9488?text=N/A'}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-text line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-text">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary rows */}
                                    <div className="space-y-3 text-sm border-t border-border pt-4">
                                        <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                                        <SummaryRow
                                            label="Delivery"
                                            value={deliveryPrice === 0 ? 'Free' : formatPrice(deliveryPrice)}
                                        />
                                        <div className="border-t border-border pt-3 mt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-semibold text-text">Total</span>
                                                <span className="font-sans text-2xl font-bold text-text">{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="glass-button-primary w-full py-4 text-base justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="CheckCircle" className="h-5 w-5 mr-2" />
                                            Place Order
                                        </>
                                    )}
                                </motion.button>

                                <Link
                                    to="/cart"
                                    className="glass-button w-full py-3 justify-center text-sm"
                                >
                                    <Icon name="ArrowLeft" className="h-4 w-4 mr-1" />
                                    Back to Cart
                                </Link>
                            </motion.div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

function SummaryRow({ label, value, valueClass = 'text-text' }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-text-muted">{label}</span>
            <span className={`font-medium ${valueClass}`}>{value}</span>
        </div>
    );
}
