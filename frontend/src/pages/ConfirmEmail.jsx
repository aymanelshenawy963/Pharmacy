import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { confirmEmailSchema } from '../validation/authSchemas';
import { parseApiError } from '../utils/apiErrorHandler';
import { AUTH_ROUTES, authContainerVariants, authFadeUpVariants } from '../constants/auth';
import { AuthFloatingElements, AuthCard, AuthSubmitButton } from '../components/auth';
import Input from '../components/Input';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { CheckCircle, Loader2, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfirmEmail() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState(location.state?.email || '');
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [serverError, setServerError] = useState([]);

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
        if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
        setServerError([]);
    };

    const handleChangeCode = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(raw);
        if (errors.code) setErrors((prev) => ({ ...prev, code: null }));
        setServerError([]);
    };

    const validateForm = () => {
        const result = confirmEmailSchema.safeParse({ email, code });
        if (result.success) {
            setErrors({});
            return true;
        }
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
            const field = issue.path[0];
            if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError([]);
        if (!validateForm()) {
            toast.error('Please fix the errors below');
            return;
        }

        setStatus('loading');
        try {
            await authService.confirmEmailByOtp(email, code);
            setStatus('success');
        } catch (err) {
            setStatus('idle');
            if (err.status === 409) {
                setStatus('success');
            } else {
                const errs = parseApiError(err, 'Invalid or expired code. Please try again.');
                setServerError(errs);
                toast.error(errs.join(', '));
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-bg-subtle relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="bg-surface p-10 text-center rounded-3xl border border-border shadow-sm">
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 180 }}
                            className="mb-6 flex mx-auto h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/25"
                        >
                            <CheckCircle size={40} className="text-green-500" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-3"
                        >
                            Email Confirmed!
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="text-[rgb(var(--color-text-muted))] text-sm mb-8 leading-relaxed"
                        >
                            Your account has been successfully verified. You can now sign in to access all features.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <Link
                                to={AUTH_ROUTES.LOGIN}
                                className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base inline-block"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Sign In Now <ArrowRight size={18} />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                        <motion.div variants={authFadeUpVariants} className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                <ShieldCheck size={36} className="text-[rgb(var(--color-primary))]" />
                            </motion.div>
                        </motion.div>

                        <motion.h2 variants={authFadeUpVariants} className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                            Verify your email
                        </motion.h2>
                        <motion.p variants={authFadeUpVariants} className="text-[rgb(var(--color-text-muted))] text-sm mb-8">
                            Enter the 6-digit code sent to your email address.
                        </motion.p>

                        <motion.div variants={authFadeUpVariants}>
                            <AuthErrorAlert errors={serverError} />
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
                            <motion.div variants={authFadeUpVariants}>
                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleChangeEmail}
                                    error={errors.email}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    autoFocus
                                />
                            </motion.div>

                            <motion.div variants={authFadeUpVariants} className="space-y-2">
                                <label htmlFor="otp-code" className="text-sm font-medium text-[rgb(var(--color-text))]">
                                    6-Digit Code
                                </label>
                                <input
                                    id="otp-code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={code}
                                    onChange={handleChangeCode}
                                    placeholder="------"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    aria-label="6-digit verification code"
                                    aria-describedby={errors.code ? 'otp-code-error' : undefined}
                                    aria-invalid={errors.code ? 'true' : undefined}
                                    className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-3.5 px-4 text-center text-2xl tracking-[0.5em] font-mono text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20 transition-all duration-300 uppercase"
                                />
                                {errors.code && (
                                    <span id="otp-code-error" className="text-xs font-medium text-red-500 animate-slide-down" style={{ animationDuration: '0.2s' }} aria-live="polite">
                                        {errors.code}
                                    </span>
                                )}
                                {code.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-center gap-1.5 mt-2"
                                        aria-hidden="true"
                                    >
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={false}
                                                animate={{
                                                    backgroundColor: i < code.length ? 'rgb(var(--color-primary))' : 'rgb(var(--color-border))',
                                                    scale: i < code.length ? [1, 1.2, 1] : 1,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className="h-1.5 w-6 rounded-full"
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>

                            <motion.div variants={authFadeUpVariants}>
                                <AuthSubmitButton isSubmitting={status === 'loading'} className="!mt-4">
                                    Verify Code <ArrowRight size={18} />
                                </AuthSubmitButton>
                            </motion.div>
                        </form>

                        <motion.div variants={authFadeUpVariants} className="mt-6">
                            <Link
                                to={AUTH_ROUTES.RESEND_CONFIRMATION}
                                state={{ email }}
                                className="text-sm text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                            >
                                Didn&apos;t receive a code? Resend
                            </Link>
                        </motion.div>
                    </motion.div>
                </AuthCard>
            </motion.div>
        </div>
    );
}
