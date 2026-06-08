import { z } from 'zod';

export const productCategorySchema = z.object({
    id_product_kategori: z.string().optional(),
    kode_product_kategori: z.string().optional(),
    nm_product_kategori: z.string().min(1, 'Category Name is required').max(255, 'Category Name is too long'),
});

export type ProductCategoryFormData = z.infer<typeof productCategorySchema>;
