// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";

export const localeSchema = z.enum(["th", "en"]);
export type Locale = z.infer<typeof localeSchema>;

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const actorSchema = z.object({
  type: z.enum(["human", "ai", "system"]),
  id: z.string().min(1),
});
export type Actor = z.infer<typeof actorSchema>;

export const listQuerySchema = z.object({
  status: contentStatusSchema.optional(),
  locale: localeSchema.optional(),
  search: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListQuery = z.infer<typeof listQuerySchema>;

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[\p{L}\p{N}\p{M}]+(?:-[\p{L}\p{N}\p{M}]+)*$/u, "Slug must contain letters, numbers, and single hyphens only");


/** Safe localized URL path segments for legacy editorial and portfolio URLs. */
export const pathSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .regex(/^[\p{L}\p{N}\p{M}]+(?:-[\p{L}\p{N}\p{M}]+)*(?:\/[\p{L}\p{N}\p{M}]+(?:-[\p{L}\p{N}\p{M}]+)*)*$/u, "Slug path must contain safe slash-separated segments only");
