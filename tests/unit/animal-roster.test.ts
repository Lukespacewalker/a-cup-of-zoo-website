import { expect, test } from "bun:test";
import { animalRoster } from "../../src/lib/content/animal-roster";
import source from "../../reference-data/owner-feedback-2026-10-27/animal-roster.json";

test("the Canva roster covers all 23 owner-confirmed animals without duplicate voting identities", async () => {
  expect(animalRoster).toHaveLength(23);
  expect(new Set(animalRoster.map(animal => animal.id)).size).toBe(23);
  expect(animalRoster.filter(animal => animal.id === "mine")).toHaveLength(1);
  expect(animalRoster.filter(animal => animal.id === "yin-yang")).toHaveLength(1);
  expect(animalRoster.filter(animal => animal.descriptionEn?.startsWith("Meerkat"))).toHaveLength(4);
  const coveredCards = source.animals.flatMap(animal => [animal.sourceCard, animal.alternateSourceCard].filter((card): card is number => card !== undefined)).sort((a, b) => a - b);
  expect(coveredCards).toEqual(Array.from({ length: 16 }, (_, i) => i + 17));
  for (const animal of animalRoster) expect(await Bun.file(new URL(`../../src/assets/animal-roster/${animal.id}.png`, import.meta.url)).exists()).toBe(true);
});
