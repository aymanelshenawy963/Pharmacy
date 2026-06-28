import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { validators, getPasswordStrength } from '../utils/validators';
import Input from '../components/Input';
import { ArrowRight, CheckCircle2, UserPlus } from 'lucide-react';
import AuthErrorAlert from '../components/AuthErrorAlert';
import { parseApiError } from '../utils/apiErrorHandler';
import { motion } from 'framer-motion';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
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
                <motion.div
                    animate={floatingAnimation}
                    className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5"
                />
                <motion.div
                    animate={floatingAnimation2}
                    className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5"
                />
                <motion.div
                    animate={{ y: [0, -8, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute top-24 right-16 h-3 w-3 rounded-full bg-teal-300/40"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                    className="absolute bottom-40 left-12 h-14 w-14 rounded-full border border-white/10"
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
                            <UserPlus className="h-10 w-10 text-white" />
                        </motion.div>
                    </div>
                    <h1 className="font-sans text-4xl font-bold mb-4 leading-tight text-white">
                        Join thousands of{' '}
                        <span className="bg-gradient-to-r from-teal-200 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                            healthy customers.
                        </span>
                    </h1>
                    <p className="text-teal-100/80 text-lg leading-relaxed">
                        Create your free account to shop prescriptions, track orders, and more.
                    </p>

                    <motion.ul
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="mt-10 space-y-3 text-left"
                    >
                        {[
                            'Free same-day delivery on orders over $50',
                            'Automatic prescription refill reminders',
                            'Personalized health recommendations',
                            'Secure, encrypted health data storage',
                        ].map((benefit) => (
                            <motion.li
                                key={benefit}
                                variants={fadeUp}
                                className="flex items-start gap-3 text-sm text-teal-100/90"
                            >
                                <CheckCircle2 className="shrink-0 mt-0.5 text-teal-300" size={16} />
                                {benefit}
                            </motion.li>
                        ))}
                    </motion.ul>
                </motion.div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 overflow-y-auto">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-lg"
                >
                    <motion.div variants={fadeUp} className="mb-8">
                        <h2 className="font-sans text-3xl font-bold text-[rgb(var(--color-text))]">
                            Create your account
                        </h2>
                        <p className="mt-2 text-[rgb(var(--color-text-muted))]">
                            It only takes a minute to get started
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <AuthErrorAlert errors={serverError} />
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="First name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="John" autoFocus autoComplete="given-name" />
                            <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Doe" autoComplete="family-name" />
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <Input label="Username" name="userName" value={formData.userName} onChange={handleChange} error={errors.userName} placeholder="johndoe123" autoComplete="username" />
                        </motion.div>
                        <motion.div variants={fadeUp}>
                            <Input label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" autoComplete="email" />
                        </motion.div>

                        {/* Password + strength */}
                        <motion.div variants={fadeUp} className="space-y-2">
                            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="••••••••" autoComplete="new-password" />

                            <motion.div
                                initial={false}
                                animate={{ height: formData.password ? 'auto' : 0, opacity: formData.password ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                {/* Strength bar */}
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
                                {/* Rules checklist */}
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
                            <Input label="Confirm password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" autoComplete="new-password" />
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
                                        Create Account <ArrowRight size={18} />
                                    </span>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.p
                        variants={fadeUp}
                        className="mt-6 text-center text-sm text-[rgb(var(--color-text-muted))]"
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-dark))] transition-colors duration-200">
                            Sign in
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}
