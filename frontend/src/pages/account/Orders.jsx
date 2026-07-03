import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/currency';
import notify from '../../utils/notifications';
import { ORDER_STATUS_STYLES, formatDate } from '../../constants/ui';
import { pageVariants, itemVariants } from '../../constants/animations';
import PageHeader from '../../components/admin/PageHeader';
import SearchInput from '../../components/admin/SearchInput';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBanner from '../../components/admin/ErrorBanner';
import EmptyState from '../../components/admin/EmptyState';

const STATUS_OPTIONS = ['All', 'Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('Admin');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getMyOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            if (err.status === 403 || err.statusCode === 403) {
                setError('access_denied');
            } else {
                setError('Failed to load orders.');
                notify.errorFromApi(err, 'Failed to load orders.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filtered = useMemo(() => {
        let result = orders;

        if (statusFilter !== 'All') {
            result = result.filter((o) =>
                statusFilter === 'Paid'
                    ? o.status === 'Paid' || o.status === 'PaymentReceived'
                    : o.status === statusFilter
            );
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (o) =>
                    String(o.id).includes(q) ||
                    o.deliveryMethod?.toLowerCase().includes(q)
            );
        }

        return result;
    }, [orders, search, statusFilter]);

    if (error === 'access_denied') {
        return (
            <motion.div variants={pageVariants} initial="hidden" animate="visible">
                <PageHeader
                    title="My Orders"
                    subtitle="View and track your orders"
                />
                <EmptyState
                    icon={Shield}
                    title="Admin accounts cannot view customer orders"
                    description="You are logged in as an Admin. Use the Admin Orders panel to manage all orders."
                    action={
                        isAdmin ? (
                            <Link to="/admin/orders" className="glass-button-primary w-full sm:w-auto justify-center">
                                Go to Admin Orders
                            </Link>
                        ) : (
                            <Link to="/products" className="glass-button-primary w-full sm:w-auto justify-center">
                                Browse Products
                            </Link>
                        )
                    }
                />
            </motion.div>
        );
    }

    return (
        <motion.div variants={pageVariants} initial="hidden" animate="visible">
            <PageHeader
                title="My Orders"
                subtitle="View and track your orders"
            />

            {error && error !== 'access_denied' && <ErrorBanner message={error} onRetry={fetchOrders} />}

            {!loading && !error && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by order ID..."
                        className="flex-1"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 min-h-[44px] ${
                                    statusFilter === status
                                        ? 'bg-[rgb(var(--color-primary))] text-white shadow-sm'
                                        : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-border))]'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title={search || statusFilter !== 'All' ? 'No orders match your filters' : 'No orders yet'}
                    description={
                        search || statusFilter !== 'All'
                            ? 'Try adjusting your search or filter criteria.'
                            : 'When you place an order, it will appear here.'
                    }
                    action={
                        search || statusFilter !== 'All' ? (
                            <button
                                onClick={() => { setSearch(''); setStatusFilter('All'); }}
                                className="glass-button-primary w-full sm:w-auto justify-center"
                            >
                                Clear Filters
                            </button>
                        ) : (
                            <Link to="/products" className="glass-button-primary w-full sm:w-auto justify-center">
                                Browse Products
                            </Link>
                        )
                    }
                />
            ) : (
                <motion.div variants={itemVariants} className="space-y-4 mt-6">
                    {filtered.map((order) => (
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
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ORDER_STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-800'}`}>
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
