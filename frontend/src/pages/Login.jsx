import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { validators } from '../utils/validators';
import Input from '../components/Input';
import { AlertCircle, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';
import { getUserRoles } from '../utils/jwt';
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
                {/* Decorative circles */}
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/[0.03]" />

                <div className="relative z-10 max-w-sm text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="font-serif text-4xl font-bold mb-4 leading-tight text-white">
                        Your health, <span className="text-teal-300">our priority.</span>
                    </h1>
                    <p className="text-teal-100/80 text-lg leading-relaxed">
                        Access prescriptions, track orders, and manage your healthcare from one secure place.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-4">
                        {[
                            { value: '10k+', label: 'Customers' },
                            { value: '500+', label: 'Products' },
                            { value: '24/7', label: 'Support' },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-teal-200 mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="font-serif text-3xl font-bold text-[rgb(var(--color-text))]">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                            Sign in to continue to your account
                        </p>
                    </div>

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

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />

                        <div className="space-y-1">
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
                                    className="text-sm font-medium text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="glass-button-primary w-full mt-2 !rounded-xl !py-3.5 !text-base"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-[rgb(var(--color-text-muted))]">
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors"
                        >
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
