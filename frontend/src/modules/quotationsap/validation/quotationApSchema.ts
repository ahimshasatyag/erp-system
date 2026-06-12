import { z } from 'zod';

export const quotationApOptionSchema = z.object({
    nm_product_opt: z.string(),
    harga: z.coerce.number().min(0),
    checked: z.boolean().optional(),
});

export const quotationApDetailSchema = z.object({
    id_product: z.string().min(1, 'Produk harus dipilih'),
    code_product: z.string().optional().nullable(),
    nm_product: z.string().optional().nullable(),
    product_deskripsi: z.string().optional().nullable(),
    nm_product_satuan: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    product_price: z.coerce.number().min(0, 'Harga minimal 0'),
    qty: z.coerce.number().min(1, 'Qty minimal 1'),
    options: z.array(quotationApOptionSchema).optional(),
});

export const quotationApSchema = z.object({
    id_suppliers: z.string().min(1, 'Supplier harus dipilih'),
    partner_ref: z.string().optional().nullable(),
    mata_uang: z.string().min(1, 'Mata uang harus dipilih'),
    date_po: z.string().min(1, 'Order Date wajib diisi'),
    id_gudang: z.string().min(1, 'Destination Warehouse wajib diisi'),
    notes: z.string().optional().nullable(),
    date_schdl: z.string().optional().nullable(),
    id_product_lokasi: z.string().min(1, 'Destination lokasi wajib diisi'),
    link_file: z.any().optional(), // File upload
    details: z.array(quotationApDetailSchema).min(1, 'Minimal satu barang harus ditambahkan'),
});

export type QuotationApOptionData = z.infer<typeof quotationApOptionSchema>;
export type QuotationApDetailData = z.infer<typeof quotationApDetailSchema>;
export type QuotationApFormData = z.infer<typeof quotationApSchema>;
