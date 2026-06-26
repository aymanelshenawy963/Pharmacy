import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({ message, onRetry = null }) {
    if (!message) return null;

    return (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="flex-1">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-sm font-semibold text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                    Retry
                </button>
            )}
        </div>
    );
}
