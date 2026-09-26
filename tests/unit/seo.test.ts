import { expect, test } from "bun:test";
import { cafeJsonLd, configuredSite, sitemapXml } from "../../src/lib/seo/metadata";
import { fixtureVenue } from "../../src/lib/content/fixture-data";

test("business hours use Google-supported day names and omit closed days", () => {
  const data = cafeJsonLd(fixtureVenue);
  expect(data.openingHoursSpecification).toEqual([
    { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Monday", opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Wednesday", opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Thursday", opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Friday", opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Saturday", opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Sunday", opens: "10:00", closes: "19:00" },
  ]);
});

test("unverified or incomplete hours are not advertised as structured opening hours", () => {
  const venue = structuredClone(fixtureVenue);
  venue.content.hoursVerification = "user_provided";
  expect(cafeJsonLd(venue)).not.toHaveProperty("openingHoursSpecification");
  venue.content.hoursVerification = "source_verified";
  venue.content.regularHours = [{ isoWeekday: 1, closed: false, opens: null, closes: null }];
  expect(cafeJsonLd(venue)).not.toHaveProperty("openingHoursSpecification");
});

test("placeholder domains do not become public site URLs", () => {
  expect(configuredSite(undefined)).toBeNull();
  expect(configuredSite(new URL("https://acupofzoo.invalid"))).toBeNull();
  expect(configuredSite(new URL("https://cafe.example"))?.href).toBe("https://cafe.example/");
});

test("sitemap uses the configured domain and produces XML-safe URLs", () => {
  const xml = sitemapXml(new URL("https://cafe.example"), ["/", "/menu/", "/news/weekend/?a=1&b=2"]);
  expect(xml).toContain("<loc>https://cafe.example/</loc>");
  expect(xml).toContain("<loc>https://cafe.example/menu/</loc>");
  expect(xml).toContain("<loc>https://cafe.example/news/weekend/?a=1&amp;b=2</loc>");
  expect(xml).not.toContain(".invalid");
});

test("business links share one identity without inventing ratings or prices", () => {
  const data = cafeJsonLd(fixtureVenue, new URL("https://cafe.example"), "https://cafe.example/shop.jpg");
  expect(data).toMatchObject({
    "@type": "CafeOrCoffeeShop",
    "@id": "https://cafe.example/#cafe",
    url: "https://cafe.example/",
    menu: "https://cafe.example/menu/",
    image: "https://cafe.example/shop.jpg",
    sameAs: ["https://www.facebook.com/Acupofzoocafe/"],
  });
  expect(data).not.toHaveProperty("aggregateRating");
  expect(data).not.toHaveProperty("priceRange");
  expect(data).not.toHaveProperty("geo");
});

test("map remains available before the domain is set without advertising an external menu", () => {
  const data = cafeJsonLd(fixtureVenue);
  expect(data).not.toHaveProperty("menu");
  expect(data.hasMap).toContain("!1s0x311d832435d52fff:0xbc56f5d0ec0344ad");
  expect(data).not.toHaveProperty("url");
});

test("both user-selected public phone numbers survive a missing or different CMS primary", () => {
  for (const phone of [null, "+66922791890", "+66921234567"]) {
    const venue = structuredClone(fixtureVenue);
    venue.content.phoneE164 = phone;
    expect(cafeJsonLd(venue).telephone).toEqual(["+66989838037", "+66922791890"]);
  }
});
