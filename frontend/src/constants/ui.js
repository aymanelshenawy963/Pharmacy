export const PLACEHOLDER_IMG = 'https://placehold.co/800x800/f7fbfa/0d9488?text=No+Image';
export const PLACEHOLDER_IMG_SM = 'https://placehold.co/100x100/f7fbfa/0d9488?text=N/A';
export const PLACEHOLDER_IMG_XS = 'https://placehold.co/80x80/f7fbfa/0d9488?text=N/A';

export const ORDER_STATUS_STYLES = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    PaymentReceived: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
    PaymentFailed: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    Paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    Delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export function formatDate(dateStr) {
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

export function formatDateLong(dateStr) {
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

export function calculateDiscount(price, mrp) {
    if (!mrp || !price || mrp <= price) return 0;
    return Math.max(0, Math.round(((mrp - price) / mrp) * 100));
}
