// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";
import { actorSchema, contentStatusSchema, localeSchema, pathSlugSchema } from "./shared";
import { assetDtoSchema } from "./media";

export const postTranslationInputSchema = z.object({
  locale: localeSchema,
  slug: pathSlugSchema,
  title: z.string().trim().min(1).max(180),
  excerpt: z.string().trim().max(320).default(""),
  bodyMarkdown: z.string().default(""),
  seoTitle: z.string().trim().max(70).default(""),
  seoDescription: z.string().trim().max(170).default(""),
});

export const postAssetRoleSchema = z.enum(["cover", "inline", "gallery"]);
export const postAssetLinkInputSchema = z.object({
  assetId: z.string().uuid(),
  role: postAssetRoleSchema,
  sortOrder: z.number().int().min(0).max(1_000).default(0),
});
export const postAssetDtoSchema = assetDtoSchema.extend({
  role: postAssetRoleSchema,
  sortOrder: z.number().int().min(0),
});

export const contentDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Content date must be YYYY-MM-DD");

export const createPostInputSchema = z.object({
  translations: z.array(postTranslationInputSchema).min(1).max(2),
  contentDate: contentDateSchema.nullable().optional(),
  assetLinks: z.array(postAssetLinkInputSchema).max(100).optional(),
  actor: actorSchema,
  idempotencyKey: z.string().max(120).optional(),
  sourceKey: z.string().trim().min(1).max(180).optional(),
});

export const updatePostInputSchema = z.object({
  translations: z.array(postTranslationInputSchema).min(1).max(2),
  contentDate: contentDateSchema.nullable().optional(),
  assetLinks: z.array(postAssetLinkInputSchema).max(100).optional(),
  expectedVersion: z.number().int().positive(),
  actor: actorSchema,
});

export const postDtoSchema = z.object({
  id: z.string().uuid(),
  status: contentStatusSchema,
  version: z.number().int().positive(),
  translations: z.array(postTranslationInputSchema),
  contentDate: contentDateSchema.nullable().optional(),
  assets: z.array(postAssetDtoSchema).optional(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PostTranslationInput = z.infer<typeof postTranslationInputSchema>;
export type PostAssetLinkInput = z.infer<typeof postAssetLinkInputSchema>;
export type PostAssetDto = z.infer<typeof postAssetDtoSchema>;
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;
export type PostDto = z.infer<typeof postDtoSchema>;
