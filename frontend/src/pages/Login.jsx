import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../validation/authSchemas';
import { useAuthForm } from '../hooks/useAuthForm';
import { getUserRoles } from '../utils/jwt';
import { parseApiError } from '../utils/apiErrorHandler';
import { AUTH_ROUTES, authContainerVariants, authFadeUpVariants } from '../constants/auth';
import { AuthDecorativePanel, AuthSubmitButton } from '../components/auth';
import Input from '../components/Input';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [needsConfirmation, setNeedsConfirmation] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || AUTH_ROUTES.HOME;

    const {
        formData, errors, isSubmitting, serverError, setServerError,
        handleChange, handleSubmit: baseHandleSubmit,
    } = useAuthForm({
        initialValues: { email: '', password: '' },
        schema: loginSchema,
        onSubmit: async (data) => {
            const result = await login(data.email, data.password);
            if (result.success) {
                toast.success('Welcome back!');
                const roles = getUserRoles(result.data.token);
                if (roles.includes('Admin')) {
                    navigate(AUTH_ROUTES.ADMIN_PRODUCTS, { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                const error = result.error;
                if (error.status === 403) {
                    const msg = error.message?.toLowerCase() || '';
                    if (msg.includes('not confirmed')) {
                        setNeedsConfirmation(true);
                        setServerError(['Your email address has not been confirmed yet.']);
                        toast.error('Please confirm your email address');
                    } else if (msg.includes('disabled')) {
                        setServerError(['This account has been disabled. Please contact support.']);
                        toast.error('This account has been disabled. Please contact support.');
                    } else {
                        const errs = parseApiError(error);
                        setServerError(errs);
                        toast.error(errs.join(', '));
                    }
                } else {
                    const errs = parseApiError(error);
                    setServerError(errs);
                    toast.error(errs.join(', '));
                }
                throw error;
            }
        },
    });

    const handleSubmit = (e) => {
        setNeedsConfirmation(false);
        return baseHandleSubmit(e).catch(() => {});
    };

    return (
        <div className="flex min-h-screen">
            <AuthDecorativePanel
                icon={ShieldCheck}
                title="Your health,"
                highlightText="our priority."
                description="Access prescriptions, track orders, and manage your healthcare from one secure place."
            >
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: '10k+', label: 'Customers' },
                        { value: '500+', label: 'Products' },
                        { value: '24/7', label: 'Support' },
                    ].map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={authFadeUpVariants}
                            whileHover={{ y: -4, scale: 1.05 }}
                            className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm cursor-default"
                        >
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-teal-200 mt-0.5">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </AuthDecorativePanel>

            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
                <motion.div
                    variants={authContainerVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-md"
                >
                    <motion.div variants={authFadeUpVariants} className="mb-8">
                        <h2 className="font-sans text-3xl font-bold text-[rgb(var(--color-text))]">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                            Sign in to continue to your account
                        </p>
                    </motion.div>

                    <motion.div variants={authFadeUpVariants}>
                        <AuthErrorAlert errors={serverError}>
                            {needsConfirmation && (
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
                                autoComplete="email"
                                autoFocus
                            />
                        </motion.div>

                        <motion.div variants={authFadeUpVariants} className="space-y-1">
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            <div className="flex justify-end pt-1">
                                <Link
                                    to={AUTH_ROUTES.FORGOT_PASSWORD}
                                    className="text-sm font-medium text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div variants={authFadeUpVariants}>
                            <AuthSubmitButton isSubmitting={isSubmitting} className="mt-2">
                                Sign In <ArrowRight size={18} />
                            </AuthSubmitButton>
                        </motion.div>
                    </form>

                    <motion.p
                        variants={authFadeUpVariants}
                        className="mt-8 text-center text-sm text-[rgb(var(--color-text-muted))]"
                    >
                        Don&apos;t have an account?{' '}
                        <Link
                            to={AUTH_ROUTES.REGISTER}
                            className="font-semibold text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors duration-200"
                        >
                            Create one now
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}
