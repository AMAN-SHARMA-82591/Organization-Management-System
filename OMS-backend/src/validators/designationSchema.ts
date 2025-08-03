import { z } from "zod/v4";

export const designationSchema = z.object({
  name: z.string(),
  description: z.string(),
});
