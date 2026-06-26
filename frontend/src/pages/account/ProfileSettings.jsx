import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { User, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import PageHeader from '../../components/admin/PageHeader';
import FormField from '../../components/admin/FormField';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorBanner from '../../components/admin/ErrorBanner';
import { validators } from '../../utils/validators';

export default function ProfileSettings() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [initialData, setInitialData] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        setIsLoading(true);
        setServerError(null);
        try {
            const data = await profileService.getProfile();
            setFormData({ firstName: data.firstName, lastName: data.lastName });
            setInitialData({ firstName: data.firstName, lastName: data.lastName });
        } catch (err) {
            setServerError(err.message || 'Failed to load profile');
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
            setServerError(err.message || 'Failed to update profile');
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
        <div className="mx-auto max-w-2xl space-y-6">
            <PageHeader
                title="Profile Settings"
                description="Update your personal information"
            />

            <ErrorBanner message={serverError} onRetry={fetchProfile} />

            <form onSubmit={handleSubmit} className="glass-card space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))]/10">
                        <User className="h-8 w-8 text-[rgb(var(--color-primary))]" />
                    </div>
                    <div>
                        <p className="font-serif text-lg font-bold text-[rgb(var(--color-text))]">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-muted))]">{user?.email}</p>
                    </div>
                </div>

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
                        className="glass-button-primary !px-6"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
