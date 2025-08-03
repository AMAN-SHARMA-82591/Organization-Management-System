import { z } from "zod/v4";

export const leaveSchema = z.object({
  // user: z.string(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  reason: z.string(),
  status: z.enum(["pending", "approved", "rejected", "cancelled"]).optional(),
});
