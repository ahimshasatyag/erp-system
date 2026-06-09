import { z } from 'zod';

export const productBrandSchema = z.object({
    id_product_brand: z.string().optional(),
    nm_product_brand: z.string().min(1, 'Brand Name is required').max(255, 'Brand Name is too long'),
});

export type ProductBrandFormData = z.infer<typeof productBrandSchema>;
