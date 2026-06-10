import { z } from 'zod';

export const customerContactSchema = z.object({
    nm_customers_contact: z.string().min(1, 'Contact Name is required'),
    id_customers: z.coerce.number().min(1, 'Company Name is required'),
    customers_contact_posisi: z.string().optional().nullable(),
    customers_contact_phone: z.string().optional().nullable(),
    customers_contact_mobile: z.string().optional().nullable(),
    customers_contact_email: z.string().email('Invalid email address').optional().nullable().or(z.literal('')),
    customers_contact_address: z.string().optional().nullable(),
});

export type CustomerContactFormValues = z.infer<typeof customerContactSchema>;
