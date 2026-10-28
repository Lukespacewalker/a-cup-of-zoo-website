// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";

export const assetUploadMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const assetMaxFileBytes = 5 * 1024 * 1024;

export const createAssetMetadataSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(assetUploadMimeTypes),
  byteSize: z.number().int().min(1).max(assetMaxFileBytes),
  width: z.number().int().positive().max(20_000),
  height: z.number().int().positive().max(20_000),
  altTh: z.string().trim().min(1).max(300),
  altEn: z.string().trim().min(1).max(300),
  sourceKey: z.string().trim().min(1).max(180).optional(),
});

export const assetDtoSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  objectKey: z.string(),
  mimeType: z.string(),
  byteSize: z.number().int().nonnegative(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  altTh: z.string(),
  altEn: z.string(),
  createdAt: z.string(),
});

export type AssetDto = z.infer<typeof assetDtoSchema>;
export type CreateAssetMetadata = z.infer<typeof createAssetMetadataSchema>;
