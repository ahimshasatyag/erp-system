import { z } from "zod";

export const storeCsrSchema = z.object({
  sn_number: z.string().min(1, "SN Number is required"),
  id_product: z.string().optional().nullable(),
  sts_pasang: z.string().min(1, "Status Pasang is required"),
  do_code: z.string().optional().nullable(),
  mesin_lama: z.string().optional().nullable(),
  id_customers: z.string().optional().nullable(),
  date_request: z.string().optional().nullable(), // date string (YYYY-MM-DD)
  id_karyawan: z.string().min(1, "Requestor is required"),
  lokasi: z.string().min(1, "Lokasi is required"),
  lap_kerusakan: z.string().min(1, "Laporan Kerusakan is required"),
  warranty_time: z.string().optional().nullable(),
  warranty_start: z.string().optional().nullable(),
  warranty_end: z.string().optional().nullable(),
  tgl_delivered: z.string().min(1, "Tanggal Kirim Mesin is required"), // date string
  customers: z.string().min(1, "Customer is required"),
  link_foto: z.any().optional(), // Used for File object
});

export type StoreCsrValues = z.infer<typeof storeCsrSchema>;

export const updateCsrSchema = z.object({
  csr_code: z.string().min(1, "CSR Code is required"),
  customers: z.string().optional().nullable(),
  sts_pasang: z.string().optional().nullable(),
  csr_date: z.string().optional().nullable(),
  id_karyawan: z.string().optional().nullable(),
  lokasi: z.string().min(1, "Lokasi is required"),
  lap_kerusakan: z.string().min(1, "Laporan Kerusakan is required"),
  link_foto: z.any().optional(),
});

export type UpdateCsrValues = z.infer<typeof updateCsrSchema>;
