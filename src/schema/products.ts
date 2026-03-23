import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  price: z.number().positive().min(0.01),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

