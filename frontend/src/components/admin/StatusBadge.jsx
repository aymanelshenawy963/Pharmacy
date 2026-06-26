import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 4 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring', damping: 15, stiffness: 400 },
    },
};

const dotVariants = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: { type: 'spring', damping: 12, stiffness: 500, delay: 0.15 },
    },
};

export default function StatusBadge({ active = true, activeText = 'Active', inactiveText = 'Inactive' }) {
    return (
        <motion.span
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className={clsx(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
                active
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
            )}
        >
            <motion.span
                variants={dotVariants}
                initial="hidden"
                animate="visible"
                className={clsx(
                    'mr-1.5 h-1.5 w-1.5 rounded-full',
                    active ? 'bg-emerald-500' : 'bg-red-500'
                )}
            />
            {active ? activeText : inactiveText}
        </motion.span>
    );
}
