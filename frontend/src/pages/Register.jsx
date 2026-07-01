import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { registerSchema } from '../validation/authSchemas';
import { useAuthForm } from '../hooks/useAuthForm';
import { parseApiError } from '../utils/apiErrorHandler';
import { AUTH_ROUTES, authContainerVariants, authFadeUpVariants } from '../constants/auth';
import { AuthDecorativePanel, PasswordStrengthMeter, AuthSubmitButton } from '../components/auth';
import Input from '../components/Input';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { ArrowRight, CheckCircle2, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const navigate = useNavigate();

    const {
        formData, errors, isSubmitting, serverError, setServerError, setErrors,
        handleChange, handleSubmit: baseHandleSubmit,
    } = useAuthForm({
        initialValues: {
            firstName: '', lastName: '', userName: '',
            email: '', password: '', confirmPassword: '',
        },
        schema: registerSchema,
        onSubmit: async (data) => {
            try {
                await authService.register({
                    email: data.email,
                    userName: data.userName,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                });
                toast.success('Account created! Please verify your email.');
                navigate(AUTH_ROUTES.CHECK_EMAIL, { state: { email: data.email } });
            } catch (error) {
                if (error.status === 409) {
                    const msg = error.message?.toLowerCase() || '';
                    if (msg.includes('email')) {
                        setErrors((prev) => ({ ...prev, email: error.message }));
                        toast.error(error.message);
                    } else if (msg.includes('username')) {
                        setErrors((prev) => ({ ...prev, userName: error.message }));
                        toast.error(error.message);
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

    return (
        <div className="flex min-h-screen">
            <AuthDecorativePanel
                icon={UserPlus}
                title="Join thousands of"
                highlightText="healthy customers."
                description="Create your free account to shop prescriptions, track orders, and more."
            >
                <motion.ul
                    variants={authContainerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-3 text-left"
                >
                    {[
                        'Free same-day delivery on orders over $50',
                        'Automatic prescription refill reminders',
                        'Personalized health recommendations',
                        'Secure, encrypted health data storage',
                    ].map((benefit) => (
                        <motion.li
                            key={benefit}
                            variants={authFadeUpVariants}
                            className="flex items-start gap-3 text-sm text-teal-100/90"
                        >
                            <CheckCircle2 className="shrink-0 mt-0.5 text-teal-300" size={16} />
                            {benefit}
                        </motion.li>
                    ))}
                </motion.ul>
            </AuthDecorativePanel>

            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 overflow-y-auto">
                <motion.div
                    variants={authContainerVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-lg"
                >
                    <motion.div variants={authFadeUpVariants} className="mb-8">
                        <h2 className="font-sans text-3xl font-bold text-[rgb(var(--color-text))]">
                            Create your account
                        </h2>
                        <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                            It only takes a minute to get started
                        </p>
                    </motion.div>

                    <motion.div variants={authFadeUpVariants}>
                        <AuthErrorAlert errors={serverError} />
                    </motion.div>

                    <form onSubmit={(e) => baseHandleSubmit(e).catch(() => {})} className="space-y-4" noValidate>
                        <motion.div variants={authFadeUpVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="First name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="John" autoFocus autoComplete="given-name" />
                            <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" autoComplete="family-name" />
                        </motion.div>

                        <motion.div variants={authFadeUpVariants}>
                            <Input label="Username" name="userName" value={formData.userName} onChange={handleChange} error={errors.userName} placeholder="johndoe123" autoComplete="username" />
                        </motion.div>
                        <motion.div variants={authFadeUpVariants}>
                            <Input label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" autoComplete="email" />
                        </motion.div>

                        <motion.div variants={authFadeUpVariants} className="space-y-2">
                            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" autoComplete="new-password" />
                            <PasswordStrengthMeter password={formData.password} />
                        </motion.div>

                        <motion.div variants={authFadeUpVariants}>
                            <Input label="Confirm password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" autoComplete="new-password" />
                        </motion.div>

                        <motion.div variants={authFadeUpVariants}>
                            <AuthSubmitButton isSubmitting={isSubmitting} className="mt-2">
                                Create Account <ArrowRight size={18} />
                            </AuthSubmitButton>
                        </motion.div>
                    </form>

                    <motion.p
                        variants={authFadeUpVariants}
                        className="mt-6 text-center text-sm text-[rgb(var(--color-text-muted))]"
                    >
                        Already have an account?{' '}
                        <Link to={AUTH_ROUTES.LOGIN} className="font-semibold text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors duration-200">
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}
