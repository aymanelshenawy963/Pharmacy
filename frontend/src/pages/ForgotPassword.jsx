import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { forgotPasswordSchema } from '../validation/authSchemas';
import { useAuthForm } from '../hooks/useAuthForm';
import { parseApiError } from '../utils/apiErrorHandler';
import { AUTH_ROUTES, authContainerVariants, authFadeUpVariants } from '../constants/auth';
import { AuthFloatingElements, AuthCard, AuthSubmitButton } from '../components/auth';
import Input from '../components/Input';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        formData, errors, isSubmitting, serverError, setServerError,
        handleChange, handleSubmit: baseHandleSubmit,
    } = useAuthForm({
        initialValues: { email: location.state?.email || '' },
        schema: forgotPasswordSchema,
        onSubmit: async (data) => {
            const res = await authService.forgotPassword(data.email);
            toast.success(res.message || 'Password reset code sent successfully');
            navigate(AUTH_ROUTES.RESET_PASSWORD, { state: { email: data.email } });
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        try {
            await baseHandleSubmit(e);
        } catch (err) {
            if (err.status === 401 && err.message?.toLowerCase().includes('not confirmed')) {
                setServerError(['Your email is not confirmed. Please confirm your email first.']);
                toast.error('Your email is not confirmed. Please confirm your email first.');
            } else {
                const errs = parseApiError(err);
                setServerError(errs);
                toast.error(errs.join(', '));
            }
        }
    };

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
                        to={AUTH_ROUTES.LOGIN}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200 mb-8"
                    >
                        <ArrowLeft size={16} /> Back to sign in
                    </Link>
                </motion.div>

                <AuthCard>
                    <motion.div variants={authContainerVariants} initial="hidden" animate="show">
                        <motion.div variants={authFadeUpVariants} className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                            <motion.div
                                initial={{ rotate: -15 }}
                                animate={{ rotate: 0 }}
                                transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                            >
                                <KeyRound className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                            </motion.div>
                        </motion.div>

                        <motion.h2 variants={authFadeUpVariants} className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                            Forgot your password?
                        </motion.h2>
                        <motion.p variants={authFadeUpVariants} className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                            No worries — enter your email address below and we&apos;ll send you a reset code.
                        </motion.p>

                        <motion.div variants={authFadeUpVariants}>
                            <AuthErrorAlert errors={serverError}>
                                {serverError && serverError[0]?.includes('not confirmed') && (
                                    <div className="mt-3 flex flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate(AUTH_ROUTES.CONFIRM_EMAIL, { state: { email: formData.email } })}
                                            className="text-sm font-semibold text-[rgb(var(--color-primary))] hover:underline flex items-center gap-1"
                                        >
                                            Enter 6-digit confirmation code <ArrowRight size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(AUTH_ROUTES.RESEND_CONFIRMATION, { state: { email: formData.email } })}
                                            className="text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors flex items-center gap-1"
                                        >
                                            Resend confirmation email
                                        </button>
                                    </div>
                                )}
                            </AuthErrorAlert>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <motion.div variants={authFadeUpVariants}>
                                <Input
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    placeholder="you@example.com"
                                    autoFocus
                                    autoComplete="email"
                                />
                            </motion.div>
                            <motion.div variants={authFadeUpVariants}>
                                <AuthSubmitButton isSubmitting={isSubmitting}>
                                    Send Reset Code <ArrowRight size={18} />
                                </AuthSubmitButton>
                            </motion.div>
                        </form>
                    </motion.div>
                </AuthCard>
            </motion.div>
        </div>
    );
}
