import type { VenueContentInput } from "@lukespace-cms/client";
// Initial contacts confirmed by the user. Explicit CMS fields can now replace them.
export const shopPhones = [
  { display: "098 983 8037", e164: "+66989838037" },
  { display: "092 279 1890", e164: "+66922791890" },
];

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
