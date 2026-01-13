import { z } from "zod";

export const taskSchema = z.object({
  comp_id: z.number({ error: "Company is required" }),

  status: z.enum(["pending", "in_progress", "completed", "blocked"] as const, {
    error: "Status is required",
  }),

  due_date: z.union([z.date(), z.null()]).optional(),
});

export type CreateTaskType = z.infer<typeof taskSchema>;
