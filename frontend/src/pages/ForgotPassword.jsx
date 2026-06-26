import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { validators } from '../utils/validators';
import Input from '../components/Input';
import { AlertCircle, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(null);
        setServerError(null);
    };

    const validate = () => {
        const emailErr = validators.email(email);
        if (emailErr) { setError(emailErr); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const res = await authService.forgotPassword(email);
            toast.success(res.message || 'Password reset code sent successfully');
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            if (err.status === 401 && err.message?.toLowerCase().includes('not confirmed')) {
                setServerError(['Your email is not confirmed. Please confirm your email first.']);
            } else {
                setServerError(parseApiError(err));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-md">
                {/* Back link */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> Back to sign in
                </Link>

                <div className="glass-card p-8 sm:p-10">
                    {/* Icon */}
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                        <KeyRound className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                        Forgot your password?
                    </h2>
                    <p className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                        No worries — enter your email address below and we&apos;ll send you a reset code.
                    </p>

                    <AuthErrorAlert errors={serverError}>
                        {serverError && serverError[0]?.includes('not confirmed') && (
                            <div className="mt-3 flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/confirm-email', { state: { email } })}
                                    className="text-sm font-semibold text-[rgb(var(--color-primary))] hover:underline flex items-center gap-1"
                                >
                                    Enter 6-digit confirmation code <ArrowRight size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/resend-confirmation', { state: { email } })}
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
                            value={email}
                            onChange={handleChange}
                            error={error}
                            placeholder="you@example.com"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Send Reset Code <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
