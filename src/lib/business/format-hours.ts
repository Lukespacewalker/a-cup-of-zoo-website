import type { HoursEntry, VerificationStatus } from "@lukespace-cms/client";

const dayNames = ["", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

export function dayName(isoWeekday: HoursEntry["isoWeekday"]) {
  return dayNames[isoWeekday] ?? "";
}

export function formatDay(entry: HoursEntry) {
  return entry.closed || !entry.opens || !entry.closes ? "ปิด" : `${entry.opens}–${entry.closes}`;
}

export function hoursAreStructured(status: VerificationStatus) {
  return status === "source_verified" || status === "owner_confirmed";
}
