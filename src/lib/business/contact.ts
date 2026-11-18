import type { VenueContentInput } from "@lukespace-cms/client";
import type { Locale } from "../i18n/locale";
// Initial contacts confirmed by the user. Explicit CMS fields can now replace them.
export const shopPhones = [
  { display: "098 983 8037", e164: "+66989838037" },
  { display: "092 279 1890", e164: "+66922791890" },
];

// The owner's contact brief assigns this line to venue, marketing and events.
export const eventTeamPhone = { display: "085 066 4451", e164: "+66850664451" };

// The CMS supplies the numbers. Match the roles from the owner’s contact brief
// by number so reordering the CMS fields cannot mislabel a line.
const venuePhoneLabels: Partial<Record<string, Record<Locale, string>>> = {
  "+66659956963": { th: "คาเฟ่", en: "Café" },
  "+66894246908": { th: "ฟาร์มสัตว์", en: "Animal farm" },
  [eventTeamPhone.e164]: {
    th: "สถานที่ การตลาด และกิจกรรมสัมพันธ์",
    en: "Venue, marketing & events",
  },
};

export function venuePhoneLabel(e164: string, locale: Locale) {
  return venuePhoneLabels[e164]?.[locale];
}

export function venuePhones(
  content?: Pick<
    VenueContentInput,
    "phoneE164" | "additionalPhoneE164s"
  > | null,
) {
  if (!content) return [];
  const numbers = [
    content.phoneE164,
    ...(content.additionalPhoneE164s ?? [shopPhones[1].e164]),
  ];
  return [
    ...new Set(
      numbers.filter(
        (number): number is string =>
          !!number && /^\+[1-9]\d{7,14}$/.test(number),
      ),
    ),
  ].map((e164) => ({
    e164,
    display: e164.replace(/^\+66(\d{2})(\d{3})(\d{4})$/, "0$1 $2 $3"),
  }));
}
