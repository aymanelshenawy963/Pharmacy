export const AUTH_ENDPOINTS = {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    FORGOT_PASSWORD: '/Auth/forgot-password',
    RESET_PASSWORD: '/Auth/reset-password',
    CONFIRM_EMAIL: '/Auth/confirm-email',
    RESEND_CONFIRMATION: '/Auth/resend-confirmation-email',
    REFRESH_TOKEN: '/Auth/refresh-token',
    REVOKE_REFRESH_TOKEN: '/Auth/revoke-refresh-token',
};

export const STORAGE_KEYS = {
    TOKEN: 'jaya-auth-token',
    REFRESH_TOKEN: 'jaya-refresh-token',
    USER: 'jaya-auth-user',
    EXPIRES_IN: 'jaya-auth-expires',
};

export const AUTH_ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    CONFIRM_EMAIL: '/confirm-email',
    RESEND_CONFIRMATION: '/resend-confirmation',
    CHECK_EMAIL: '/check-email',
    HOME: '/',
    ADMIN_PRODUCTS: '/admin/products',
};

export const authContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const authFadeUpVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const authScaleFadeVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const floatingAnimation = {
    y: [0, -12, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
};

export const floatingAnimation2 = {
    y: [0, 10, 0],
    x: [0, -8, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
};

export const floatingBlurAnimation = {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
};

export const floatingBlurAnimation2 = {
    y: [0, 8, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
};

export const PASSWORD_RULES = [
    { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
    { label: 'Uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'Lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { label: 'Number', test: (pw) => /\d/.test(pw) },
    { label: 'Special character', test: (pw) => /[@$!%*?&^#_\-]/.test(pw) },
];
