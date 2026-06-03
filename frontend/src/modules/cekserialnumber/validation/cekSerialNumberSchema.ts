import { z } from 'zod';

export const searchBarcodeSchema = z.object({
    barcode: z.string().min(1, 'Serial Number tidak boleh kosong!'),
});

export type SearchBarcodeValues = z.infer<typeof searchBarcodeSchema>;
