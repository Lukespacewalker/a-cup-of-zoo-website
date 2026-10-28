// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";
import { actorSchema, localeSchema } from "./shared";

export const corporateEnquiryStatuses = ["new", "contacted", "qualified", "quoted", "won", "lost"] as const;
export const corporateEnquiryStatusSchema = z.enum(corporateEnquiryStatuses);

export const corporateEnquiryPreferredContactMethodSchema = z.enum(["email", "phone", "line"]);
export const corporateEnquiryProductInterestSchema = z.enum([
  "bags_accessories",
  "home_textiles",
  "corporate_gifts",
  "oem_custom",
]);

const requiredDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Required date must use YYYY-MM-DD").refine((value) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}, "Required date must be a valid calendar date");

export const corporateEnquiryInputSchema = z.object({
  organizationName: z.string().trim().min(1).max(180),
  contactName: z.string().trim().min(1).max(180),
  email: z.string().email().max(254),
  phoneOrLine: z.string().trim().min(1).max(120),
  occasionProjectType: z.string().trim().min(1).max(180),
  productInterests: z.array(corporateEnquiryProductInterestSchema).min(1).max(4),
  estimatedQuantity: z.coerce.number().int().positive(),
  budgetRange: z.string().trim().min(1).max(160),
  requiredDate: requiredDateSchema,
  specialRequirements: z.string().trim().min(1).max(5000),
  preferredContactMethod: corporateEnquiryPreferredContactMethodSchema,
  consentToContact: z.literal(true),
  locale: localeSchema,
});

export const publicCorporateEnquirySubmissionSchema = corporateEnquiryInputSchema.extend({
  website: z.string().max(200).default(""),
  formStartedAt: z.coerce.number().int().positive(),
});

export const corporateEnquiryAttachmentSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  byteSize: z.number().int().positive(),
});

export const corporateEnquiryDtoSchema = corporateEnquiryInputSchema.extend({
  id: z.string().uuid(),
  status: corporateEnquiryStatusSchema,
  version: z.number().int().positive(),
  attachment: corporateEnquiryAttachmentSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const corporateEnquiryListQuerySchema = z.object({
  status: corporateEnquiryStatusSchema.optional(),
  search: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
});

export const updateCorporateEnquiryStatusInputSchema = z.object({
  status: corporateEnquiryStatusSchema,
  expectedVersion: z.number().int().positive(),
  actor: actorSchema,
});

export const corporateEnquiryCreatedSchema = z.object({
  id: z.string().uuid(),
  status: z.literal("new"),
  submittedAt: z.string(),
});

export const corporateEnquiryUploadMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
export const corporateEnquiryMaxFileBytes = 5 * 1024 * 1024;
export const corporateEnquiryMaxRequestBytes = corporateEnquiryMaxFileBytes + 128 * 1024;

export type CorporateEnquiryStatus = z.infer<typeof corporateEnquiryStatusSchema>;
export type CorporateEnquiryPreferredContactMethod = z.infer<typeof corporateEnquiryPreferredContactMethodSchema>;
export type CorporateEnquiryProductInterest = z.infer<typeof corporateEnquiryProductInterestSchema>;
export type CorporateEnquiryInput = z.infer<typeof corporateEnquiryInputSchema>;
export type PublicCorporateEnquirySubmission = z.infer<typeof publicCorporateEnquirySubmissionSchema>;
export type CorporateEnquiryAttachment = z.infer<typeof corporateEnquiryAttachmentSchema>;
export type CorporateEnquiryDto = z.infer<typeof corporateEnquiryDtoSchema>;
export type CorporateEnquiryListQuery = z.infer<typeof corporateEnquiryListQuerySchema>;
export type UpdateCorporateEnquiryStatusInput = z.infer<typeof updateCorporateEnquiryStatusInputSchema>;
export type CorporateEnquiryCreated = z.infer<typeof corporateEnquiryCreatedSchema>;
