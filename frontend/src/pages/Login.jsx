import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { validators } from '../utils/validators';
import Input from '../components/Input';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';
import { getUserRoles } from '../utils/jwt';
import { motion } from 'framer-motion';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const scaleFade = {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const floatingAnimation = {
    y: [0, -12, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
};

const floatingAnimation2 = {
    y: [0, 10, 0],
    x: [0, -8, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
};

const floatingAnimation3 = {
    y: [0, -6, 0],
    x: [0, 6, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 },
};

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [needsConfirmation, setNeedsConfirmation] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        setServerError(null);
    };

    const validateForm = () => {
        const newErrors = {
            email: validators.email(formData.email),
            password: validators.required(formData.password, 'Password'),
        };
        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        setNeedsConfirmation(false);
        if (!validateForm()) return;

        setIsSubmitting(true);
        const result = await login(formData.email, formData.password);
        setIsSubmitting(false);

        if (result.success) {
            toast.success('Welcome back!');
            const roles = getUserRoles(result.data.token);
            if (roles.includes('Admin')) {
                navigate('/admin/products', { replace: true });
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
                } else if (msg.includes('disabled')) {
                    setServerError(['This account has been disabled. Please contact support.']);
                } else {
                    setServerError(parseApiError(error));
                }
            } else {
                if (error.status === 400 && error.validationErrors) {
                    const apiErrors = {};
                    Object.keys(error.validationErrors).forEach((key) => {
                        const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                        apiErrors[fieldName] = error.validationErrors[key][0];
                    });
                    setErrors((prev) => ({ ...prev, ...apiErrors }));
                }
                setServerError(parseApiError(error));
            }
        }
    };

    return (
        <div className="flex min-h-screen pt-16">
            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 flex-col items-center justify-center p-12 text-white">
                {/* Animated decorative circles */}
                <motion.div
                    animate={floatingAnimation}
                    className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5"
                />
                <motion.div
                    animate={floatingAnimation2}
                    className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5"
                />
                <motion.div
                    animate={floatingAnimation3}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/[0.03]"
                />
                {/* Additional floating orbs */}
                <motion.div
                    animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute top-20 right-20 h-3 w-3 rounded-full bg-teal-300/40"
                />
                <motion.div
                    animate={{ y: [0, 12, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                    className="absolute bottom-32 left-16 h-2 w-2 rounded-full bg-white/30"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                    className="absolute top-1/3 left-8 h-16 w-16 rounded-full border border-white/10"
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 max-w-sm text-center"
                >
                    <div className="mb-8 flex justify-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200 }}
                            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
                        >
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </motion.div>
                    </div>
                    <h1 className="font-sans text-4xl font-bold mb-4 leading-tight text-white">
                        Your health,{' '}
                        <span className="bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                            our priority.
                        </span>
                    </h1>
                    <p className="text-teal-100/80 text-lg leading-relaxed">
                        Access prescriptions, track orders, and manage your healthcare from one secure place.
                    </p>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="mt-12 grid grid-cols-3 gap-4"
                    >
                        {[
                            { value: '10k+', label: 'Customers' },
                            { value: '500+', label: 'Products' },
                            { value: '24/7', label: 'Support' },
                        ].map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={scaleFade}
                                whileHover={{ y: -4, scale: 1.05 }}
                                className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm cursor-default"
                            >
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-teal-200 mt-0.5">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-md"
                >
                    <motion.div variants={fadeUp} className="mb-8">
                        <h2 className="font-sans text-3xl font-bold text-[rgb(var(--color-text))]">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                            Sign in to continue to your account
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <AuthErrorAlert errors={serverError}>
                            {needsConfirmation && (
                                <div className="mt-3 flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/confirm-email', { state: { email: formData.email } })}
                                        className="text-sm font-semibold text-[rgb(var(--color-primary))] hover:underline flex items-center gap-1"
                                    >
                                        Enter 6-digit confirmation code <ArrowRight size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/resend-confirmation', { state: { email: formData.email } })}
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
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="you@example.com"
                                autoComplete="email"
                                autoFocus
                            />
                        </motion.div>

                        <motion.div variants={fadeUp} className="space-y-1">
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
                                    to="/forgot-password"
                                    className="text-sm font-medium text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.01, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="glass-button-primary w-full mt-2 !rounded-xl !py-3.5 !text-base transition-shadow duration-300 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                            >
                                {isSubmitting ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                    <span className="flex items-center gap-2 justify-center">
                                        Sign In <ArrowRight size={18} />
                                    </span>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.p
                        variants={fadeUp}
                        className="mt-8 text-center text-sm text-[rgb(var(--color-text-muted))]"
                    >
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/register"
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
