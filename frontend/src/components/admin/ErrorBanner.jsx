import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const bannerVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', damping: 20, stiffness: 300 },
    },
};

const iconVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: {
        scale: 1,
        rotate: 0,
        transition: { type: 'spring', damping: 12, stiffness: 400, delay: 0.1 },
    },
};

export default function ErrorBanner({ message, onRetry = null }) {
    if (!message) return null;

    return (
        <motion.div
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 p-4 dark:border-red-900/30 dark:from-red-900/15 dark:to-red-900/5"
        >
            <motion.div variants={iconVariants} initial="hidden" animate="visible">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            </motion.div>
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
        </motion.div>
    );
}
