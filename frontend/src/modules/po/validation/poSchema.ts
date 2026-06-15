import { z } from 'zod';

export const poDetailSchema = z.object({
    id_product: z.string().min(1, 'Product is required'),
    code_product: z.string().optional(),
    nm_product: z.string().optional(),
    product_deskripsi: z.string().optional(),
    qty: z.coerce.number().min(1, 'Qty must be at least 1'),
    product_price: z.coerce.number().min(0, 'Price must be >= 0'),
    notes: z.string().optional(),
});

export const poFormSchema = z.object({
    id_suppliers: z.string().min(1, 'Supplier is required'),
    partner_ref: z.string().optional(),
    mata_uang: z.string().min(1, 'Mata Uang is required'),
    id_gudang: z.string().min(1, 'Gudang is required'),
    date_po: z.string().min(1, 'Date is required'),
    date_schdl: z.string().optional(),
    id_product_lokasi: z.string().optional(),
    notes: z.string().optional(),
    details: z.array(poDetailSchema).min(1, 'At least one product is required'),
});

export type PoFormData = z.infer<typeof poFormSchema>;
export type PoDetailData = z.infer<typeof poDetailSchema>;
