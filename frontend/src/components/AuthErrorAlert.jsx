import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthErrorAlert({ errors, children }) {
    if (!errors || errors.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="mb-6 rounded-2xl bg-red-50 dark:bg-red-900/15 p-4 border border-red-200/60 dark:border-red-800/30 flex items-start gap-3"
        >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="text-red-500" size={16} />
            </div>
            <div className="flex-1">
                {errors.length === 1 ? (
                    <ErrorMessage text={errors[0]} />
                ) : (
                    <ul className="list-disc pl-4 space-y-1">
                        {errors.map((err, idx) => (
                            <li key={idx} className="text-sm text-red-600 dark:text-red-400 font-medium">
                                <ErrorMessage text={err} />
                            </li>
                        ))}
                    </ul>
                )}
                {children}
            </div>
        </motion.div>
    );
}

function ErrorMessage({ text }) {
    if (text.includes("Password must be at least 8 characters") && text.includes("uppercase")) {
        return (
            <div className="text-sm text-red-600 dark:text-red-400 font-medium leading-snug">
                <p>Password must be at least 8 characters and include:</p>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-xs">
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                </ul>
            </div>
        );
    }
    
    return (
        <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-snug">
            {text}
        </p>
    );
}
