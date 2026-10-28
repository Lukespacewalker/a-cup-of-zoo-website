import type { VenueItem } from "@lukespace-cms/client";
import source from "../../../reference-data/owner-feedback-2026-10-27/animal-roster.json";

// Initial content from the owner's brief; CMS mode reads the published roster instead.
export const animalRoster: VenueItem[] = source.animals.map(
  ({ id, title, titleEn, description, descriptionEn }, sortOrder) => ({
    id,
    title,
    titleEn,
    description,
    descriptionEn,
    mediaAssetId: `owner-${id}`,
    featured: false,
    visible: true,
    sortOrder,
  }),
);
