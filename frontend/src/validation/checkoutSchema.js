import { z } from 'zod';

export const shippingAddressSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .max(100, 'First name must be at most 100 characters'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .max(100, 'Last name must be at most 100 characters'),
    street: z
        .string()
        .min(1, 'Street address is required')
        .max(200, 'Street address must be at most 200 characters'),
    city: z
        .string()
        .min(1, 'City is required')
        .max(100, 'City must be at most 100 characters'),
    state: z
        .string()
        .min(1, 'State is required')
        .max(100, 'State must be at most 100 characters'),
    zipCode: z
        .string()
        .min(1, 'ZIP code is required')
        .max(20, 'ZIP code must be at most 20 characters'),
});
