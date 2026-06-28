import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { validators } from '../utils/validators';
import Input from '../components/Input';
import { ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';
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

export default function ForgotPassword() {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [error, setError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(null);
        setServerError(null);
    };

    const validate = () => {
        const emailErr = validators.email(email);
        if (emailErr) { setError(emailErr); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const res = await authService.forgotPassword(email);
            toast.success(res.message || 'Password reset code sent successfully');
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            if (err.status === 401 && err.message?.toLowerCase().includes('not confirmed')) {
                setServerError(['Your email is not confirmed. Please confirm your email first.']);
            } else {
                setServerError(parseApiError(err));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-bg-subtle relative overflow-hidden">

            {/* Decorative floating elements */}
            <motion.div
                animate={floatingAnimation}
                className="absolute top-20 left-[15%] h-20 w-20 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />
            <motion.div
                animate={{ y: [0, 8, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute bottom-24 right-[20%] h-16 w-16 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Back link */}
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
                    {/* Gradient border effect */}
                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))]/20 via-transparent to-[rgb(var(--color-primary))]/10 opacity-60" />
                    <div className="bg-surface p-8 sm:p-10 relative rounded-3xl border border-border shadow-sm">
                        <motion.div variants={container} initial="hidden" animate="show">
                            {/* Icon */}
                            <motion.div variants={fadeUp} className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                                <motion.div
                                    initial={{ rotate: -15 }}
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                                >
                                    <KeyRound className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                                </motion.div>
                            </motion.div>

                            <motion.h2 variants={fadeUp} className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                                Forgot your password?
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                                No worries — enter your email address below and we&apos;ll send you a reset code.
                            </motion.p>

                            <motion.div variants={fadeUp}>
                                <AuthErrorAlert errors={serverError}>
                                    {serverError && serverError[0]?.includes('not confirmed') && (
                                        <div className="mt-3 flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/confirm-email', { state: { email } })}
                                                className="text-sm font-semibold text-[rgb(var(--color-primary))] hover:underline flex items-center gap-1"
                                            >
                                                Enter 6-digit confirmation code <ArrowRight size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/resend-confirmation', { state: { email } })}
                                                className="text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors flex items-center gap-1"
                                            >
                                                Resend confirmation email
                                            </button>
                                        </div>
                                    )}
                                </AuthErrorAlert>
                            </motion.div>

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
                                                Send Reset Code <ArrowRight size={18} />
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
