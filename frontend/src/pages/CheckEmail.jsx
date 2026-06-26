import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, Mailbox, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const floatAnimation = {
    y: [0, -6, 0],
    rotate: [0, 3, 0, -3, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

const pulseRing = {
    scale: [1, 1.4, 1],
    opacity: [0.4, 0, 0.4],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
};

export default function CheckEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi relative overflow-hidden">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            {/* Decorative floating elements */}
            <motion.div
                animate={{ y: [0, -10, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute top-20 left-[20%] h-16 w-16 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />
            <motion.div
                animate={{ y: [0, 8, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute bottom-24 right-[18%] h-14 w-14 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-md"
            >
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200 mb-8"
                    >
                        <ArrowLeft size={16} /> Back to sign up
                    </Link>
                </motion.div>

                <div className="relative">
                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))]/20 via-transparent to-[rgb(var(--color-primary))]/10 opacity-60" />
                    <div className="glass-card p-10 text-center relative rounded-3xl">
                        <motion.div variants={container} initial="hidden" animate="show">
                            {/* Animated email icon */}
                            <motion.div variants={fadeUp} className="mb-6 mx-auto relative">
                                {/* Pulse ring */}
                                <motion.div
                                    animate={pulseRing}
                                    className="absolute inset-0 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10"
                                />
                                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
                                    <motion.div animate={floatAnimation}>
                                        <Mailbox size={44} className="text-[rgb(var(--color-primary))]" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.h2 variants={fadeUp} className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                                Check your email
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-[rgb(var(--color-text-muted))] text-sm mb-2">
                                We&apos;ve sent a 6-digit confirmation code to:
                            </motion.p>
                            <motion.p
                                variants={fadeUp}
                                className="font-semibold text-[rgb(var(--color-text))] text-base mb-8 px-4 py-2 rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] inline-block w-full truncate"
                            >
                                {email || 'your email address'}
                            </motion.p>

                            {/* Actions */}
                            <motion.div variants={fadeUp} className="flex flex-col gap-3 w-full">
                                <motion.button
                                    onClick={() => navigate('/confirm-email', { state: { email } })}
                                    whileHover={{ scale: 1.01, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base transition-shadow duration-300 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Enter Verification Code <ArrowRight size={18} />
                                    </span>
                                </motion.button>
                                <Link
                                    to="/resend-confirmation"
                                    state={{ email }}
                                    className="glass-button-secondary w-full !rounded-xl !py-3 !text-sm transition-all duration-300 hover:shadow-md"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <RefreshCw size={15} /> Didn&apos;t receive it? Resend
                                    </span>
                                </Link>
                            </motion.div>

                            {/* Tip */}
                            <motion.p
                                variants={fadeUp}
                                className="mt-6 text-xs text-[rgb(var(--color-text-muted))] leading-relaxed"
                            >
                                <CheckCircle2 size={12} className="inline mr-1 text-green-500" />
                                Check your spam or junk folder if you don&apos;t see it.
                            </motion.p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
