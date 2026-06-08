import { z } from 'zod';

export const productSubCategorySchema = z.object({
    id_product_kategori: z.string().min(1, 'Category is required'),
    nm_product_sub_kategori: z.string().min(1, 'Sub Category Name is required').max(255, 'Sub Category Name cannot exceed 255 characters'),
});

export type ProductSubCategoryFormData = z.infer<typeof productSubCategorySchema>;
