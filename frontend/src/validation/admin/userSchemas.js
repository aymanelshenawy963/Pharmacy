import { z } from 'zod';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../utils/validators';

export const createUserSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
    userName: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters'),
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
    password: z
        .string()
        .min(1, 'Password is required')
        .regex(PASSWORD_REGEX, 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character'),
    isAdmin: z.boolean().optional(),
});

export const updateUserSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .regex(EMAIL_REGEX, 'Please enter a valid email address'),
    userName: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters'),
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
    isAdmin: z.boolean().optional(),
});
