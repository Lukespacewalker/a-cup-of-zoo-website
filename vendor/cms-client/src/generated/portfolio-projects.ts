// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";
import { assetDtoSchema } from "./media";
import { actorSchema, contentStatusSchema, localeSchema, pathSlugSchema } from "./shared";

export const portfolioProjectCategorySchema = z.enum(["web", "desktop"]);
export const portfolioProjectAssetRoleSchema = z.enum(["cover", "gallery"]);
export const portfolioProjectDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Project date must be YYYY-MM-DD");

export const portfolioProjectTranslationInputSchema = z.object({
  locale: localeSchema,
  slug: pathSlugSchema,
  title: z.string().trim().min(1).max(180),
  excerpt: z.string().trim().max(320).default(""),
  bodyMarkdown: z.string().default(""),
  seoTitle: z.string().trim().max(70).default(""),
  seoDescription: z.string().trim().max(170).default(""),
});

export const portfolioProjectAssetLinkInputSchema = z.object({
  assetId: z.string().uuid(),
  role: portfolioProjectAssetRoleSchema,
  sortOrder: z.number().int().min(0).max(1_000).default(0),
});

export const portfolioProjectAssetDtoSchema = assetDtoSchema.extend({
  role: portfolioProjectAssetRoleSchema,
  sortOrder: z.number().int().min(0),
});

export const createPortfolioProjectInputSchema = z.object({
  category: portfolioProjectCategorySchema,
  projectDate: portfolioProjectDateSchema,
  technologies: z.array(z.string().trim().min(1).max(80)).max(50).default([]),
  projectUrl: z.string().url().nullable().default(null),
  repositoryUrl: z.string().url().nullable().default(null),
  translations: z.array(portfolioProjectTranslationInputSchema).min(1).max(2),
  assetLinks: z.array(portfolioProjectAssetLinkInputSchema).max(100).default([]),
  actor: actorSchema,
  idempotencyKey: z.string().trim().min(1).max(120).optional(),
});

export const updatePortfolioProjectInputSchema = createPortfolioProjectInputSchema
  .omit({ idempotencyKey: true })
  .extend({ expectedVersion: z.number().int().positive() });

export const portfolioProjectDtoSchema = z.object({
  id: z.string().uuid(),
  status: contentStatusSchema,
  category: portfolioProjectCategorySchema,
  projectDate: portfolioProjectDateSchema,
  technologies: z.array(z.string()),
  projectUrl: z.string().url().nullable(),
  repositoryUrl: z.string().url().nullable(),
  translations: z.array(portfolioProjectTranslationInputSchema),
  assets: z.array(portfolioProjectAssetDtoSchema),
  version: z.number().int().positive(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PortfolioProjectCategory = z.infer<typeof portfolioProjectCategorySchema>;
export type PortfolioProjectTranslationInput = z.infer<typeof portfolioProjectTranslationInputSchema>;
export type PortfolioProjectAssetLinkInput = z.infer<typeof portfolioProjectAssetLinkInputSchema>;
export type PortfolioProjectAssetDto = z.infer<typeof portfolioProjectAssetDtoSchema>;
export type CreatePortfolioProjectInput = z.infer<typeof createPortfolioProjectInputSchema>;
export type UpdatePortfolioProjectInput = z.infer<typeof updatePortfolioProjectInputSchema>;
export type PortfolioProjectDto = z.infer<typeof portfolioProjectDtoSchema>;
