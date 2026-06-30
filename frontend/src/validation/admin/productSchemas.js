import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    newPrice: z
        .string()
        .min(1, 'Valid price is required')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valid price is required'),
    oldPrice: z
        .string()
        .optional()
        .refine(
            (val) => !val || (Number(val) >= 0 && !isNaN(Number(val))),
            'Old price cannot be negative'
        ),
    stock: z
        .string()
        .min(1, 'Valid stock is required')
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Valid stock is required'),
    categoryId: z.string().min(1, 'Category is required'),
    photos: z
        .array(z.any())
        .min(1, 'At least one photo is required'),
});
