import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function EmptyState({
    icon: IconComponent = Inbox,
    title = 'No data found',
    description = 'There are no items to display.',
    action = null,
}) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-12 sm:py-20 px-4 sm:px-6"
        >
            <motion.div
                variants={itemVariants}
                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-subtle))] ring-1 ring-[rgb(var(--color-border))]"
            >
                <IconComponent className="h-7 w-7 sm:h-9 sm:w-9 text-[rgb(var(--color-text-muted))]" />
            </motion.div>
            <motion.h3
                variants={itemVariants}
                className="mt-4 sm:mt-5 font-serif text-base sm:text-lg font-bold text-[rgb(var(--color-text))] text-center"
            >
                {title}
            </motion.h3>
            <motion.p
                variants={itemVariants}
                className="mt-2 max-w-xs sm:max-w-sm text-center text-xs sm:text-sm leading-relaxed text-[rgb(var(--color-text-muted))]"
            >
                {description}
            </motion.p>
            {action && <motion.div variants={itemVariants} className="mt-5 sm:mt-6 w-full sm:w-auto">{action}</motion.div>}
        </motion.div>
    );
}
