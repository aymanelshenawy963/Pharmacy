import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { resetPasswordSchema } from '../validation/authSchemas';
import { useAuthForm } from '../hooks/useAuthForm';
import { parseApiError } from '../utils/apiErrorHandler';
import { AUTH_ROUTES, authContainerVariants, authFadeUpVariants } from '../constants/auth';
import { AuthFloatingElements, AuthCard, PasswordStrengthMeter, AuthSubmitButton } from '../components/auth';
import Input from '../components/Input';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        formData, setFormData, errors, isSubmitting, serverError, setServerError, setErrors,
        handleChange, handleSubmit: baseHandleSubmit,
    } = useAuthForm({
        initialValues: {
            email: location.state?.email || '',
            code: '',
            newPassword: '',
            confirmPassword: '',
        },
        schema: resetPasswordSchema,
        onSubmit: async (data) => {
            await authService.resetPassword({
                email: data.email,
                code: data.code,
                newPassword: data.newPassword,
            });
            toast.success('Password reset successfully!');
            navigate(AUTH_ROUTES.LOGIN);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        try {
            await baseHandleSubmit(e);
        } catch (err) {
            const errs = parseApiError(err);
            setServerError(errs);
            toast.error(errs.join(', '));
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
                        to={AUTH_ROUTES.FORGOT_PASSWORD}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200 mb-8"
                    >
                        <ArrowLeft size={16} /> Back
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
                                <LockKeyhole className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                            </motion.div>
                        </motion.div>

                        <motion.h2 variants={authFadeUpVariants} className="font-sans text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                            Reset your password
                        </motion.h2>
                        <motion.p variants={authFadeUpVariants} className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                            Enter the reset code from your email along with your new password.
                        </motion.p>

                        <motion.div variants={authFadeUpVariants}>
                            <AuthErrorAlert errors={serverError} />
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <motion.div variants={authFadeUpVariants}>
                                <Input
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    placeholder="you@example.com"
                                    readOnly={!!location.state?.email}
                                    className={location.state?.email ? 'opacity-60 cursor-not-allowed' : ''}
                                    autoFocus={!location.state?.email}
                                    autoComplete="email"
                                />
                            </motion.div>

                            <motion.div variants={authFadeUpVariants}>
                                <Input
                                    label="Reset code"
                                    name="code"
                                    value={formData.code}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setFormData((prev) => ({ ...prev, code: raw }));
                                        if (errors.code) setErrors((prev) => ({ ...prev, code: null }));
                                        setServerError(null);
                                    }}
                                    error={errors.code}
                                    placeholder="Enter the 6-digit code from your email"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    autoFocus={!!location.state?.email}
                                />
                            </motion.div>

                            <motion.div variants={authFadeUpVariants} className="space-y-2">
                                <Input
                                    label="New password"
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    error={errors.newPassword}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                                <PasswordStrengthMeter password={formData.newPassword} />
                            </motion.div>

                            <motion.div variants={authFadeUpVariants}>
                                <Input
                                    label="Confirm new password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={errors.confirmPassword}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                />
                            </motion.div>

                            <motion.div variants={authFadeUpVariants}>
                                <AuthSubmitButton isSubmitting={isSubmitting} className="mt-2">
                                    Reset Password <ArrowRight size={18} />
                                </AuthSubmitButton>
                            </motion.div>
                        </form>
                    </motion.div>
                </AuthCard>
            </motion.div>
        </div>
    );
}
