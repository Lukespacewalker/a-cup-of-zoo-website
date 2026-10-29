import type { VenueItem } from "@lukespace-cms/client";
import source from "../../../reference-data/owner-feedback-2026-10-27/animal-roster.json";
import imageFocus from "../../../reference-data/owner-feedback-2026-10-27/animal-image-focus.json";

// Initial content from the owner's brief; CMS mode reads the published roster instead.
export const animalRoster: VenueItem[] = source.animals.map(
  ({ id, title, titleEn, description, descriptionEn }, sortOrder) => ({
    id,
    title,
    titleEn,
    description,
    descriptionEn,
    mediaAssetId: id === "mee-chok" ? "owner-meerkat-source" : `owner-${id}`,
    imageFocus: imageFocus[id as keyof typeof imageFocus],
    featured: false,
    visible: true,
    sortOrder,
  }),
);
