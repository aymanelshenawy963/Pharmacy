import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Truck, Package, Save } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/currency';
import notify from '../../utils/notifications';
import { ORDER_STATUS_STYLES, formatDateLong, PLACEHOLDER_IMG_XS } from '../../constants/ui';
import { pageVariants, itemVariants } from '../../constants/animations';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBanner from '../../components/admin/ErrorBanner';

const ORDER_STATUSES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

function getStatusTransitions(currentStatus) {
    switch (currentStatus) {
        case 'Pending':
            return ['Paid', 'Cancelled'];
        case 'Paid':
            return ['Shipped', 'Cancelled'];
        case 'Shipped':
            return ['Delivered'];
        case 'Delivered':
            return [];
        case 'Cancelled':
            return [];
        default:
            return [];
    }
}

export default function AdminOrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrderByIdAdmin(id);
            setOrder(data);
            setNewStatus('');
        } catch (err) {
            if (err.status === 404) {
                setError('not_found');
            } else {
                setError('Failed to load order details.');
                notify.errorFromApi(err, 'Failed to load order details.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === order.status) return;

        setUpdating(true);
        try {
            await orderService.updateOrderStatus(id, newStatus);
            notify.success(`Order status updated to ${newStatus}.`);
            fetchOrder();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to update order status.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error === 'not_found' || (!loading && !order)) {
        return (
            <motion.div variants={pageVariants} initial="hidden" animate="visible">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-subtle))] ring-1 ring-[rgb(var(--color-border))] mb-4">
                        <Package className="h-8 w-8 text-[rgb(var(--color-text-muted))]" />
                    </div>
                    <h2 className="font-sans text-xl font-bold text-[rgb(var(--color-text))]">Order not found</h2>
                    <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
                        This order doesn't exist.
                    </p>
                    <Link to="/admin/orders" className="glass-button-primary mt-6">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Orders
                    </Link>
                </div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div variants={pageVariants} initial="hidden" animate="visible">
                <ErrorBanner message={error} onRetry={fetchOrder} />
                <div className="mt-4">
                    <Link to="/admin/orders" className="text-sm text-[rgb(var(--color-primary))] hover:underline">
                        ← Back to Orders
                    </Link>
                </div>
            </motion.div>
        );
    }

    const allowedTransitions = getStatusTransitions(order.status);
    const addr = order.shippingAddress;

    return (
        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link to="/admin/orders" className="text-sm text-[rgb(var(--color-primary))] hover:underline mb-2 inline-flex items-center gap-1">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        All Orders
                    </Link>
                    <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[rgb(var(--color-text))]">
                        Order #{order.id}
                    </h1>
                    <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                        Placed on {formatDateLong(order.orderDate)} by {order.buyerEmail}
                    </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold self-start ${ORDER_STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                </span>
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
                                        src={item.mainImage || PLACEHOLDER_IMG_XS}
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
                    {/* Status Update */}
                    {allowedTransitions.length > 0 && (
                        <motion.div variants={itemVariants} className="bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] p-5 sm:p-6">
                            <h2 className="font-sans text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
                                Update Status
                            </h2>
                            <div className="flex flex-col gap-3">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-sm text-[rgb(var(--color-text))] outline-none transition-all duration-200 focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20"
                                >
                                    <option value="">Select new status...</option>
                                    {allowedTransitions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={!newStatus || newStatus === order.status || updating}
                                    className="glass-button-primary w-full py-3 text-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Status
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

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
