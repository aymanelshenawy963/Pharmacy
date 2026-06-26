import { motion } from 'framer-motion';
import Icon from './Icons';

export default function TrustBadges({ badges }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {badges.map((badge, index) => (
                <motion.div
                    key={badge.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -2 }}
                    className="glass-card flex items-center gap-3.5 p-4"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]">
                        <Icon name={badge.iconKey} className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-[rgb(var(--color-text))]">{badge.title}</p>
                </motion.div>
            ))}
        </div>
    );
}
