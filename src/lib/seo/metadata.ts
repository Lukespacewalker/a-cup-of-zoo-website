import type { PublicVenueDto } from "@lukespace-cms/client";
import { hoursAreStructured } from "../business/format-hours";
import { allowedExternalUrl } from "../business/links";
import { venuePhones } from "../business/contact";
import { socialProfiles } from "../business/social";
import { localePath, type Locale } from "../i18n/locale";

const weekDays = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Ignore placeholders; callers separately decide whether this request is public.
export function configuredSite(site: URL | undefined) {
  return site && !site.hostname.endsWith(".invalid") ? new URL("/", site) : null;
}

export function sitemapXml(site: URL, paths: string[]) {
  const urls = paths.map((path) => {
    const url = new URL(path, site).href.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    return `<url><loc>${url}</loc></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
}

export function pageTitle(title: string) {
  return title === "A Cup of Zoo" ? title : `${title} · A Cup of Zoo`;
}

export function cafeJsonLd(venue: PublicVenueDto, site: URL | null = null, image?: string, locale: Locale = "th") {
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
  const phones = venuePhones(venue.content).map(phone => phone.e164);
  if (phones.length) data.telephone = phones;
  data.sameAs = socialProfiles(venue.content.facebookUrl).map(profile => profile.url);
  const maps = allowedExternalUrl(venue.content.mapsUrl, "maps");
  if (maps) data.hasMap = maps;
  if (site) {
    data["@id"] = new URL("/#cafe", site).href;
    data.url = new URL(localePath("/", locale), site).href;
    data.menu = new URL(localePath("/menu/", locale), site).href;
  }
  if (image) data.image = image;
  if (hoursAreStructured(venue.content.hoursVerification)) {
    const hours = venue.content.regularHours.filter((entry) => !entry.closed && entry.opens && entry.closes).map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${weekDays[entry.isoWeekday]}`,
      opens: entry.opens,
      closes: entry.closes,
    }));
    if (hours.length) data.openingHoursSpecification = hours;
  }
  return data;
}
