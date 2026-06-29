import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { User, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { parseApiError } from '../../utils/apiErrorHandler';
import PageHeader from '../../components/admin/PageHeader';
import FormField from '../../components/admin/FormField';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBanner from '../../components/admin/ErrorBanner';
import { validators } from '../../utils/validators';

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

export default function ProfileSettings() {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [initialData, setInitialData] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        fetchProfile();
        return () => controller.abort();
    }, []);

    async function fetchProfile() {
        setIsLoading(true);
        setServerError(null);
        try {
            const data = await profileService.getProfile();
            setFormData({ firstName: data.firstName, lastName: data.lastName });
            setInitialData({ firstName: data.firstName, lastName: data.lastName });
        } catch (err) {
            const msgs = parseApiError(err);
            setServerError(msgs.join(' '));
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        setServerError(null);
    };

    const validate = () => {
        const newErrors = {
            firstName: validators.firstName(formData.firstName),
            lastName: validators.lastName(formData.lastName),
        };
        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) setErrors(newErrors);
        return !hasErrors;
    };

    const hasChanges = initialData && (
        formData.firstName !== initialData.firstName || formData.lastName !== initialData.lastName
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        setIsSaving(true);
        try {
            await profileService.updateProfile(formData);
            updateProfile(formData.firstName, formData.lastName);
            setInitialData({ ...formData });
            toast.success('Profile updated successfully');
        } catch (err) {
            if (err.status === 400 && err.validationErrors) {
                const apiErrors = {};
                Object.keys(err.validationErrors).forEach((key) => {
                    const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                    apiErrors[fieldName] = err.validationErrors[key][0];
                });
                setErrors((prev) => ({ ...prev, ...apiErrors }));
            }
            const msgs = parseApiError(err);
            setServerError(msgs.join(' '));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-2xl space-y-4 sm:space-y-6"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title="Profile Settings"
                    description="Update your personal information"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <ErrorBanner message={serverError} onRetry={fetchProfile} />
            </motion.div>

            <motion.form
                variants={itemVariants}
                onSubmit={handleSubmit}
                className="glass-card space-y-5 sm:space-y-6 p-4 sm:p-6 transition-all duration-300 hover:shadow-lg"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary))]/15 to-[rgb(var(--color-primary))]/5 ring-2 ring-[rgb(var(--color-primary))]/10 shadow-inner">
                        <User className="h-7 w-7 sm:h-8 sm:w-8 text-[rgb(var(--color-primary))]" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-sans text-base sm:text-lg font-bold text-[rgb(var(--color-text))] truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs sm:text-sm text-[rgb(var(--color-text-muted))] truncate">{user?.email}</p>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-border))] to-transparent" />

                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        required
                        placeholder="Enter first name"
                    />
                    <FormField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        required
                        placeholder="Enter last name"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving || !hasChanges}
                        className="glass-button-primary !px-6 min-h-[44px] group flex items-center gap-2"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        )}
                        Save Changes
                    </button>
                </div>
            </motion.form>
        </motion.div>
    );
}
