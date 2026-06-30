import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(3, 'First name must be at least 3 characters')
        .max(100, 'First name must be at most 100 characters'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(3, 'Last name must be at least 3 characters')
        .max(100, 'Last name must be at most 100 characters'),
    userName: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .regex(PASSWORD_REGEX, 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
    code: z.string().min(1, 'Reset code is required'),
    newPassword: z
        .string()
        .min(1, 'New password is required')
        .regex(PASSWORD_REGEX, 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const confirmEmailSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
    code: z
        .string()
        .min(1, 'Verification code is required')
        .length(6, 'Verification code must be 6 digits'),
});

export const resendConfirmationSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
});


