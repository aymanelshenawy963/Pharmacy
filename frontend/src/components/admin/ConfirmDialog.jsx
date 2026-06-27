import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring', damping: 22, stiffness: 300 },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.15, ease: 'easeIn' },
    },
};

const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
        scale: 1,
        rotate: 0,
        transition: { type: 'spring', damping: 15, stiffness: 400, delay: 0.15 },
    },
};

const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.1, duration: 0.3 },
    },
};

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}) {
    const variantClasses = {
        danger: 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
        warning: 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40',
        primary: 'bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] shadow-lg shadow-[rgb(var(--color-primary))]/25 hover:shadow-[rgb(var(--color-primary))]/40',
    };

    const iconBg = {
        danger: 'bg-red-100 dark:bg-red-900/30',
        warning: 'bg-amber-100 dark:bg-amber-900/30',
        primary: 'bg-blue-100 dark:bg-blue-900/30',
    };

    const iconColor = {
        danger: 'text-red-500',
        warning: 'text-amber-500',
        primary: 'text-[rgb(var(--color-primary))]',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        variants={dialogVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative z-10 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] shadow-2xl p-5 sm:p-6"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="confirm-title"
                        aria-describedby="confirm-message"
                    >
                        <motion.div
                            className="flex items-start gap-3 sm:gap-4"
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                variants={iconVariants}
                                initial="hidden"
                                animate="visible"
                                className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl ${iconBg[variant]}`}
                            >
                                <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor[variant]}`} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                                <h3
                                    id="confirm-title"
                                    className="font-serif text-base sm:text-lg font-bold text-[rgb(var(--color-text))]"
                                >
                                    {title}
                                </h3>
                                <p
                                    id="confirm-message"
                                    className="mt-2 text-sm leading-relaxed text-[rgb(var(--color-text-muted))]"
                                >
                                    {message}
                                </p>
                            </div>
                        </motion.div>
                        <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="glass-button-secondary !px-5 !py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto min-h-[44px]"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`glass-button !px-5 !py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto min-h-[44px] ${variantClasses[variant]}`}
                            >
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mx-auto" />
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
