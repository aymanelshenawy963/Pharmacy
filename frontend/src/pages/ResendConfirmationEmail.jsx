import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { validators } from '../utils/validators';
import Input from '../components/Input';
import { ArrowLeft, ArrowRight, Mail, MailCheck } from 'lucide-react';
import { parseApiError } from '../utils/apiErrorHandler';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { motion } from 'framer-motion';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const floatingAnimation = {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
};

export default function ResendConfirmationEmail() {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [error, setError] = useState(null);
    const [serverError, setServerError] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(null);
        setServerError([]);
    };

    const validate = () => {
        const emailErr = validators.email(email);
        if (emailErr) { setError(emailErr); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError([]);
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const msg = await authService.resendConfirmationEmail(email);
            setIsSuccess(true);
            setSuccessMessage(msg || 'Confirmation email sent. Please check your inbox.');
        } catch (err) {
            if (err.status === 409) {
                setIsSuccess(true);
                setSuccessMessage('This email is already confirmed. You can proceed to sign in.');
            } else {
                setServerError(parseApiError(err, 'Failed to resend confirmation email. Please try again.'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Success state ── */
    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-bg-subtle relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="bg-surface p-10 text-center rounded-2xl border border-border shadow-sm">
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 180 }}
                            className="mb-6 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/25"
                        >
                            <MailCheck size={40} className="text-[rgb(var(--color-primary))]" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-3"
                        >
                            Email sent!
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="text-[rgb(var(--color-text-muted))] text-sm mb-8 leading-relaxed"
                        >
                            {successMessage}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <Link
                                to="/login"
                                className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base inline-block"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Return to Sign In <ArrowRight size={18} />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    /* ── Form state ── */
    return (
            <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-bg-subtle relative overflow-hidden">

            {/* Decorative floating elements */}
            <motion.div
                animate={floatingAnimation}
                className="absolute top-24 left-[18%] h-16 w-16 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />
            <motion.div
                animate={{ y: [0, 8, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute bottom-20 right-[15%] h-14 w-14 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
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
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200 mb-8"
                    >
                        <ArrowLeft size={16} /> Back to sign in
                    </Link>
                </motion.div>

                <div className="relative">
                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))]/20 via-transparent to-[rgb(var(--color-primary))]/10 opacity-60" />
                    <div className="bg-surface p-8 sm:p-10 relative rounded-3xl border border-border shadow-sm">
                        <motion.div variants={container} initial="hidden" animate="show">
                            <motion.div variants={fadeUp} className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                                <motion.div
                                    initial={{ rotate: -15 }}
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                                >
                                    <Mail className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                                </motion.div>
                            </motion.div>

                            <motion.h2 variants={fadeUp} className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                                Resend confirmation
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                                Didn&apos;t receive the confirmation email? Enter your address and we&apos;ll resend it.
                            </motion.p>

                            {serverError.length > 0 && (
                                <motion.div variants={fadeUp} className="mb-6">
                                    <AuthErrorAlert errors={serverError} />
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                                <motion.div variants={fadeUp}>
                                    <Input
                                        label="Email address"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={handleChange}
                                        error={error}
                                        placeholder="you@example.com"
                                        autoFocus
                                        autoComplete="email"
                                    />
                                </motion.div>
                                <motion.div variants={fadeUp}>
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base transition-shadow duration-300 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                                    >
                                        {isSubmitting ? (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        ) : (
                                            <span className="flex items-center gap-2 justify-center">
                                                Resend Email <ArrowRight size={18} />
                                            </span>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
