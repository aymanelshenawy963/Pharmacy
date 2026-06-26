import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { validators } from '../utils/validators';
import Input from '../components/Input';
import { AlertCircle, ArrowLeft, ArrowRight, Mail, MailCheck } from 'lucide-react';
import { parseApiError } from '../utils/apiErrorHandler';
import AuthErrorAlert from '../components/AuthErrorAlert';

export default function ResendConfirmationEmail() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [serverError, setServerError] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(null);
        setServerError([]);
    };

    const validate = () => {
        const emailErr = validators.email(email);
        if (emailErr) { setError(emailErr); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError([]);
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const msg = await authService.resendConfirmationEmail(email);
            setIsSuccess(true);
            setSuccessMessage(msg || 'Confirmation email sent. Please check your inbox.');
        } catch (err) {
            if (err.status === 409) {
                setIsSuccess(true);
                setSuccessMessage('This email is already confirmed. You can proceed to sign in.');
            } else {
                setServerError(parseApiError(err, 'Failed to resend confirmation email. Please try again.'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Success state ── */
    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi">
                <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />
                <div className="relative z-10 w-full max-w-md">
                    <div className="glass-card p-10 text-center">
                        <div className="mb-6 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/25">
                            <MailCheck size={40} className="text-[rgb(var(--color-primary))]" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                            Email sent!
                        </h2>
                        <p className="text-[rgb(var(--color-text-muted))] text-sm mb-8 leading-relaxed">
                            {successMessage}
                        </p>
                        <Link
                            to="/login"
                            className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Return to Sign In <ArrowRight size={18} />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Form state ── */
    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-md">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> Back to sign in
                </Link>

                <div className="glass-card p-8 sm:p-10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                        <Mail className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                        Resend confirmation
                    </h2>
                    <p className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                        Didn&apos;t receive the confirmation email? Enter your address and we&apos;ll resend it.
                    </p>

                    {serverError.length > 0 && (
                        <div className="mb-6">
                            <AuthErrorAlert errors={serverError} />
                        </div>
                    )}

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
                                    Resend Email <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
