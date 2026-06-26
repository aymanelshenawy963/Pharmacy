import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { CheckCircle, XCircle, Loader2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { parseApiError } from '../utils/apiErrorHandler';
import AuthErrorAlert from '../components/AuthErrorAlert';
export default function ConfirmEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || '');
    const [code, setCode] = useState('');

    const [status, setStatus] = useState('idle'); // idle | loading | success
    const [serverError, setServerError] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !code) {
            setServerError(['Please enter both your email and the 6-digit code.']);
            return;
        }

        setStatus('loading');
        setServerError([]);

        try {
            await authService.confirmEmailByOtp(email, code);
            setStatus('success');
        } catch (err) {
            setStatus('idle');
            // 409 = already confirmed — treat as soft success
            if (err.status === 409) {
                setStatus('success');
            } else {
                setServerError(parseApiError(err, 'Invalid or expired code. Please try again.'));
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi">
                <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="glass-card p-10 text-center">
                        <div className="mb-6 flex mx-auto h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/25">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                            Email Confirmed!
                        </h2>
                        <p className="text-[rgb(var(--color-text-muted))] text-sm mb-8 leading-relaxed">
                            Your account has been successfully verified. You can now sign in to access all features.
                        </p>
                        <Link
                            to="/login"
                            className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Sign In Now <ArrowRight size={18} />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-card p-10 text-center">
                    <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
                        <ShieldCheck size={36} className="text-[rgb(var(--color-primary))]" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                        Verify your email
                    </h2>
                    <p className="text-[rgb(var(--color-text-muted))] text-sm mb-8">
                        Enter the 6-digit code sent to your email address.
                    </p>

                    {serverError.length > 0 && (
                        <div className="mb-6">
                            <AuthErrorAlert errors={serverError} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[rgb(var(--color-text))] ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] h-5 w-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-3.5 pl-12 pr-4 text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all"
                                />
                            </div>
                        </div>

                        {/* OTP Code Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[rgb(var(--color-text))] ml-1">
                                6-Digit Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="------"
                                required
                                className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-3.5 px-4 text-center text-2xl tracking-[0.5em] font-mono text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))] transition-all uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="glass-button-primary w-full !rounded-xl !py-4 !mt-8"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                            ) : (
                                'Verify Code'
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <Link
                            to="/resend-confirmation"
                            state={{ email }}
                            className="text-sm text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                        >
                            Didn&apos;t receive a code? Resend
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
