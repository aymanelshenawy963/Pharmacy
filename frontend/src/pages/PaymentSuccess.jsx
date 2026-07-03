import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ShoppingBag, Truck } from 'lucide-react';
import Seo from '../components/Seo';
import { orderService } from '../services/orderService';
import { checkoutStorage } from '../services/checkoutStorage';
import { useCart } from '../context/CartContext';
import notify from '../utils/notifications';
import LoadingSpinner from '../components/admin/LoadingSpinner';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [orderCreated, setOrderCreated] = useState(false);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(true);
    const { clearCart } = useCart();
    const effectRan = useRef(false);

    const paymentIntentId = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');
    const isCod = searchParams.get('payment_method') === 'cod';

    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;

        if (isCod) {
            setOrderCreated(true);
            setCreating(false);
            return;
        }

        const createOrder = async () => {
            if (redirectStatus !== 'succeeded') {
                const errorMsg = searchParams.get('error') || 'Payment was not completed. Please try again.';
                navigate(`/payment/failed?error=${encodeURIComponent(errorMsg)}`, { replace: true });
                return;
            }

            const checkoutData = checkoutStorage.get();
            if (!checkoutData) {
                setError('Checkout data not found. Please contact support with your payment reference.');
                setCreating(false);
                return;
            }

            try {
                await orderService.createOrder({
                    basketId: checkoutData.basketId,
                    deliveryMethodId: checkoutData.deliveryMethodId,
                    shippingAddress: checkoutData.shippingAddress,
                });

                await clearCart();
                checkoutStorage.clear();
                setOrderCreated(true);
            } catch (err) {
                const msg = err.message || '';
                if (msg.includes('Basket is empty')) {
                    // Order was already created by a previous request — treat as success
                    await clearCart();
                    checkoutStorage.clear();
                    setOrderCreated(true);
                    return;
                }
                setError(
                    'Payment was successful but we could not create your order. Please contact support with your payment reference.'
                );
                notify.errorFromApi(err, 'Failed to create order after payment.');
            } finally {
                setCreating(false);
            }
        };

        createOrder();
    }, [isCod, redirectStatus, navigate, searchParams, clearCart]);

    const successTitle = isCod ? 'Order Placed!' : 'Payment Successful!';
    const successMessage = isCod
        ? 'Your order has been placed and will be delivered to your doorstep. Please have cash ready upon delivery.'
        : 'Your payment has been processed and your order has been placed successfully.';

    return (
        <>
            <Seo title={isCod ? 'Order Placed' : 'Payment Successful'} description="Your order has been confirmed." />

            <section className="min-h-[calc(100vh-72px)] bg-surface relative flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-surface max-w-md w-full p-10 sm:p-12 text-center relative z-10 rounded-2xl border border-border shadow-sm"
                >
                    {creating ? (
                        <div className="space-y-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-text-muted text-sm">Creating your order...</p>
                        </div>
                    ) : error ? (
                        <>
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 mb-6">
                                <Package className="h-10 w-10" />
                            </div>
                            <h1 className="font-sans text-3xl font-semibold text-text mb-3">
                                Order Needs Attention
                            </h1>
                            <p className="text-text-muted mb-6 leading-relaxed">{error}</p>
                            {paymentIntentId && (
                                <p className="text-xs text-text-muted mb-6 font-mono bg-bg-subtle rounded-lg p-3">
                                    Reference: {paymentIntentId}
                                </p>
                            )}
                            <Link to="/account/orders" className="glass-button-primary w-full py-3">
                                <Package className="h-5 w-5 mr-2" />
                                View Orders
                            </Link>
                        </>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                                className={[
                                    'mx-auto flex h-24 w-24 items-center justify-center rounded-full mb-6',
                                    isCod
                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
                                ].join(' ')}
                            >
                                {isCod
                                    ? <Truck className="h-10 w-10" />
                                    : <CheckCircle className="h-10 w-10" />
                                }
                            </motion.div>

                            <h1 className="font-sans text-3xl font-semibold text-text mb-3">
                                {successTitle}
                            </h1>
                            <p className="text-text-muted mb-8 leading-relaxed">
                                {successMessage}
                            </p>

                            {isCod && (
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/20 px-4 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                                    <Package className="h-3.5 w-3.5" />
                                    Pay on Delivery
                                </div>
                            )}

                            <div className="space-y-3">
                                <Link
                                    to="/account/orders"
                                    className="glass-button-primary w-full py-3 justify-center"
                                >
                                    <Package className="h-5 w-5 mr-2" />
                                    View My Orders
                                </Link>
                                <Link
                                    to="/products"
                                    className="glass-button w-full py-3 justify-center text-[rgb(var(--color-text))]"
                                >
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Continue Shopping
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>
            </section>
        </>
    );
}
