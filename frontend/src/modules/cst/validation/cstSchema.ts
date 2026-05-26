import { z } from "zod";

export const updateCstSchema = z.object({
  cst_code: z.string().min(1, "CST Code is required"),
  cst_date: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

export type UpdateCstValues = z.infer<typeof updateCstSchema>;
