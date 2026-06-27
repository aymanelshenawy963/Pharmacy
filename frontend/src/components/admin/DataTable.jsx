import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';

function SkeletonRow({ columns }) {
    return (
        <tr className="border-b border-[rgb(var(--color-border))]">
            {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                    <div className="skeleton h-4 w-3/4 rounded-lg" />
                </td>
            ))}
        </tr>
    );
}

function SkeletonTable({ columns }) {
    return (
        <div className="glass-card">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" style={{ minWidth: 800 }}>
                    <thead>
                        <tr className="border-b border-[rgb(var(--color-border))]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-bg-subtle))]"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgb(var(--color-border))]">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonRow key={i} columns={columns} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.04,
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

const paginationVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.2 } },
};

export default function DataTable({
    columns,
    data,
    isLoading,
    error,
    onRetry,
    emptyTitle,
    emptyDescription,
    pageIndex = 1,
    totalPages = 1,
    onPageChange,
}) {
    if (isLoading) {
        return <SkeletonTable columns={columns} />;
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <div className="flex flex-col items-center gap-4 py-8">
                    <p className="text-sm text-red-500 text-center">{error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="glass-button-secondary !px-4 !py-2 text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="glass-card">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm" style={{ minWidth: 800 }}>
                    <thead>
                        <tr className="border-b border-[rgb(var(--color-border))]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-bg-subtle))]"
                                    style={col.width && col.width !== 'auto' ? { width: col.width } : undefined}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgb(var(--color-border))]">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <EmptyState
                                        title={emptyTitle || 'No data found'}
                                        description={emptyDescription || 'There are no items to display.'}
                                    />
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <motion.tr
                                    key={row.id || rowIdx}
                                    custom={rowIdx}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="transition-colors duration-150 hover:bg-[rgb(var(--color-bg-subtle))]/60"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="whitespace-nowrap px-4 py-3.5 text-[rgb(var(--color-text))]"
                                        >
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && onPageChange && (
                <motion.div
                    variants={paginationVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center justify-between border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-3 sm:px-4"
                >
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">
                        Page {pageIndex} of {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange(pageIndex - 1)}
                            disabled={pageIndex <= 1}
                            className="glass-button-secondary !p-2 !rounded-lg disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95 min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (pageIndex <= 3) {
                                page = i + 1;
                            } else if (pageIndex >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = pageIndex - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`h-9 w-9 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center ${
                                        page === pageIndex
                                            ? 'bg-[rgb(var(--color-primary))] text-white shadow-md shadow-[rgb(var(--color-primary))]/25'
                                            : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))] hover:text-[rgb(var(--color-text))]'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => onPageChange(pageIndex + 1)}
                            disabled={pageIndex >= totalPages}
                            className="glass-button-secondary !p-2 !rounded-lg disabled:opacity-30 transition-all duration-200 hover:scale-105 active:scale-95 min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
