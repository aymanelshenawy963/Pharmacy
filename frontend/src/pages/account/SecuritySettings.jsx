import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Lock, Save, Loader2, Shield } from 'lucide-react';
import { profileService } from '../../services/profileService';
import PageHeader from '../../components/admin/PageHeader';
import FormField from '../../components/admin/FormField';
import ErrorBanner from '../../components/admin/ErrorBanner';
import { validators } from '../../utils/validators';

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
            confirmPassword: validators.confirmPassword(formData.newPassword, formData.confirmPassword),
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
            if (err.status === 400) {
                setServerError(err.message || 'Incorrect current password');
            } else {
                setServerError(err.message || 'Failed to change password');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <PageHeader
                title="Security Settings"
                description="Change your password to keep your account secure"
            />

            <ErrorBanner message={serverError} />

            <form onSubmit={handleSubmit} className="glass-card space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--color-secondary))]/10">
                        <Shield className="h-8 w-8 text-[rgb(var(--color-secondary))]" />
                    </div>
                    <div>
                        <p className="font-serif text-lg font-bold text-[rgb(var(--color-text))]">
                            Change Password
                        </p>
                        <p className="text-sm text-[rgb(var(--color-text-muted))]">
                            Ensure your account uses a strong, unique password
                        </p>
                    </div>
                </div>

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

                <div className="rounded-xl bg-[rgb(var(--color-bg-subtle))] p-4">
                    <p className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                        Password must contain at least 8 characters, one uppercase letter, one lowercase letter,
                        one digit, and one special character (@$!%*?&^#_-)
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="glass-button-primary !px-6"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Lock className="h-4 w-4" />
                        )}
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
}
