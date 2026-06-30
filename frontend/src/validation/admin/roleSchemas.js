import { z } from 'zod';

export const roleSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters'),
});
