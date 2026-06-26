import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { validators, getPasswordStrength } from '../utils/validators';
import Input from '../components/Input';
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';
import { motion } from 'framer-motion';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const floatingAnimation = {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
};

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
        <div className="flex min-h-screen items-center justify-center px-6 py-24 bg-lofi relative overflow-hidden">
            <div className="absolute inset-0 bg-[rgb(var(--color-bg))]/70 backdrop-blur-sm" />

            {/* Decorative floating elements */}
            <motion.div
                animate={floatingAnimation}
                className="absolute top-24 right-[18%] h-18 w-18 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />
            <motion.div
                animate={{ y: [0, 8, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
                className="absolute bottom-20 left-[15%] h-14 w-14 rounded-full bg-[rgb(var(--color-primary))]/5 blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-md"
            >
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors duration-200 mb-8"
                    >
                        <ArrowLeft size={16} /> Back
                    </Link>
                </motion.div>

                <div className="relative">
                    {/* Gradient border effect */}
                    <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[rgb(var(--color-primary))]/20 via-transparent to-[rgb(var(--color-primary))]/10 opacity-60" />
                    <div className="glass-card p-8 sm:p-10 relative rounded-3xl">
                        <motion.div variants={container} initial="hidden" animate="show">
                            {/* Icon */}
                            <motion.div variants={fadeUp} className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                                <motion.div
                                    initial={{ rotate: -15 }}
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                                >
                                    <LockKeyhole className="h-7 w-7 text-[rgb(var(--color-primary))]" />
                                </motion.div>
                            </motion.div>

                            <motion.h2 variants={fadeUp} className="font-serif text-2xl font-bold text-[rgb(var(--color-text))] mb-2">
                                Reset your password
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-sm text-[rgb(var(--color-text-muted))] mb-8 leading-relaxed">
                                Enter the reset code from your email along with your new password.
                            </motion.p>

                            <motion.div variants={fadeUp}>
                                <AuthErrorAlert errors={serverError} />
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                <motion.div variants={fadeUp}>
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
                                        autoFocus={!location.state?.email}
                                        autoComplete="email"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Input
                                        label="Reset code"
                                        name="code"
                                        value={formData.code}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setFormData((prev) => ({ ...prev, code: raw }));
                                            if (errors.code) setErrors((prev) => ({ ...prev, code: null }));
                                            setServerError(null);
                                        }}
                                        error={errors.code}
                                        placeholder="Enter the 6-digit code from your email"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        autoComplete="one-time-code"
                                        autoFocus={!!location.state?.email}
                                    />
                                </motion.div>

                                {/* New password + strength */}
                                <motion.div variants={fadeUp} className="space-y-2">
                                    <Input
                                        label="New password"
                                        name="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        error={errors.newPassword}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                    <motion.div
                                        initial={false}
                                        animate={{ height: formData.newPassword ? 'auto' : 0, opacity: formData.newPassword ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[rgb(var(--color-border))]">
                                            <motion.div
                                                className="h-full rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(pwStrength.score / 4) * 100}%` }}
                                                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                style={{ backgroundColor: pwStrength.color }}
                                            />
                                        </div>
                                        <motion.p
                                            key={pwStrength.label}
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="text-xs font-medium mt-1"
                                            style={{ color: pwStrength.color }}
                                        >
                                            Strength: {pwStrength.label}
                                        </motion.p>
                                        <div className="grid grid-cols-2 gap-1.5 pt-2">
                                            {pwRules.map((rule) => (
                                                <motion.div
                                                    key={rule.label}
                                                    initial={false}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-1.5 text-xs"
                                                >
                                                    <motion.div
                                                        initial={false}
                                                        animate={rule.met ? { scale: [1, 1.3, 1] } : {}}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {rule.met
                                                            ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                                                            : <div className="w-3 h-3 rounded-full border border-[rgb(var(--color-border))] shrink-0" />}
                                                    </motion.div>
                                                    <span className={`transition-colors duration-200 ${rule.met ? 'text-green-600 dark:text-green-400' : 'text-[rgb(var(--color-text-muted))]'}`}>
                                                        {rule.label}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <Input
                                        label="Confirm new password"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        error={errors.confirmPassword}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp}>
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="glass-button-primary w-full !rounded-xl !py-3.5 !text-base mt-2 transition-shadow duration-300 hover:shadow-lg hover:shadow-[rgb(var(--color-primary))]/20"
                                    >
                                        {isSubmitting ? (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        ) : (
                                            <span className="flex items-center gap-2 justify-center">
                                                Reset Password <ArrowRight size={18} />
                                            </span>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
