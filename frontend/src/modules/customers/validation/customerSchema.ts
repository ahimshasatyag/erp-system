import { z } from 'zod';

export const customerContactSchema = z.object({
    nm_customers_contact: z.string().min(1, 'Nama kontak harus diisi').max(255),
    customers_contact_posisi: z.string().max(100).optional().nullable(),
    customers_contact_phone: z.string().max(50).optional().nullable(),
    customers_contact_email: z.string().email('Format email tidak valid').max(100).optional().nullable().or(z.literal('')),
});

export const customerSchema = z.object({
    id_customers: z.string().optional(),
    nm_customers: z.string().min(1, 'Nama Customer harus diisi').max(255),
    customers_address: z.string().min(1, 'Alamat harus diisi'),
    customers_address_invoice: z.string().min(1, 'Alamat Invoice harus diisi'),
    customers_phone: z.string().max(50).optional().nullable(),
    customers_mobile: z.string().max(50).optional().nullable(),
    customers_email: z.string().email('Format email tidak valid').max(100).optional().nullable().or(z.literal('')),
    customers_fax: z.string().max(50).optional().nullable(),
    provinsi: z.string().min(1, 'Provinsi harus dipilih'),
    kabupaten: z.string().min(1, 'Kabupaten/Kota harus dipilih'),
    f_company: z.boolean().default(false),
    nama_lengkap: z.string().max(255).optional().nullable(),
    nik: z.string().max(50).optional().nullable(),
    nib: z.string().max(50).optional().nullable(),
    npwp: z.string().max(50).optional().nullable(),
    alamat: z.string().optional().nullable(),
    is_blacklist: z.boolean().default(false),
    is_external_sales: z.boolean().default(false),
    contacts: z.array(customerContactSchema).optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CustomerContactFormData = z.infer<typeof customerContactSchema>;
