import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Truck, Package, XCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/currency';
import { parseApiError } from '../../utils/apiErrorHandler';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBanner from '../../components/admin/ErrorBanner';
import toast from 'react-hot-toast';

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const STATUS_STYLES = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    Paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    Delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const PLACEHOLDER_IMG = 'https://placehold.co/80x80/f7fbfa/0d9488?text=N/A';

function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateStr;
    }
}

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const fetchOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data);
        } catch (err) {
            if (err.status === 404) {
                setError('not_found');
            } else {
                const msgs = parseApiError(err);
                setError(msgs.join(' '));
                toast.error(msgs.join(' '));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchOrder();
        return () => controller.abort();
    }, [id]);

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        setCancelling(true);
        try {
            await orderService.cancelOrder(id);
            toast.success('Order cancelled successfully.');
            fetchOrder();
        } catch (err) {
            const msgs = parseApiError(err);
            toast.error(msgs.join(' '));
        } finally {
            setCancelling(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Not found
    if (error === 'not_found' || (!loading && !order)) {
        return (
            <motion.div variants={pageVariants} initial="hidden" animate="visible">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-subtle))] ring-1 ring-[rgb(var(--color-border))] mb-4">
                        <Package className="h-8 w-8 text-[rgb(var(--color-text-muted))]" />
                    </div>
                    <h2 className="font-sans text-xl font-bold text-[rgb(var(--color-text))]">Order not found</h2>
                    <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                        This order doesn't exist or you don't have access to it.
                    </p>
                    <Link to="/account/orders" className="glass-button-primary mt-6">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Orders
                    </Link>
                </div>
            </motion.div>
        );
    }

    // Error
    if (error) {
        return (
            <motion.div variants={pageVariants} initial="hidden" animate="visible">
                <ErrorBanner message={error} onRetry={fetchOrder} />
                <div className="mt-4">
                    <Link to="/account/orders" className="text-sm text-[rgb(var(--color-primary))] hover:underline">
                        ← Back to Orders
                    </Link>
                </div>
            </motion.div>
        );
    }

    const canCancel = order.status === 'Pending' || order.status === 'Paid';
    const addr = order.shippingAddress;

    return (
        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link to="/account/orders" className="text-sm text-[rgb(var(--color-primary))] hover:underline mb-2 inline-flex items-center gap-1">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        All Orders
                    </Link>
                    <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[rgb(var(--color-text))]">
                        Order #{order.id}
                    </h1>
                    <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                        Placed on {formatDate(order.orderDate)}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                    </span>
                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors duration-200 disabled:opacity-50 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400"
                        >
                            <XCircle className="h-4 w-4" />
                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                {/* Order Items */}
                <motion.div variants={itemVariants} className="bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] p-5 sm:p-6">
                    <h2 className="font-sans text-lg font-semibold text-[rgb(var(--color-text))] mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                        Order Items
                    </h2>
                    <div className="space-y-4">
                        {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-[rgb(var(--color-bg-subtle))]">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))]">
                                    <img
                                        src={item.mainImage || PLACEHOLDER_IMG}
                                        alt={item.productName}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[rgb(var(--color-text))] line-clamp-1">{item.productName}</p>
                                    <p className="text-xs text-[rgb(var(--color-text-muted))]">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                </div>
                                <p className="text-sm font-bold text-[rgb(var(--color-text))]">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Order Info */}
                <div className="space-y-6">
                    {/* Shipping Address */}
                    {addr && (
                        <motion.div variants={itemVariants} className="bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] p-5 sm:p-6">
                            <h2 className="font-sans text-lg font-semibold text-[rgb(var(--color-text))] mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                                Shipping Address
                            </h2>
                            <div className="text-sm text-[rgb(var(--color-text-muted))] space-y-1">
                                <p className="font-medium text-[rgb(var(--color-text))]">{addr.firstName} {addr.lastName}</p>
                                <p>{addr.street}</p>
                                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Order Summary */}
                    <motion.div variants={itemVariants} className="bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] p-5 sm:p-6">
                        <h2 className="font-sans text-lg font-semibold text-[rgb(var(--color-text))] mb-4 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                            Order Summary
                        </h2>
                        <div className="space-y-3 text-sm">
                            {order.deliveryMethod && (
                                <div className="flex justify-between">
                                    <span className="text-[rgb(var(--color-text-muted))]">Delivery</span>
                                    <span className="font-medium text-[rgb(var(--color-text))]">{order.deliveryMethod}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-[rgb(var(--color-text-muted))]">Subtotal</span>
                                <span className="font-medium text-[rgb(var(--color-text))]">{formatPrice(order.subTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[rgb(var(--color-text-muted))]">Delivery Fee</span>
                                <span className="font-medium text-[rgb(var(--color-text))]">{formatPrice(order.deliveryPrice)}</span>
                            </div>
                            <div className="border-t border-[rgb(var(--color-border))] pt-3 mt-3">
                                <div className="flex justify-between">
                                    <span className="text-base font-semibold text-[rgb(var(--color-text))]">Total</span>
                                    <span className="text-lg font-bold text-[rgb(var(--color-text))]">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
