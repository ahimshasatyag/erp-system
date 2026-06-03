import { z } from 'zod';

export const logBookCustomerSchema = z.object({
    id_customers: z.string().min(1, 'Customer is required'),
    date_log_book: z.string().min(1, 'Date is required'),
    masalah_hidden: z.string().min(1, 'Complaint is required').refine(val => val !== '<p><br></p>' && val !== '', 'Complaint is required'),
    solusi_hidden: z.string().min(1, 'Feedback is required').refine(val => val !== '<p><br></p>' && val !== '', 'Feedback is required'),
    catatan_hidden: z.string().nullable().optional()
});
