// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";
import { actorSchema, contentStatusSchema, listQuerySchema } from "./shared";

const markdown = z.string().max(1_000_000).default("");
const aoedDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Content date must be YYYY-MM-DD");
export const aoedSeoSchema = z.object({ title: z.string().trim().max(70).default(""), description: z.string().trim().max(170).default("") });
export const aoedAssetRefSchema = z.object({ mediaId: z.string().uuid(), role: z.enum(["cover", "inline", "gallery", "attachment", "preview"]), sortOrder: z.number().int().min(0).max(10_000).default(0) });
export const aoedEditorialKindSchema = z.enum(["news", "article"]);
export const aoedDocumentKindSchema = z.enum(["book", "poster", "guideline", "competency", "announcement", "conference-material", "official-letter", "policy", "wfme", "covid-guidance", "other"]);
export const aoedMediaKindSchema = z.enum(["image", "pdf"]);
export const aoedPathSlugSchema = z.string().trim().min(1).max(500).regex(/^[\p{L}\p{N}\p{M}_]+(?:-[\p{L}\p{N}\p{M}_]+)*(?:\/[\p{L}\p{N}\p{M}_]+(?:-[\p{L}\p{N}\p{M}_]+)*)*$/u, "AOED slug path must use Unicode letters, numbers, combining marks, underscores, and single hyphens");

const provenance = { sourcePath: z.string().trim().min(1).max(600), legacyUrl: z.string().max(1_000).nullable().default(null), sourceHash: z.string().regex(/^[a-f0-9]{64}$/).nullable().default(null), sourceKey: z.string().trim().min(1).max(300), idempotencyKey: z.string().trim().min(1).max(300).optional() };
const lifecycle = { status: contentStatusSchema, version: z.number().int().positive(), publishedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string() };

export const aoedEditorialInputSchema = z.object({ kind: aoedEditorialKindSchema, slug: aoedPathSlugSchema, title: z.string().trim().min(1).max(300), excerpt: z.string().trim().max(2_000).default(""), bodyMarkdown: markdown, publishedDate: aoedDateSchema.nullable().default(null), authors: z.array(z.string().uuid()).max(30).default([]), tag: z.string().trim().max(120).nullable().default(null), assets: z.array(aoedAssetRefSchema).max(200).default([]), seo: aoedSeoSchema.default({ title: "", description: "" }), ...provenance, actor: actorSchema });
export const aoedEditorialDtoSchema = aoedEditorialInputSchema.omit({ actor: true, idempotencyKey: true }).extend({ id: z.string().uuid(), ...lifecycle });
export const aoedEditorialUpdateInputSchema = aoedEditorialInputSchema.extend({ expectedVersion: z.number().int().positive() }).omit({ idempotencyKey: true });

export const aoedDocumentInputSchema = z.object({ title: z.string().trim().min(1).max(300), slug: aoedPathSlugSchema, description: z.string().trim().max(20_000).default(""), documentKind: aoedDocumentKindSchema, documentDate: aoedDateSchema.nullable().default(null), tag: z.string().trim().max(120).nullable().default(null), authors: z.array(z.string().uuid()).max(30).default([]), organization: z.string().trim().max(300).nullable().default(null), pdfMediaId: z.string().uuid(), previewMediaId: z.string().uuid().nullable().default(null), relatedEditorialId: z.string().uuid().nullable().default(null), featured: z.boolean().default(false), sortOrder: z.number().int().min(0).max(10_000).default(0), ...provenance, actor: actorSchema });
export const aoedDocumentDtoSchema = aoedDocumentInputSchema.omit({ actor: true, idempotencyKey: true }).extend({ id: z.string().uuid(), ...lifecycle });
export const aoedDocumentUpdateInputSchema = aoedDocumentInputSchema.extend({ expectedVersion: z.number().int().positive() }).omit({ idempotencyKey: true });

export const aoedAuthorInputSchema = z.object({ slug: aoedPathSlugSchema, displayName: z.string().trim().min(1).max(300), role: z.string().trim().max(300).nullable().default(null), organization: z.string().trim().max(300).nullable().default(null), sourceId: z.string().trim().min(1).max(300), actor: actorSchema, idempotencyKey: z.string().trim().min(1).max(300).optional() });
export const aoedAuthorDtoSchema = aoedAuthorInputSchema.omit({ actor: true, idempotencyKey: true }).extend({ id: z.string().uuid(), ...lifecycle });
export const aoedAuthorUpdateInputSchema = aoedAuthorInputSchema.extend({ expectedVersion: z.number().int().positive() }).omit({ idempotencyKey: true });

export const aoedPageInputSchema = z.object({ title: z.string().trim().min(1).max(300), slug: aoedPathSlugSchema, summary: z.string().trim().max(2_000).default(""), bodyMarkdown: markdown, imageMediaId: z.string().uuid().nullable().default(null), seo: aoedSeoSchema.default({ title: "", description: "" }), ...provenance, actor: actorSchema });
export const aoedPageDtoSchema = aoedPageInputSchema.omit({ actor: true, idempotencyKey: true }).extend({ id: z.string().uuid(), ...lifecycle });
export const aoedPageUpdateInputSchema = aoedPageInputSchema.extend({ expectedVersion: z.number().int().positive() }).omit({ idempotencyKey: true });

export const aoedMediaInputSchema = z.object({ fileName: z.string().trim().min(1).max(300), mediaKind: aoedMediaKindSchema, mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]), byteSize: z.number().int().positive().max(32 * 1024 * 1024), width: z.number().int().positive().max(20_000).nullable().default(null), height: z.number().int().positive().max(20_000).nullable().default(null), sha256: z.string().regex(/^[a-f0-9]{64}$/), sourcePath: z.string().trim().min(1).max(600), legacyUrl: z.string().max(1_000).nullable().default(null), sourceKey: z.string().trim().min(1).max(300), actor: actorSchema });
export const aoedMediaDtoSchema = aoedMediaInputSchema.omit({ actor: true }).extend({ id: z.string().uuid(), objectKey: z.string(), createdAt: z.string() });
export const aoedListQuerySchema = listQuerySchema.extend({ kind: z.string().trim().max(80).optional(), tag: z.string().trim().max(120).optional(), year: z.coerce.number().int().min(1900).max(3000).optional() });

export type AoedEditorialInput = z.infer<typeof aoedEditorialInputSchema>; export type AoedEditorialDto = z.infer<typeof aoedEditorialDtoSchema>; export type AoedEditorialUpdateInput = z.infer<typeof aoedEditorialUpdateInputSchema>;
export type AoedDocumentInput = z.infer<typeof aoedDocumentInputSchema>; export type AoedDocumentDto = z.infer<typeof aoedDocumentDtoSchema>; export type AoedDocumentUpdateInput = z.infer<typeof aoedDocumentUpdateInputSchema>;
export type AoedAuthorInput = z.infer<typeof aoedAuthorInputSchema>; export type AoedAuthorDto = z.infer<typeof aoedAuthorDtoSchema>; export type AoedAuthorUpdateInput = z.infer<typeof aoedAuthorUpdateInputSchema>;
export type AoedPageInput = z.infer<typeof aoedPageInputSchema>; export type AoedPageDto = z.infer<typeof aoedPageDtoSchema>; export type AoedPageUpdateInput = z.infer<typeof aoedPageUpdateInputSchema>;
export type AoedMediaInput = z.infer<typeof aoedMediaInputSchema>; export type AoedMediaDto = z.infer<typeof aoedMediaDtoSchema>;
export type AoedListQuery = z.infer<typeof aoedListQuerySchema>;
