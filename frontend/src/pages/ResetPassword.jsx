import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { validators, getPasswordStrength } from '../utils/validators';
import Input from '../components/Input';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        code: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === 'newPassword' && errors.confirmPassword)
            setErrors((prev) => ({ ...prev, confirmPassword: null }));
        setServerError(null);
    };

    const validateForm = () => {
        const newErrors = {
            email: validators.email(formData.email),
            code: validators.required(formData.code, 'Reset code'),
            newPassword: validators.password(formData.newPassword),
            confirmPassword: validators.confirmPassword(formData.confirmPassword, formData.newPassword),
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
            await authService.resetPassword({
                email: formData.email,
                code: formData.code,
                newPassword: formData.newPassword,
            });
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (err) {
            if (err.status === 400 && err.validationErrors) {
                const apiErrors = {};
                Object.keys(err.validationErrors).forEach((key) => {
                    const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                    apiErrors[fieldName] = err.validationErrors[key][0];
                });
                setErrors((prev) => ({ ...prev, ...apiErrors }));
            }
            setServerError(parseApiError(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const pwStrength = getPasswordStrength(formData.newPassword);

    const pwRules = [
        { label: 'At least 8 characters', met: formData.newPassword.length >= 8 },
        { label: 'Uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
        { label: 'Lowercase letter', met: /[a-z]/.test(formData.newPassword) },
        { label: 'Number', met: /\d/.test(formData.newPassword) },
        { label: 'Special character', met: /[^a-zA-Z\d]/.test(formData.newPassword) },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-md">
                <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> Back
                </Link>

                <div className="glass-card p-8 sm:p-10">
                    {/* Icon */}
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                        <LockKeyhole className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                        Reset your password
                    </h2>
                    <p className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                        Enter the reset code from your email along with your new password.
                    </p>

                    <AuthErrorAlert errors={serverError} />

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                        />

                        <Input
                            label="Reset code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            error={errors.code}
                            placeholder="Enter the 6-digit code from your email"
                        />

                        {/* New password + strength */}
                        <div className="space-y-2">
                            <Input
                                label="New password"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                error={errors.newPassword}
                                placeholder="••••••••"
                            />
                            {formData.newPassword && (
                                <>
                                    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{ width: `${(pwStrength.score / 4) * 100}%`, backgroundColor: pwStrength.color }}
                                        />
                                    </div>
                                    <p className="text-xs font-medium" style={{ color: pwStrength.color }}>
                                        Strength: {pwStrength.label}
                                    </p>
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

                        <Input
                            label="Confirm new password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="••••••••"
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base mt-2"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Reset Password <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
