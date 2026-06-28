import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function PageHeader({ title, description, action = null }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="min-w-0">
                <motion.h1
                    variants={itemVariants}
                    className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(var(--color-text))] leading-tight"
                >
                    {title}
                </motion.h1>
                {description && (
                    <motion.p
                        variants={itemVariants}
                        className="mt-1 text-xs sm:text-sm leading-relaxed text-[rgb(var(--color-text-muted))] line-clamp-2"
                    >
                        {description}
                    </motion.p>
                )}
            </div>
            {action && <motion.div variants={itemVariants} className="flex-shrink-0">{action}</motion.div>}
        </motion.div>
    );
}
