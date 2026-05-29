import { z } from 'zod';

export const lktSchema = z.object({
  cst_code: z.string().optional(),
  starting_date: z.string().min(1, 'Starting Date is required'),
  description: z.string().min(1, 'Catatan Tambahan is required'),
  estimation_day: z.coerce.number().min(1, 'Estimation must be at least 1 day').default(1),
  transport_amount: z.coerce.number().min(0).default(0),
  actual_transport: z.string().min(1, 'Type Transport is required'),
  accommodation_amount: z.coerce.number().min(0).default(0),
  service_amount: z.coerce.number().min(0).default(0),
  nm_teknisi: z.array(z.string()).optional().default([]),
});

export type LktSchemaInput = z.infer<typeof lktSchema>;
