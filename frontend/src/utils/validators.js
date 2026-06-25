export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
    email(value) {
        if (!value || !value.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
        return null;
    },

    password(value) {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/\d/.test(value)) return 'Password must contain at least one number';
        if (!/[^a-zA-Z\d]/.test(value)) return 'Password must contain at least one special character';
        return null;
    },

    confirmPassword(value, original) {
        if (!value) return 'Please confirm your password';
        if (value !== original) return 'Passwords do not match';
        return null;
    },

    userName(value) {
        if (!value || !value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be at most 20 characters';
        return null;
    },

    firstName(value) {
        if (!value || !value.trim()) return 'First name is required';
        if (value.length < 3) return 'First name must be at least 3 characters';
        if (value.length > 100) return 'First name must be at most 100 characters';
        return null;
    },

    lastName(value) {
        if (!value || !value.trim()) return 'Last name is required';
        if (value.length < 3) return 'Last name must be at least 3 characters';
        if (value.length > 100) return 'Last name must be at most 100 characters';
        return null;
    },

    required(value, label = 'This field') {
        if (!value || !value.trim()) return `${label} is required`;
        return null;
    },
};

export function getPasswordStrength(password) {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score, label: 'Fair', color: '#f59e0b' };
    if (score === 4) return { score, label: 'Good', color: '#3b82f6' };
    return { score, label: 'Strong', color: '#10b981' };
}
