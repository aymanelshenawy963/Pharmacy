import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { validators, getPasswordStrength } from '../utils/validators';
import Input from '../components/Input';
import { AlertCircle, ArrowRight, CheckCircle2, UserPlus } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';
export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === 'password' && errors.confirmPassword)
            setErrors((prev) => ({ ...prev, confirmPassword: null }));
        setServerError(null);
    };

    const validateForm = () => {
        const newErrors = {
            firstName: validators.firstName(formData.firstName),
            lastName: validators.lastName(formData.lastName),
            userName: validators.userName(formData.userName),
            email: validators.email(formData.email),
            password: validators.password(formData.password),
            confirmPassword: validators.confirmPassword(formData.confirmPassword, formData.password),
        };
        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await authService.register({
                email: formData.email,
                userName: formData.userName,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });
            toast.success('Account created! Please verify your email.');
            navigate('/check-email', { state: { email: formData.email } });
        } catch (error) {
            if (error.status === 409) {
                const msg = error.message?.toLowerCase() || '';
                if (msg.includes('email')) setErrors((prev) => ({ ...prev, email: error.message }));
                else if (msg.includes('username')) setErrors((prev) => ({ ...prev, userName: error.message }));
                else setServerError(parseApiError(error));
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const pwStrength = getPasswordStrength(formData.password);

    const pwRules = [
        { label: 'At least 8 characters', met: formData.password.length >= 8 },
        { label: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
        { label: 'Lowercase letter', met: /[a-z]/.test(formData.password) },
        { label: 'Number', met: /\d/.test(formData.password) },
        { label: 'Special character', met: /[^a-zA-Z\d]/.test(formData.password) },
    ];

    return (
        <div className="flex min-h-screen pt-16">
            {/* ── Left decorative panel ── */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 flex-col items-center justify-center p-12 text-white">
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5" />

                <div className="relative z-10 max-w-sm text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                            <UserPlus className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="font-serif text-4xl font-bold mb-4 leading-tight text-white">
                        Join thousands of <span className="text-teal-300">healthy customers.</span>
                    </h1>
                    <p className="text-teal-100/80 text-lg leading-relaxed">
                        Create your free account to shop prescriptions, track orders, and more.
                    </p>

                    <ul className="mt-10 space-y-3 text-left">
                        {[
                            'Free same-day delivery on orders over $50',
                            'Automatic prescription refill reminders',
                            'Personalized health recommendations',
                            'Secure, encrypted health data storage',
                        ].map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3 text-sm text-teal-100/90">
                                <CheckCircle2 className="shrink-0 mt-0.5 text-teal-300" size={16} />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 overflow-y-auto">
                <div className="w-full max-w-lg">
                    <div className="mb-8">
                        <h2 className="font-serif text-3xl font-bold text-[rgb(var(--color-text))]">
                            Create your account
                        </h2>
                        <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                            It only takes a minute to get started
                        </p>
                    </div>

                    <AuthErrorAlert errors={serverError} />

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="First name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="John" />
                            <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" />
                        </div>

                        <Input label="Username" name="userName" value={formData.userName} onChange={handleChange} error={errors.userName} placeholder="johndoe123" />
                        <Input label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />

                        {/* Password + strength */}
                        <div className="space-y-2">
                            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" />

                            {formData.password && (
                                <>
                                    {/* Strength bar */}
                                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{ width: `${(pwStrength.score / 4) * 100}%`, backgroundColor: pwStrength.color }}
                                        />
                                    </div>
                                    <p className="text-xs font-medium" style={{ color: pwStrength.color }}>
                                        Strength: {pwStrength.label}
                                    </p>
                                    {/* Rules checklist */}
                                    <div className="grid grid-cols-2 gap-1 pt-1">
                                        {pwRules.map((rule) => (
                                            <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                                                {rule.met
                                                    ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                                                    : <div className="w-3 h-3 rounded-full border border-[rgb(var(--color-border))] shrink-0" />}
                                                <span className={rule.met ? 'text-green-600 dark:text-green-400' : 'text-[rgb(var(--color-text-muted))]'}>
                                                    {rule.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <Input label="Confirm password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base mt-2"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create Account <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-[rgb(var(--color-text-muted))]">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
