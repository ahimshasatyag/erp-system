import { z } from 'zod';

export const productUnitSchema = z.object({
    id_product_satuan: z.string().optional(),
    nm_product_satuan: z.string().min(1, 'Unit Name is required').max(255, 'Unit Name is too long'),
});

export type ProductUnitFormData = z.infer<typeof productUnitSchema>;
