import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({ message, onRetry = null }) {
    if (!message) return null;

    return (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 p-4 dark:border-red-900/30 dark:from-red-900/15 dark:to-red-900/5 animate-[fadeInDown_0.3s_cubic-bezier(0.16,1,0.3,1)_both]">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Error</p>
                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/70 leading-relaxed">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-sm font-semibold text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 hover:underline underline-offset-2"
                >
                    Retry
                </button>
            )}
        </div>
    );
}
