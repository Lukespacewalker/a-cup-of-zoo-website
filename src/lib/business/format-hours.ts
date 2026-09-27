import type { HoursEntry, VerificationStatus } from "@lukespace-cms/client";
import type { Locale } from "../i18n/locale";

const dayNames = ["", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

export function dayName(isoWeekday: HoursEntry["isoWeekday"], locale: Locale = "th") {
  const names = locale === "en" ? ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] : dayNames;
  return names[isoWeekday] ?? "";
}

export function formatDay(entry: HoursEntry, locale: Locale = "th") {
  return entry.closed || !entry.opens || !entry.closes ? (locale === "en" ? "Closed" : "ปิด") : `${entry.opens}–${entry.closes}`;
}

export function hoursAreStructured(status: VerificationStatus) {
  return status === "source_verified" || status === "owner_confirmed";
}
