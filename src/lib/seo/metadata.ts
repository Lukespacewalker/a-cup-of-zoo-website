import type { PublicVenueDto } from "@lukespace-cms/client";
import { hoursAreStructured } from "../business/format-hours";

export function pageTitle(title: string) {
  return title === "A Cup of Zoo" ? title : `${title} · A Cup of Zoo`;
}

export function cafeJsonLd(venue: PublicVenueDto) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: venue.content.displayName,
  };
  if (venue.content.addressLine) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: venue.content.addressLine,
      addressCountry: "TH",
    };
  }
  if (venue.content.phoneE164) data.telephone = venue.content.phoneE164;
  if (hoursAreStructured(venue.content.hoursVerification)) {
    data.openingHoursSpecification = venue.content.regularHours.filter((entry) => !entry.closed).map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.isoWeekday,
      opens: entry.opens,
      closes: entry.closes,
    }));
  }
  return data;
}
