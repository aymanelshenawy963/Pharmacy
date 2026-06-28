import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import { faqItems } from '../data/store';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.15 }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <>
            <Seo title="FAQ" description="Frequently asked questions about delivery, prescriptions, returns, payment methods, and WhatsApp ordering." />

            <div className="min-h-[calc(100vh-72px)] bg-surface relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-1/2 h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-3xl px-4 py-16 md:py-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="text-center mb-16"
                    >
                        <span className="kicker justify-center">FAQ</span>
                        <h1 className="display-heading text-4xl sm:text-5xl !mb-4">Common questions</h1>
                        <p className="text-lg text-text-muted">
                            Find quick answers to questions about delivery, prescriptions, returns, and payment methods.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                    >
                        {faqItems.map((item, index) => {
                            const isOpen = index === openIndex;
                            return (
                                <motion.div
                                    key={item.question}
                                    variants={staggerItem}
                                    className={`bg-surface overflow-hidden rounded-2xl border border-border shadow-sm transition-all duration-300 ${isOpen ? 'border-primary/30 shadow-lg shadow-primary/5' : 'hover:border-primary/20 hover:shadow-md'}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none group/faq"
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-sans text-xl font-medium transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-text group-hover/faq:text-primary'}`}>
                                            {item.question}
                                        </span>
                                        <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary/10 text-primary' : 'text-text-muted group-hover/faq:bg-bg-subtle group-hover/faq:text-primary'}`}>
                                            <Icon name="ChevronDown" className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                            >
                                                <div className="px-6 pb-6 pt-0 text-base leading-relaxed text-text-muted border-t border-border/50 mx-6">
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1, duration: 0.3 }}
                                                        className="pt-4"
                                                    >
                                                        {item.answer}
                                                    </motion.p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-16 text-center bg-surface p-8 rounded-2xl border border-primary/20 shadow-sm"
                    >
                        <h3 className="font-sans text-2xl mb-3 text-text">Still have questions?</h3>
                        <p className="text-text-muted mb-6">Can't find the answer you're looking for? Please contact our friendly team.</p>
                        <a href="/contact" className="glass-button-primary inline-flex">
                            Get in Touch
                        </a>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
