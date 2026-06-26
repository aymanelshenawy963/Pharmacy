import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { CheckCircle, Loader2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { parseApiError } from '../utils/apiErrorHandler';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { motion } from 'framer-motion';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const floatingAnimation = {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
};

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
            if (err.status === 409) {
                setStatus('success');
            } else {
                setServerError(parseApiError(err, 'Invalid or expired code. Please try again.'));
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi relative overflow-hidden">
                <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="glass-card p-10 text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 180 }}
                            className="mb-6 flex mx-auto h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/25"
                        >
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                            >
                                <CheckCircle size={40} className="text-green-500" />
                            </motion.div>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-3"
                        >
                            Email Confirmed!
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="text-[rgb(var(--color-text-muted))] text-sm mb-8 leading-relaxed"
                        >
                            Your account has been successfully verified. You can now sign in to access all features.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <Link
                                to="/login"
                                className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base inline-block"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Sign In Now <ArrowRight size={18} />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi relative overflow-hidden">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            {/* Decorative floating elements */}
            <motion.div
                animate={floatingAnimation}
                className="absolute top-20 left-[20%] h-16 w-16 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />
            <motion.div
                animate={{ y: [0, 8, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute bottom-24 right-[18%] h-12 w-12 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="relative">
                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))]/20 via-transparent to-[rgb(var(--color-primary))]/10 opacity-60" />
                    <div className="glass-card p-10 text-center relative rounded-3xl">
                        <motion.div variants={container} initial="hidden" animate="show">
                            <motion.div variants={fadeUp} className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
                                >
                                    <ShieldCheck size={36} className="text-[rgb(var(--color-primary))]" />
                                </motion.div>
                            </motion.div>

                            <motion.h2 variants={fadeUp} className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-3">
                                Verify your email
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-[rgb(var(--color-text-muted))] text-sm mb-8">
                                Enter the 6-digit code sent to your email address.
                            </motion.p>

                            {serverError.length > 0 && (
                                <motion.div variants={fadeUp} className="mb-6">
                                    <AuthErrorAlert errors={serverError} />
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                                {/* Email Input */}
                                <motion.div variants={fadeUp} className="space-y-2">
                                    <label className="text-sm font-medium text-[rgb(var(--color-text))] ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] h-5 w-5 transition-colors duration-200 group-focus-within:text-[rgb(var(--color-primary))]" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-3.5 pl-12 pr-4 text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20 transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>

                                {/* OTP Code Input */}
                                <motion.div variants={fadeUp} className="space-y-2">
                                    <label className="text-sm font-medium text-[rgb(var(--color-text))] ml-1">
                                        6-Digit Code
                                    </label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="------"
                                        required
                                        className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] py-3.5 px-4 text-center text-2xl tracking-[0.5em] font-mono text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20 transition-all duration-300 uppercase"
                                    />
                                    {code.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-center gap-1.5 mt-2"
                                        >
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={false}
                                                    animate={{
                                                        backgroundColor: i < code.length ? 'rgb(var(--color-primary))' : 'rgb(var(--color-border))',
                                                        scale: i < code.length ? [1, 1.2, 1] : 1,
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-1.5 w-6 rounded-full"
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <motion.button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="glass-button-primary w-full !rounded-xl !py-4 !mt-8 transition-shadow duration-300 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                                    >
                                        {status === 'loading' ? (
                                            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                                        ) : (
                                            'Verify Code'
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>

                            <motion.div variants={fadeUp} className="mt-6">
                                <Link
                                    to="/resend-confirmation"
                                    state={{ email }}
                                    className="text-sm text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors duration-200"
                                >
                                    Didn&apos;t receive a code? Resend
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
