import { z } from "zod/v4";

export const registerSchema = z.object({
  username: z.string().min(3).max(100),
  email: z.email("Please enter a valid email"),
  password: z.string(),
  organization: z.number().nullable().optional(),
  designation: z.number().nullable().optional(),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string("Please enter a valid password"),
});
