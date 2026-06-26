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
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <motion.h1
                    variants={itemVariants}
                    className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] md:text-3xl"
                >
                    {title}
                </motion.h1>
                {description && (
                    <motion.p
                        variants={itemVariants}
                        className="mt-1.5 text-sm leading-relaxed text-[rgb(var(--color-text-muted))]"
                    >
                        {description}
                    </motion.p>
                )}
            </div>
            {action && <motion.div variants={itemVariants}>{action}</motion.div>}
        </motion.div>
    );
}
