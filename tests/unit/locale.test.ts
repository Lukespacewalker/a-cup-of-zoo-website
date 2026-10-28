import { expect, test } from "bun:test";
import { bilingualPaths, languageAlternates, localePath } from "../../src/lib/i18n/locale";
import { localizedMenu, localizedExtras } from "../../src/lib/i18n/menu";
import { localizedActivities } from "../../src/lib/i18n/activities";
import { passes, experiences, animalFood } from "../../src/lib/content/activities-catalog";
import { localizedVenue, englishSourceText } from "../../src/lib/i18n/venue";
import { fixtureVenue } from "../../src/lib/content/fixture-data";
import { cafeJsonLd } from "../../src/lib/seo/metadata";

test("all 47 English dishes retain source prices, every variant and provenance", () => {
  const thai = localizedMenu("th");
  const english = localizedMenu("en");
  expect(english.flatMap(section => section.items)).toHaveLength(47);
  english.forEach((section, index) => {
    expect(section.imagePages).toEqual(thai[index].imagePages);
    section.items.forEach((item, row) => {
      const source = thai[index].items[row];
      expect([item.code, item.price, item.sourcePage, item.variants?.map(v => v.price)])
        .toEqual([source.code, source.price, source.sourcePage, source.variants?.map(v => v.price)]);
      expect(item.name).toBeTruthy();
      expect(item.note).toBeTruthy();
    });
  });
  expect(JSON.stringify(english)).not.toMatch(/[\u0E00-\u0E7F]/);
  expect(localizedExtras("en").map(group => [group.sourcePage, group.items.map(item => item.price)]))
    .toEqual(localizedExtras("th").map(group => [group.sourcePage, group.items.map(item => item.price)]));
  expect(localizedExtras("en")[1].items.at(-1)?.name).toBe("Shrimp roe · 10 g");
});

test("English activities preserve all pass, food and promotional amounts", () => {
  const numeric = (value: unknown) => JSON.stringify(value).match(/\d+/g);
  expect(numeric(localizedActivities("en"))).toEqual(numeric(localizedActivities("th")));
  expect(JSON.stringify(localizedActivities("en"))).not.toMatch(/[\u0E00-\u0E7F]/);
  expect(localizedActivities("th").gardenSpots).toHaveLength(16);
  expect(localizedActivities("en").gardenSpots).toHaveLength(16);
});

test("activity translations follow item identity when the source catalogs are reordered", () => {
  // Reorder the real catalogs to catch translations accidentally coupled to array positions.
  const catalogs = [passes, experiences, animalFood];
  catalogs.forEach(catalog => Array.prototype.reverse.call(catalog));
  try {
    const english = localizedActivities("en");
    expect(english.passes.map(pass => [pass.id, pass.description, pass.benefits.at(-1)]))
      .toEqual([
        ["all-zone", "Visit both Indoor and Outdoor zones.", "Socks and an ema wooden wish plaque"],
        ["one-zone", "Choose either the Indoor or Outdoor group of zones.", "Outdoor choice: an ema wooden wish plaque included"],
      ]);
    expect(english.experiences.map(activity => [activity.id, activity.name, activity.unit, activity.note]))
      .toEqual([
        ["koi", "Feed the koi", "bag", "Watch and feed koi at the pond."],
        ["ema", "Write an ema wish plaque", "plaque", "Write your wish on a wooden plaque."],
        ["goat-milk", "Bottle-feed a miniature goat", "bottle", "Spend a little time with the goats."],
        ["alligator-gar", "Feed the alligator gar", "3 sticks", "Feed fish at the pond, following staff instructions."],
        ["basket", "Animal food basket", "basket", "Promotional price shown in the shop menu. Includes dog and cat food, goat food, grass for goats and fish food."],
      ]);
    expect(english.animalFood.map(food => [food.id, food.name, food.note]))
      .toEqual([
        ["alligator-gar", "Alligator gar food · 3 sticks", ""],
        ["goat-milk", "Goat milk · 1 bottle", ""],
        ["bird", "Bird food", "Limited availability each day"],
        ["fish-duck", "Fish and duck food", ""],
        ["grass", "Grass for goats and rabbits", ""],
        ["goat-rabbit", "Goat and rabbit food", ""],
        ["dog-cat", "Dog and cat food", ""],
      ]);
  } finally {
    catalogs.forEach(catalog => Array.prototype.reverse.call(catalog));
  }
});

test("locale equivalents preserve hashes and exclude untranslated news from alternates", () => {
  for (const path of bilingualPaths) {
    expect(localePath(localePath(`${path}#section`, "en"), "th")).toBe(`${path}#section`);
    expect(languageAlternates(path, "https://cafe.example").map(item => item.url))
      .toEqual([`https://cafe.example${path}`, `https://cafe.example/en${path}`]);
  }
  expect(localePath("/news/", "en")).toBe("/news/");
  expect(languageAlternates("/news/", "https://cafe.example")).toEqual([]);
});

test("known venue translations preserve hours/contact/map and unknown Thai updates stay explicit", () => {
  const english = localizedVenue(fixtureVenue, "en")!;
  expect(english.content.regularHours).toEqual(fixtureVenue.content.regularHours);
  expect(english.content.mapsUrl).toBe(fixtureVenue.content.mapsUrl);
  expect(english.content.phoneE164).toBe(fixtureVenue.content.phoneE164);
  expect(JSON.stringify([english.content.faqs, english.content.activities, english.content.addressLine])).not.toMatch(/[\u0E00-\u0E7F]/);
  const update = structuredClone(fixtureVenue);
  update.content.addressLine = "ที่อยู่ใหม่ ยังไม่มีคำแปล";
  update.content.faqs[0].answer = "ข้อความใหม่จากร้าน";
  update.content.activities[0].description = "กิจกรรมใหม่";
  const pending = localizedVenue(update, "en")!;
  expect(pending.content.addressLine).toBeNull();
  expect(pending.content.faqs[0].answer).toContain("not yet available");
  expect(pending.content.activities).toHaveLength(2);
  expect(englishSourceText("New English update", "fallback")).toBe("New English update");
  expect(localizedVenue(update, "th")).toBe(update);
});

test("English business metadata shares Thai identity on the configured origin", () => {
  const data = cafeJsonLd(localizedVenue(fixtureVenue, "en")!, new URL("https://cafe.example"), undefined, "en");
  expect(data).toMatchObject({ "@id": "https://cafe.example/#cafe", url: "https://cafe.example/en/", menu: "https://cafe.example/en/menu/" });
  expect(data.address.streetAddress).not.toMatch(/[\u0E00-\u0E7F]/);
});
