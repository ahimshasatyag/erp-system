import { z } from 'zod';

export const purchaseRequisitionDetailSchema = z.object({
    id_product: z.string().min(1, 'Produk harus dipilih'),
    qty: z.coerce.number().min(1, 'Qty minimal 1'),
    note: z.string().optional().nullable(),
    nm_product: z.string().optional().nullable(),
    nm_product_satuan: z.string().optional().nullable(),
});

export const purchaseRequisitionSchema = z.object({
    username: z.string().min(1, 'Responsible harus dipilih'),
    date_request: z.string().min(1, 'Requisition Date wajib diisi'),
    date_deadline: z.string().min(1, 'Requisition Deadline wajib diisi'),
    details: z.array(purchaseRequisitionDetailSchema).min(1, 'Minimal satu barang harus ditambahkan'),
});

export type PurchaseRequisitionDetailData = z.infer<typeof purchaseRequisitionDetailSchema>;
export type PurchaseRequisitionFormData = z.infer<typeof purchaseRequisitionSchema>;
