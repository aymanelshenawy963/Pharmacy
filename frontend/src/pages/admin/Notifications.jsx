import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellDot, Check, Filter, RefreshCw } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import notify from '../../utils/notifications';
import { pageVariants, itemVariants } from '../../constants/animations';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/ConfirmDialog';
import { clsx } from 'clsx';

const STATUS_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Read', value: 'Read' },
    { label: 'Resolved', value: 'Resolved' },
];

function NotificationStatusBadge({ status }) {
    const isActive = status === 'Active';
    const isRead = status === 'Read';
    const isResolved = status === 'Resolved';

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
                isActive && 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
                isRead && 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
                isResolved && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
            )}
        >
            <span className={clsx(
                'h-1.5 w-1.5 rounded-full',
                isActive && 'bg-amber-500',
                isRead && 'bg-blue-500',
                isResolved && 'bg-emerald-500',
            )} />
            {status}
        </motion.span>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [isMarkOpen, setIsMarkOpen] = useState(false);
    const [markingNotification, setMarkingNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await notificationService.getAll(statusFilter || undefined);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            notify.errorFromApi(err, 'Failed to load notifications');
            setError('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    function openMarkAsRead(notification) {
        setMarkingNotification(notification);
        setIsMarkOpen(true);
    }

    async function handleMarkAsRead() {
        if (!markingNotification) return;
        setIsSubmitting(true);
        try {
            await notificationService.markAsRead(markingNotification.id);
            notify.success('Notification marked as read');
            setIsMarkOpen(false);
            setMarkingNotification(null);
            await fetchNotifications();
        } catch (err) {
            notify.errorFromApi(err, 'Failed to mark as read');
        } finally {
            setIsSubmitting(false);
        }
    }

    const columns = [
        {
            key: 'message',
            header: 'Message',
            render: (row) => (
                <div className="flex items-start gap-3 max-w-md">
                    <div className={clsx(
                        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ring-1',
                        row.status === 'Active'
                            ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
                            : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-muted))] ring-[rgb(var(--color-border))]',
                    )}>
                        {row.status === 'Active' ? <BellDot size={16} /> : <Bell size={16} />}
                    </div>
                    <div className="min-w-0">
                        <p className={clsx(
                            'text-sm leading-relaxed',
                            row.status === 'Active'
                                ? 'font-semibold text-[rgb(var(--color-text))]'
                                : 'text-[rgb(var(--color-text-muted))]',
                        )}>
                            {row.message}
                        </p>
                        {row.productName && (
                            <p className="mt-0.5 text-xs text-[rgb(var(--color-text-muted))]">
                                Product: {row.productName} (ID: {row.productId})
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'stockAtCreation',
            header: 'Stock',
            render: (row) => (
                <span className="font-mono text-sm font-medium text-[rgb(var(--color-text))]">
                    {row.stockAtCreation}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => <NotificationStatusBadge status={row.status} />,
        },
        {
            key: 'createdAt',
            header: 'Created',
            render: (row) => (
                <span className="text-xs text-[rgb(var(--color-text-muted))] whitespace-nowrap">
                    {formatDate(row.createdAt)}
                </span>
            ),
        },
        {
            key: 'resolvedAt',
            header: 'Resolved',
            render: (row) => (
                <span className="text-xs text-[rgb(var(--color-text-muted))] whitespace-nowrap">
                    {formatDate(row.resolvedAt)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: 'auto',
            render: (row) =>
                row.status === 'Active' ? (
                    <button
                        onClick={() => openMarkAsRead(row)}
                        className="rounded-lg p-2 text-[rgb(var(--color-text-muted))] hover:bg-blue-500/10 hover:text-blue-500 transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Mark as read"
                    >
                        <Check size={14} />
                    </button>
                ) : (
                    <span className="text-xs text-[rgb(var(--color-text-muted))] px-2">—</span>
                ),
        },
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title="Notifications"
                    description="Low-stock alerts and system notifications"
                    action={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchNotifications}
                                className="glass-button-secondary !p-2.5 !rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                                title="Refresh"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
                <Filter size={14} className="text-[rgb(var(--color-text-muted))]" />
                {STATUS_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setStatusFilter(opt.value)}
                        className={clsx(
                            'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 min-h-[32px]',
                            statusFilter === opt.value
                                ? 'bg-[rgb(var(--color-primary))] text-white shadow-md shadow-[rgb(var(--color-primary))]/25'
                                : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))]',
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </motion.div>

            <motion.div variants={itemVariants}>
                <DataTable
                    columns={columns}
                    data={notifications}
                    isLoading={isLoading}
                    error={error}
                    onRetry={fetchNotifications}
                    emptyTitle="No notifications found"
                    emptyDescription={
                        statusFilter
                            ? `No notifications with status "${statusFilter}".`
                            : 'There are no notifications yet. They appear when product stock runs low.'
                    }
                />
            </motion.div>

            <ConfirmDialog
                isOpen={isMarkOpen}
                onClose={() => { setIsMarkOpen(false); setMarkingNotification(null); }}
                onConfirm={handleMarkAsRead}
                title="Mark as Read"
                message={`Mark "${markingNotification?.message?.slice(0, 80)}..." as read?`}
                confirmText="Mark as Read"
                variant="primary"
                isLoading={isSubmitting}
            />
        </motion.div>
    );
}
