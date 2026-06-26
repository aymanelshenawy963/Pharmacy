import { ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

export default function DataTable({
    columns,
    data,
    isLoading,
    error,
    onRetry,
    emptyTitle,
    emptyDescription,
    // Pagination
    pageIndex = 1,
    totalPages = 1,
    onPageChange,
}) {
    if (isLoading) {
        return (
            <div className="glass-card overflow-hidden">
                <div className="p-12">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card p-6">
                <div className="flex flex-col items-center gap-4 py-8">
                    <p className="text-sm text-red-500">{error}</p>
                    {onRetry && (
                        <button onClick={onRetry} className="glass-button-secondary !px-4 !py-2 text-sm">
                            Retry
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[rgb(var(--color-border))]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-bg-subtle))]"
                                    style={col.width ? { width: col.width } : undefined}
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
                                    <EmptyState title={emptyTitle || 'No data found'} description={emptyDescription || 'There are no items to display.'} />
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr
                                    key={row.id || rowIdx}
                                    className="transition-colors hover:bg-[rgb(var(--color-bg-subtle))]/50"
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="whitespace-nowrap px-4 py-3 text-[rgb(var(--color-text))]">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && onPageChange && (
                <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-4 py-3">
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">
                        Page {pageIndex} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(pageIndex - 1)}
                            disabled={pageIndex <= 1}
                            className="glass-button-secondary !p-2 !rounded-lg disabled:opacity-30"
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
                                    className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                                        page === pageIndex
                                            ? 'bg-[rgb(var(--color-primary))] text-white'
                                            : 'text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-bg-subtle))]'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => onPageChange(pageIndex + 1)}
                            disabled={pageIndex >= totalPages}
                            className="glass-button-secondary !p-2 !rounded-lg disabled:opacity-30"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
