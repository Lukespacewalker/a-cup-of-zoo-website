// Generated from @lukespace-cms/contracts at 381d8077d62fed9eae5d61bf14910b1282beee31. Do not edit.
import { z } from "zod";

export const verificationStatusSchema = z.enum(["user_provided", "source_verified", "owner_confirmed", "unknown"]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

const clockTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "เวลาต้องเป็น HH:mm");
const mapsHosts = new Set(["maps.app.goo.gl", "goo.gl", "maps.google.com", "www.google.com", "google.com"]);
const facebookHosts = new Set(["facebook.com", "www.facebook.com", "m.facebook.com"]);

export type HoursEntry = {
  isoWeekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  closed: boolean;
  opens: string | null;
  closes: string | null;
};

export type HoursException = {
  date: string;
  closed: boolean;
  opens: string | null;
  closes: string | null;
  note: string;
};

export type VenueItem = {
  id: string;
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
  mediaAssetId: string | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
};

export type VenueContentInput = {
  displayName: string;
  locationLabel: string;
  addressLine: string | null;
  phoneE164: string | null;
  additionalPhoneE164s?: string[];
  mapsUrl: string | null;
  facebookUrl: string | null;
  timezone: "Asia/Bangkok";
  regularHours: HoursEntry[];
  hoursExceptions: HoursException[];
  holidayNote: string | null;
  hoursVerification: VerificationStatus;
  admissionText: string | null;
  animals: VenueItem[];
  activities: VenueItem[];
  menuHighlights: VenueItem[];
  faqs: Array<{ id: string; question: string; answer: string }>;
};

export type VenueContentAdminDto = {
  id: "venue";
  version: number;
  draft: VenueContentInput;
  published: VenueContentInput | null;
  publishedVersion: number | null;
  publishedAt: string | null;
};

export type PublicVenueMedia = {
  id: string;
  url: string;
  altTh: string;
  width: number | null;
  height: number | null;
};

export type PublicVenueDto = {
  id: "venue";
  version: number;
  content: VenueContentInput;
  publishedAt: string;
  media: PublicVenueMedia[];
};

const httpsAllowlist = (hosts: Set<string>) => z.string().trim().max(300).nullable().superRefine((value, context) => {
  if (value === null) return;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    context.addIssue({ code: "custom", message: "ลิงก์ไม่ถูกต้อง" });
    return;
  }
  if (url.protocol !== "https:") context.addIssue({ code: "custom", message: "ลิงก์ต้องเป็น HTTPS" });
  if (!hosts.has(url.hostname)) context.addIssue({ code: "custom", message: "โฮสต์ของลิงก์ไม่ได้อยู่ในรายการที่อนุญาต" });
});

const hoursShape = {
  closed: z.boolean(),
  opens: clockTimeSchema.nullable(),
  closes: clockTimeSchema.nullable(),
};

function refineHours(entry: { closed: boolean; opens: string | null; closes: string | null }, context: z.RefinementCtx) {
  if (entry.closed) {
    if (entry.opens !== null || entry.closes !== null) context.addIssue({ code: "custom", message: "วันที่ปิดต้องไม่มีเวลาเปิดหรือเวลาปิด" });
    return;
  }
  if (entry.opens === null || entry.closes === null) {
    context.addIssue({ code: "custom", message: "วันที่เปิดต้องมีทั้งเวลาเปิดและเวลาปิด" });
    return;
  }
  if (entry.opens >= entry.closes) context.addIssue({ code: "custom", message: "เวลาเปิดต้องอยู่ก่อนเวลาปิด" });
}

const hoursEntrySchema = z.object({
  isoWeekday: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7)]),
  ...hoursShape,
}).superRefine(refineHours);

const hoursExceptionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(isRealCalendarDate, "ต้องเป็นวันที่ในปฏิทินจริง"),
  ...hoursShape,
  note: z.string().trim().min(1).max(300),
}).superRefine(refineHours);

const venueItemSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(600),
  titleEn: z.string().trim().max(120).optional(),
  descriptionEn: z.string().trim().max(600).optional(),
  mediaAssetId: z.string().trim().min(1).max(80).nullable(),
  featured: z.boolean(),
  visible: z.boolean(),
  sortOrder: z.number().int().nonnegative().max(10_000),
});

const venueItemsSchema = z.array(venueItemSchema).max(100).refine(items => new Set(items.map(item => item.id)).size === items.length, "รหัสรายการต้องไม่ซ้ำ");

export const venueContentInputSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  locationLabel: z.string().trim().min(1).max(120),
  addressLine: z.string().trim().min(1).max(200).nullable(),
  phoneE164: z.string().regex(/^\+[1-9]\d{7,14}$/).nullable(),
  additionalPhoneE164s: z.array(z.string().regex(/^\+[1-9]\d{7,14}$/)).max(4).optional(),
  mapsUrl: httpsAllowlist(mapsHosts),
  facebookUrl: httpsAllowlist(facebookHosts),
  timezone: z.literal("Asia/Bangkok"),
  regularHours: z.array(hoursEntrySchema).length(7),
  hoursExceptions: z.array(hoursExceptionSchema).max(100),
  holidayNote: z.string().trim().min(1).max(500).nullable(),
  hoursVerification: verificationStatusSchema,
  admissionText: z.string().trim().min(1).max(300).nullable(),
  animals: venueItemsSchema,
  activities: venueItemsSchema,
  menuHighlights: venueItemsSchema,
  faqs: z.array(z.object({
    id: z.string().trim().min(1).max(80),
    question: z.string().trim().min(1).max(200),
    answer: z.string().trim().min(1).max(800),
  })).max(100),
}).superRefine((value, context) => {
  const weekdays = value.regularHours.map((entry) => entry.isoWeekday);
  if (new Set(weekdays).size !== weekdays.length) context.addIssue({ code: "custom", message: "วันในสัปดาห์ต้องไม่ซ้ำ", path: ["regularHours"] });
  const dates = value.hoursExceptions.map((entry) => entry.date);
  if (new Set(dates).size !== dates.length) context.addIssue({ code: "custom", message: "วันพิเศษต้องไม่ซ้ำ", path: ["hoursExceptions"] });
}) satisfies z.ZodType<VenueContentInput>;

export const saveVenueDraftSchema = z.object({
  content: venueContentInputSchema,
  expectedVersion: z.number().int().positive(),
});

export const publishVenueSchema = z.object({
  expectedVersion: z.number().int().positive(),
});

export function isRealCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
