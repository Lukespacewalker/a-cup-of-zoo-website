import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
import { join } from "node:path";
import source from "../reference-data/owner-feedback-2026-10-27/animal-roster.json";

// Extract the individual source figures from the archived Canva sheets.
// No synthesis, retouching, upscaling, or replacement of the source animals.
const output = join(import.meta.dir, "../src/assets/animal-roster");
await mkdir(output, { recursive: true });
for (const animal of source.animals) {
  const input = join(import.meta.dir, "../reference-data/owner-feedback-2026-10-27/assets", animal.sourceImage);
  const destination = join(output, animal.id + ".png");
  if (animal.crop) await sharp(input).extract(animal.crop).png().toFile(destination);
  else await copyFile(input, destination);
}
console.log(`Extracted ${source.animals.length} source figures; original sheets retained.`);
