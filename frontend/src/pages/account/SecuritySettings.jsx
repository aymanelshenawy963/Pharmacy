import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Lock, Save, Loader2, Shield, Check, X } from 'lucide-react';
import { profileService } from '../../services/profileService';
import PageHeader from '../../components/admin/PageHeader';
import FormField from '../../components/admin/FormField';
import ErrorBanner from '../../components/admin/ErrorBanner';
import { validators } from '../../utils/validators';
import { parseApiError } from '../../utils/apiErrorHandler';

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

function PasswordRequirement({ label, met }) {
    return (
        <div className={`flex items-center gap-2 text-xs transition-all duration-200 ${met ? 'text-emerald-500' : 'text-[rgb(var(--color-text-muted))]'}`}>
            {met ? (
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check size={10} className="text-emerald-500" />
                </span>
            ) : (
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-bg-subtle))]">
                    <X size={10} className="text-[rgb(var(--color-text-muted))]" />
                </span>
            )}
            <span>{label}</span>
        </div>
    );
}

export default function SecuritySettings() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        setServerError(null);
    };

    const validate = () => {
        const newErrors = {
            currentPassword: validators.required(formData.currentPassword, 'Current password'),
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
        if (!validate()) return;

        setIsSaving(true);
        try {
            await profileService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Password changed successfully');
        } catch (err) {
            const errors = parseApiError(err);
            setServerError(errors.join('. '));
        } finally {
            setIsSaving(false);
        }
    };

    const password = formData.newPassword || '';
    const requirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', met: /[a-z]/.test(password) },
        { label: 'One number', met: /\d/.test(password) },
        { label: 'One special character (@$!%*?&^#_-)', met: /[@$!%*?&^#_-]/.test(password) },
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-2xl space-y-4 sm:space-y-6"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title="Security Settings"
                    description="Change your password to keep your account secure"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <ErrorBanner message={serverError} />
            </motion.div>

            <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="glass-card space-y-5 sm:space-y-6 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgb(var(--color-secondary))]/15 to-[rgb(var(--color-secondary))]/5 ring-2 ring-[rgb(var(--color-secondary))]/10 shadow-inner">
                        <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-[rgb(var(--color-secondary))]" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-serif text-base sm:text-lg font-bold text-[rgb(var(--color-text))]">
                            Change Password
                        </p>
                        <p className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))]">
                            Ensure your account uses a strong, unique password
                        </p>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-border))] to-transparent" />

                <div className="space-y-4">
                    <FormField
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        error={errors.currentPassword}
                        required
                        placeholder="Enter current password"
                    />
                    <FormField
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        required
                        placeholder="Enter new password"
                    />
                    <FormField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                        placeholder="Confirm new password"
                    />
                </div>

                <div className="rounded-xl bg-[rgb(var(--color-bg-subtle))] p-3 sm:p-4 ring-1 ring-[rgb(var(--color-border))]">
                    <p className="text-[10px] sm:text-xs font-semibold text-[rgb(var(--color-text-muted))] mb-2 sm:mb-3 uppercase tracking-wider">
                        Password Requirements
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {requirements.map((req, i) => (
                            <PasswordRequirement key={i} label={req.label} met={req.met} />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="glass-button-primary !px-6 min-h-[44px] group flex items-center gap-2"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Lock className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        )}
                        Update Password
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
}
