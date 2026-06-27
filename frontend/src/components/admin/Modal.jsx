import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring', damping: 25, stiffness: 350 },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: 0.15, ease: 'easeIn' },
    },
};

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement;
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const focusable = contentRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable?.length) focusable[0].focus();
            }, 100);
        } else {
            document.body.style.overflow = '';
            previousFocusRef.current?.focus();
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        function handleTab(e) {
            if (e.key !== 'Tab') return;
            const focusable = contentRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
        window.addEventListener('keydown', handleTab);
        return () => window.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
                    onClick={(e) => e.target === overlayRef.current && onClose()}
                >
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        ref={contentRef}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`relative z-10 w-full ${maxWidth} max-h-[95vh] sm:max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] shadow-2xl`}
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 rounded-t-2xl">
                            <h2 className="font-serif text-lg sm:text-xl font-bold text-[rgb(var(--color-text))]">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-subtle))] transition-all duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center"
                                aria-label="Close dialog"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
