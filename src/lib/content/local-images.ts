import garden from "../../assets/site/cafe-garden-seating.png";
import interior from "../../assets/site/cafe-interior-gallery.png";
import cat from "../../assets/site/cat-portrait.png";
import catsAndDog from "../../assets/site/cats-and-dog.png";
import croissant from "../../assets/site/croissant.png";
import drinks from "../../assets/site/drinks.png";
import ducks from "../../assets/site/ducks-pond.png";
import entrance from "../../assets/site/entrance-promo-banner.png";
import pond from "../../assets/site/pond-promo-graphic.png";
import type { ImageMetadata } from "astro";
import meerkatSource from "../../../reference-data/owner-feedback-2026-10-27/assets/asset-12.png";
const animalImages = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/animal-roster/*.png",
  { eager: true },
);

export const localImages = {
  "owner-meerkat-source": meerkatSource,
  ...Object.fromEntries(
    Object.entries(animalImages).map(([path, image]) => [
      `owner-${path.split("/").at(-1)!.replace(".png", "")}`,
      image.default,
    ]),
  ),
  "cafe-garden-seating": garden,
  "cafe-interior-gallery": interior,
  "cat-portrait": cat,
  "cats-and-dog": catsAndDog,
  croissant,
  drinks,
  "ducks-pond": ducks,
  "entrance-promo-banner": entrance,
  "pond-promo-graphic": pond,
};
