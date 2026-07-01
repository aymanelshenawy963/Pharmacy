import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, Mailbox, RefreshCw } from 'lucide-react';
import { AUTH_ROUTES, authContainerVariants, authFadeUpVariants } from '../constants/auth';
import { AuthFloatingElements, AuthCard } from '../components/auth';
import { motion } from 'framer-motion';

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
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-bg-subtle relative overflow-hidden">
            <AuthFloatingElements />

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
                        to={AUTH_ROUTES.REGISTER}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200 mb-8"
                    >
                        <ArrowLeft size={16} /> Back to sign up
                    </Link>
                </motion.div>

                <AuthCard className="text-center">
                    <motion.div variants={authContainerVariants} initial="hidden" animate="show">
                        <motion.div variants={authFadeUpVariants} className="mb-6 mx-auto relative">
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

                        <motion.h2 variants={authFadeUpVariants} className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                            Check your email
                        </motion.h2>
                        <motion.p variants={authFadeUpVariants} className="text-[rgb(var(--color-text-muted))] text-sm mb-2">
                            We&apos;ve sent a 6-digit confirmation code to:
                        </motion.p>
                        <motion.p
                            variants={authFadeUpVariants}
                            className="font-semibold text-[rgb(var(--color-text))] text-base mb-8 px-4 py-2 rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] inline-block w-full truncate"
                        >
                            {email || 'your email address'}
                        </motion.p>

                        <motion.div variants={authFadeUpVariants} className="flex flex-col gap-3 w-full">
                            <motion.button
                                onClick={() => navigate(AUTH_ROUTES.CONFIRM_EMAIL, { state: { email } })}
                                whileHover={{ scale: 1.01, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base transition-shadow duration-300 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Enter Verification Code <ArrowRight size={18} />
                                </span>
                            </motion.button>
                            <Link
                                to={AUTH_ROUTES.RESEND_CONFIRMATION}
                                state={{ email }}
                                className="glass-button-secondary w-full !rounded-xl !py-3 !text-sm transition-all duration-300 hover:shadow-md"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <RefreshCw size={15} /> Didn&apos;t receive it? Resend
                                </span>
                            </Link>
                        </motion.div>

                        <motion.p
                            variants={authFadeUpVariants}
                            className="mt-6 text-xs text-[rgb(var(--color-text-muted))] leading-relaxed"
                        >
                            <CheckCircle2 size={12} className="inline mr-1 text-green-500" />
                            Check your spam or junk folder if you don&apos;t see it.
                        </motion.p>
                    </motion.div>
                </AuthCard>
            </motion.div>
        </div>
    );
}
