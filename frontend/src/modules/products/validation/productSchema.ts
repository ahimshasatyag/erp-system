import { z } from 'zod';

export const productSchema = z.object({
    code_product: z.string().min(1, 'Product Code is required'),
    nm_product: z.string().min(1, 'Product Name is required'),
    id_product_kategori: z.string().min(1, 'Category is required'),
    id_product_sub_kategori: z.string().min(1, 'Sub Category is required'),
    id_product_brand: z.string().min(1, 'Brand is required'),
    id_product_satuan: z.string().min(1, 'Satuan is required'),
    product_deskripsi: z.string().min(1, 'Deskripsi is required'),
    product_refference: z.string().nullable().optional(),
    link_brosur: z.any().nullable().optional(),
    link_foto: z.any().nullable().optional(),
    options: z.array(
        z.object({ value: z.string().min(1, 'Option name cannot be empty') })
    ).nullable().optional(),
});
