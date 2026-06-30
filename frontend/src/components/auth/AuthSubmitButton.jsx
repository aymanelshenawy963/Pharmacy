import { motion } from 'framer-motion';

export default function AuthSubmitButton({ isSubmitting, children, className = '' }) {
    return (
        <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`glass-button-primary w-full !rounded-xl !py-3.5 !text-base transition-shadow duration-300 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20 ${className}`}
        >
            {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
                <span className="flex items-center gap-2 justify-center">
                    {children}
                </span>
            )}
        </motion.button>
    );
}
