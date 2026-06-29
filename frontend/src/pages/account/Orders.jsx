import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, RefreshCw } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/currency';
import { parseApiError } from '../../utils/apiErrorHandler';
import PageHeader from '../../components/admin/PageHeader';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBanner from '../../components/admin/ErrorBanner';
import EmptyState from '../../components/admin/EmptyState';
import toast from 'react-hot-toast';

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getMyOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            const msgs = parseApiError(err);
            setError(msgs.join(' '));
            toast.error(msgs.join(' '));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchOrders();
        return () => controller.abort();
    }, []);

    return (
        <motion.div variants={pageVariants} initial="hidden" animate="visible">
            <PageHeader
                title="My Orders"
                subtitle="View and track your orders"
            />

            {error && <ErrorBanner message={error} onRetry={fetchOrders} />}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="When you place an order, it will appear here."
                    action={
                        <Link to="/products" className="glass-button-primary w-full sm:w-auto justify-center">
                            Browse Products
                        </Link>
                    }
                />
            ) : (
                <motion.div variants={itemVariants} className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            to={`/account/orders/${order.id}`}
                            className="block bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:border-[rgb(var(--color-primary))]/20 group"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-sm font-bold text-[rgb(var(--color-text))]">
                                            Order #{order.id}
                                        </h3>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[rgb(var(--color-text-muted))]">
                                        {formatDate(order.orderDate)} · {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
                                    </p>
                                    {order.deliveryMethod && (
                                        <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
                                            {order.deliveryMethod}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-[rgb(var(--color-text))]">{formatPrice(order.total)}</p>
                                        <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
                                            Subtotal: {formatPrice(order.subTotal)}
                                        </p>
                                    </div>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))] group-hover:bg-[rgb(var(--color-primary))]/10 group-hover:text-[rgb(var(--color-primary))] transition-all duration-200">
                                        <Eye size={16} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
