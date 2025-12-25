import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1),
  url: z.url(),
  status: z.string(),
  origin: z.string(),
  notes: z.array(z.string()).default([]),
  resourceUrls: z.array(z.url()).default([]),
  tags: z.array(z.string()).min(1),
});

export type CreateCompanyType = z.infer<typeof companySchema>
