import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import Icon from '../components/Icons';
import { storeInfo } from '../data/products';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function CancelOrder() {
    return (
        <>
            <Seo title="Cancellation & Refund Policy" description="Order cancellation and refund policy for Jaya Medical Store." />

            <main className="bg-surface min-h-[calc(100vh-72px)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-secondary/5 blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-6 md:px-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <span className="kicker">Return Info</span>
                        <h1 className="display-heading !mb-4 tracking-tight">
                            Cancellation Policy
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
                            We understand that plans change. Review our policy below to understand how and when you can cancel your order.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="mt-12 space-y-10"
                    >
                        {/* Highlighted Policy Box */}
                        <motion.div variants={staggerItem} className="glass-card p-8 md:p-10 border-tertiary/20 bg-tertiary/5">
                            <div className="flex items-start gap-5">
                                <motion.div
                                    whileHover={{ rotate: -10, scale: 1.1 }}
                                    className="mt-1 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/20 transition-transform duration-300"
                                >
                                    <Icon name="Clock" className="h-6 w-6" />
                                </motion.div>
                                <div>
                                    <h2 className="font-serif text-2xl font-semibold text-text mb-3">
                                        The 2-Hour Cancellation Window
                                    </h2>
                                    <p className="text-base leading-relaxed text-text-muted">
                                        Orders can be cancelled free of charge <strong className="text-text font-bold">within 2 hours</strong> of placement. Since we process and dispatch medical supplies quickly to ensure timely delivery, we cannot accept cancellations once an order has left our pharmacy.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* How to Cancel */}
                            <motion.div variants={staggerItem} className="glass-card p-8">
                                <h3 className="font-serif text-2xl font-semibold text-text mb-4">
                                    How to Cancel
                                </h3>
                                <p className="text-base leading-relaxed text-text-muted mb-6">
                                    To cancel your order, you must provide your order details directly to our support team within the 2-hour window. Please share your Name and Order ID using one of the methods below:
                                </p>

                                <div className="space-y-4">
                                    <motion.a
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={storeInfo.whatsapp}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex w-full items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                                            <Icon name="MessageCircle" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text">WhatsApp Us</p>
                                            <p className="text-xs text-text-muted mt-0.5">Fastest response time</p>
                                        </div>
                                    </motion.a>

                                    <motion.a
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        href={`tel:${storeInfo.phone.replace(/\s/g, '')}`}
                                        className="flex w-full items-center gap-4 rounded-xl border border-border bg-bg-subtle p-4 transition-all duration-300 hover:bg-bg hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg border border-border text-text">
                                            <Icon name="Phone" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text">Call Support</p>
                                            <p className="text-xs text-text-muted mt-0.5">{storeInfo.phone}</p>
                                        </div>
                                    </motion.a>
                                </div>
                            </motion.div>

                            {/* Refunds & Exceptions */}
                            <motion.div variants={staggerItem} className="glass-card p-8">
                                <h3 className="font-serif text-2xl font-semibold text-text mb-6">
                                    Refunds & Exceptions
                                </h3>
                                <ul className="space-y-5 text-base leading-relaxed text-text-muted">
                                    <li className="flex items-start gap-4">
                                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                                            <Icon name="CheckCircle2" className="h-4 w-4 text-green-500" />
                                        </div>
                                        <span>If you cancel within 2 hours, 95% of your pre-paid amount will be refunded to your original payment method within 3-5 business days (a 5% deduction applies due to payment gateway processing charges).</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary/10 border border-tertiary/20">
                                            <Icon name="AlertCircle" className="h-4 w-4 text-tertiary" />
                                        </div>
                                        <span>Temperature-sensitive medicines (like insulin) cannot be returned or cancelled once dispatched under any circumstances due to strict safety regulations.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                                            <Icon name="Ban" className="h-4 w-4 text-red-500" />
                                        </div>
                                        <span>Orders cancelled after the 2-hour window, or orders refused at the time of delivery, may be subject to a nominal delivery cancellation fee.</span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
