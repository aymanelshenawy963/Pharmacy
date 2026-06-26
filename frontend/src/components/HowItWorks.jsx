import { motion } from 'framer-motion';
import Icon from './Icons';

export default function HowItWorks({ steps }) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
                <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3 }}
                    className="glass-card glass-card-hover relative p-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(var(--color-secondary))]/10 text-[rgb(var(--color-secondary))]">
                            <Icon name={step.iconKey} className="h-5 w-5" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))]/10 text-xs font-bold text-[rgb(var(--color-primary))]">
                            0{index + 1}
                        </div>
                    </div>
                    <h3 className="mt-5 font-serif text-lg font-bold text-[rgb(var(--color-text))]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--color-text-muted))]">{step.text}</p>
                    {index < steps.length - 1 ? (
                        <div className="absolute right-4 top-1/2 hidden h-px w-12 bg-[rgb(var(--color-border))] xl:block" />
                    ) : null}
                </motion.div>
            ))}
        </div>
    );
}
