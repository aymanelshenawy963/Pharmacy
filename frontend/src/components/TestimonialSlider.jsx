import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icons';

export default function TestimonialSlider({ testimonials }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % testimonials.length);
        }, 5000);
        return () => window.clearInterval(timer);
    }, [testimonials.length]);

    const current = testimonials[index];

    return (
        <div className="bg-[rgb(var(--color-surface))] rounded-2xl border border-[rgb(var(--color-border))] shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                        Customer Notes
                    </p>
                    <h3 className="mt-2 font-sans text-2xl font-bold text-[rgb(var(--color-text))]">What customers say</h3>
                </div>
                <div className="flex gap-1.5">
                    <button
                        type="button"
                        onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
                        className="glass-icon-button"
                        aria-label="Previous testimonial"
                    >
                        <Icon name="ChevronLeft" className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
                        className="glass-icon-button"
                        aria-label="Next testimonial"
                    >
                        <Icon name="ChevronRight" className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={current.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]"
                >
                    <div className="rounded-2xl bg-[rgb(var(--color-bg-subtle))] p-6">
                        <div className="flex items-center gap-0.5 text-[rgb(var(--color-secondary))]">
                            {Array.from({ length: current.rating }).map((_, i) => (
                                <Icon key={i} name="Star" className="h-4 w-4 fill-current" />
                            ))}
                        </div>
                        <p className="mt-4 text-base leading-relaxed text-[rgb(var(--color-text))]">&ldquo;{current.text}&rdquo;</p>
                    </div>
                    <div className="flex items-end justify-between rounded-2xl bg-[rgb(var(--color-text))] p-6 text-white">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Reviewer</p>
                            <p className="mt-2 font-sans text-xl font-bold">{current.name}</p>
                            <p className="mt-2 text-sm text-white/60">
                                Trusted customer of Jaya Medical Store
                            </p>
                        </div>
                        <div className="hidden rounded-xl border border-white/10 bg-white/5 p-3 text-white/30 lg:block">
                            <Icon name="Quote" className="h-6 w-6" />
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-1.5">
                {testimonials.map((t, i) => (
                    <button
                        key={t.name}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={`rounded-full transition-all duration-300 ${
                            i === index
                                ? 'h-2 w-8 bg-[rgb(var(--color-primary))]'
                                : 'h-2 w-2 bg-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-text-muted))]'
                        }`}
                        aria-label={`Show testimonial from ${t.name}`}
                    />
                ))}
            </div>
        </div>
    );
}
