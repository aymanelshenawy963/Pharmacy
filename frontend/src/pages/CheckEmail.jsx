import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Mailbox, RefreshCw } from 'lucide-react';

export default function CheckEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-md">
                <div className="glass-card p-10 text-center">
                    {/* Icon */}
                    <div className="mb-6 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
                        <Mailbox size={44} className="text-[rgb(var(--color-primary))]" />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                        Check your email
                    </h2>
                    <p className="text-[rgb(var(--color-text-muted))] text-sm mb-2">
                        We&apos;ve sent a 6-digit confirmation code to:
                    </p>
                    <p className="font-semibold text-[rgb(var(--color-text))] text-base mb-8 px-4 py-2 rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] inline-block w-full truncate">
                        {email || 'your email address'}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={() => navigate('/confirm-email', { state: { email } })}
                            className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Enter Verification Code <ArrowRight size={18} />
                            </span>
                        </button>
                        <Link
                            to="/resend-confirmation"
                            state={{ email }}
                            className="glass-button-secondary w-full !rounded-xl !py-3 !text-sm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <RefreshCw size={15} /> Didn&apos;t receive it? Resend
                            </span>
                        </Link>
                    </div>

                    {/* Tip */}
                    <p className="mt-6 text-xs text-[rgb(var(--color-text-muted))] leading-relaxed">
                        <CheckCircle2 size={12} className="inline mr-1 text-green-500" />
                        Check your spam or junk folder if you don&apos;t see it.
                    </p>
                </div>
            </div>
        </div>
    );
}
