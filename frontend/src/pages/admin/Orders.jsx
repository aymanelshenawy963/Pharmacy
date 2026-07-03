import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/currency';
import notify from '../../utils/notifications';
import { ORDER_STATUS_STYLES, formatDate } from '../../constants/ui';
import { pageVariants } from '../../constants/animations';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const STATUS_OPTIONS = ['All', 'Pending', 'Paid', 'Cancelled'];

export default function AdminOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getAllOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load orders.');
            notify.errorFromApi(err, 'Failed to load orders.');
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
            result = result.filter((o) => o.status === statusFilter);
        }

        return result;
    }, [orders, statusFilter]);

    const columns = [
        {
            key: 'id',
            header: 'Order',
            render: (row) => (
                <span className="font-semibold text-[rgb(var(--color-text))]">#{row.id}</span>
            ),
        },
        {
            key: 'buyerEmail',
            header: 'Customer',
            render: (row) => (
                <div>
                    <p className="font-medium text-[rgb(var(--color-text))]">
                        {row.shippingAddress?.firstName} {row.shippingAddress?.lastName}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">{row.buyerEmail}</p>
                </div>
            ),
        },
        {
            key: 'orderDate',
            header: 'Date',
            render: (row) => (
                <span className="text-[rgb(var(--color-text-muted))]">{formatDate(row.orderDate)}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ORDER_STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-800'}`}>
                    {row.status}
                </span>
            ),
        },
        {
            key: 'items',
            header: 'Items',
            render: (row) => (
                <span className="text-[rgb(var(--color-text-muted))]">
                    {row.orderItems?.length || 0} item{(row.orderItems?.length || 0) !== 1 ? 's' : ''}
                </span>
            ),
        },
        {
            key: 'total',
            header: 'Total',
            render: (row) => (
                <span className="font-semibold text-[rgb(var(--color-text))]">{formatPrice(row.total)}</span>
            ),
        },
        {
            key: 'actions',
            header: '',
            render: (row) => (
                <Link
                    to={`/admin/orders/${row.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[rgb(var(--color-bg-subtle))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-primary))]/10 hover:text-[rgb(var(--color-primary))] transition-all duration-200"
                >
                    <Eye size={14} />
                    View
                </Link>
            ),
        },
    ];

    return (
        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
            <PageHeader
                title="Orders"
                description="Manage all customer orders"
                action={
                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="glass-button-secondary !px-4 !py-2 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        Refresh
                    </button>
                }
            />

            {/* Filters */}
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

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filtered}
                    isLoading={false}
                    error={error}
                    onRetry={fetchOrders}
                    emptyTitle="No orders found"
                    emptyDescription={
                        statusFilter !== 'All'
                            ? 'No orders match your filters.'
                            : 'No orders have been placed yet.'
                    }
                />
            )}
        </motion.div>
    );
}
