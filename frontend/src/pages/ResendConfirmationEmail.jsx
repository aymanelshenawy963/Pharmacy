import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { resendConfirmationSchema } from '../validation/authSchemas';
import { useAuthForm } from '../hooks/useAuthForm';
import { parseApiError } from '../utils/apiErrorHandler';
import { AUTH_ROUTES, authContainerVariants, authFadeUpVariants } from '../constants/auth';
import { AuthFloatingElements, AuthCard, AuthSubmitButton } from '../components/auth';
import Input from '../components/Input';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { ArrowLeft, ArrowRight, Mail, MailCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResendConfirmationEmail() {
    const location = useLocation();

    const {
        formData, errors, isSubmitting, serverError, setServerError,
        handleChange, handleSubmit: baseHandleSubmit,
    } = useAuthForm({
        initialValues: { email: location.state?.email || '' },
        schema: resendConfirmationSchema,
        onSubmit: async (data) => {
            const msg = await authService.resendConfirmationEmail(data.email);
            return { success: true, message: msg || 'Confirmation email sent. Please check your inbox.' };
        },
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        try {
            const result = await baseHandleSubmit(e);
            if (result?.success) {
                setIsSuccess(true);
                setSuccessMessage(result.message);
            }
        } catch (err) {
            if (err.status === 409) {
                setIsSuccess(true);
                setSuccessMessage('This email is already confirmed. You can proceed to sign in.');
            } else {
                const errs = parseApiError(err, 'Failed to resend confirmation email. Please try again.');
                setServerError(errs);
                toast.error(errs.join(', '));
            }
        }
    };

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
                                to={AUTH_ROUTES.LOGIN}
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
                                <Mail className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                            </motion.div>
                        </motion.div>

                        <motion.h2 variants={authFadeUpVariants} className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                            Resend confirmation
                        </motion.h2>
                        <motion.p variants={authFadeUpVariants} className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                            Didn&apos;t receive the confirmation email? Enter your address and we&apos;ll resend it.
                        </motion.p>

                        {serverError && serverError.length > 0 && (
                            <motion.div variants={authFadeUpVariants} className="mb-6">
                                <AuthErrorAlert errors={serverError} />
                            </motion.div>
                        )}

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
                                    Resend Email <ArrowRight size={18} />
                                </AuthSubmitButton>
                            </motion.div>
                        </form>
                    </motion.div>
                </AuthCard>
            </motion.div>
        </div>
    );
}
