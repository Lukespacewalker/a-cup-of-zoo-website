// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";
import { assetDtoSchema } from "./media";
import { actorSchema, contentStatusSchema, localeSchema, slugSchema } from "./shared";

const catalogKeySchema = z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const productVariantTranslationInputSchema = z.object({
  locale: localeSchema,
  name: z.string().trim().min(1).max(120),
});

export const productVariantInputSchema = z.object({
  id: catalogKeySchema,
  translations: z.array(productVariantTranslationInputSchema).min(1).max(2),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable().default(null),
  available: z.boolean().default(true),
});

export const productTagTranslationInputSchema = z.object({
  locale: localeSchema,
  tags: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
});

export const productAssetRoleSchema = z.enum(["cover", "gallery", "lifestyle"]);

export const productAssetLinkInputSchema = z.object({
  assetId: z.string().uuid(),
  role: productAssetRoleSchema,
  sortOrder: z.number().int().min(0).max(1000).default(0),
  variantIds: z.array(catalogKeySchema).max(50).default([]),
});

export const productAssetDtoSchema = assetDtoSchema.extend({
  role: productAssetRoleSchema,
  sortOrder: z.number().int().min(0),
  variantIds: z.array(catalogKeySchema),
});

export const productTranslationInputSchema = z.object({
  locale: localeSchema,
  slug: slugSchema,
  title: z.string().trim().min(1).max(180),
  eyebrow: z.string().trim().max(120).default(""),
  description: z.string().default(""),
  details: z.array(z.string().trim().min(1)).default([]),
  materials: z.array(z.string().trim().min(1)).default([]),
  care: z.array(z.string().trim().min(1)).default([]),
  inspiration: z.string().default(""),
  craftsmanship: z.string().default(""),
  seoTitle: z.string().trim().max(70).default(""),
  seoDescription: z.string().trim().max(170).default(""),
});

export const createProductInputSchema = z.object({
  code: z.string().trim().max(80).nullable().default(null),
  priceMinor: z.number().int().min(0).nullable().default(null),
  currency: z.literal("THB").default("THB"),
  featured: z.boolean().default(false),
  translations: z.array(productTranslationInputSchema).min(1).max(2),
  variants: z.array(productVariantInputSchema).max(50).default([]),
  collections: z.array(catalogKeySchema).max(20).default([]),
  tagTranslations: z.array(productTagTranslationInputSchema).max(2).default([]),
  assetLinks: z.array(productAssetLinkInputSchema).max(100).default([]),
  actor: actorSchema,
  idempotencyKey: z.string().max(120).optional(),
});

export const updateProductInputSchema = createProductInputSchema.omit({ idempotencyKey: true }).extend({
  expectedVersion: z.number().int().positive(),
});

export const productDtoSchema = z.object({
  id: z.string().uuid(),
  status: contentStatusSchema,
  code: z.string().nullable(),
  priceMinor: z.number().int().nullable(),
  currency: z.literal("THB"),
  featured: z.boolean(),
  version: z.number().int().positive(),
  translations: z.array(productTranslationInputSchema),
  variants: z.array(productVariantInputSchema),
  collections: z.array(catalogKeySchema),
  tagTranslations: z.array(productTagTranslationInputSchema),
  assets: z.array(productAssetDtoSchema),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProductTranslationInput = z.infer<typeof productTranslationInputSchema>;
export type ProductVariantTranslationInput = z.infer<typeof productVariantTranslationInputSchema>;
export type ProductVariantInput = z.infer<typeof productVariantInputSchema>;
export type ProductTagTranslationInput = z.infer<typeof productTagTranslationInputSchema>;
export type ProductAssetLinkInput = z.infer<typeof productAssetLinkInputSchema>;
export type ProductAssetDto = z.infer<typeof productAssetDtoSchema>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;
export type ProductDto = z.infer<typeof productDtoSchema>;
