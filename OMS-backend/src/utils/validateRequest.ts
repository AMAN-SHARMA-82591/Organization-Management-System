import { Request } from "express";
import { z, ZodObject } from "zod/v4";

export function validateSafeParse<T>(schema: ZodObject<any>, request: Request): T {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    throw z.flattenError(result.error).fieldErrors;
  }
  return result.data as T;
}
