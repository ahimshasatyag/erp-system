import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

export const supplierSchema = z.object({
    id_suppliers: z.string().optional(),
    nm_suppliers: z.string().min(1, 'Supplier Name is required').max(255),
    suppliers_mobile: z.string().max(15).optional(),
    suppliers_email: z.union([z.literal(''), z.string().email('Invalid email')]).optional(),
    suppliers_address: z.string().min(1, 'Address is required'),
    suppliers_phone: z.string().min(1, 'Phone is required').max(15),
    suppliers_fax: z.string().max(255).optional(),
    suppliers_website: z.string().max(255).optional(),
    id_mata_uang: z.string().optional(),
    
    file: z
        .any()
        .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Max file size is 2MB.`)
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
            'Only .jpg, .jpeg, .png and .gif formats are supported.'
        )
        .optional(),

    contacts: z.array(
        z.object({
            id: z.number().optional(),
            nm_suppliers_contact: z.string().min(1, 'Contact Name is required').max(255),
            suppliers_contact_posisi: z.string().max(255).optional(),
            suppliers_contact_phone: z.string().max(15).optional(),
            suppliers_contact_email: z.union([z.literal(''), z.string().email('Invalid email')]).optional(),
        })
    ).optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
