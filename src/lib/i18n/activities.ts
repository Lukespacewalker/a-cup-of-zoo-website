import {
  admissionSummary,
  passes,
  animalZones,
  experiences,
  animalFood,
  gardenSpots,
} from "../content/activities-catalog";
import type { Locale } from "./locale";

export const englishAdmission =
  "No admission fee for the café area; a minimum of 1 food or drink order per person applies. Animal zones require a One Zone Pass at 249 THB or an All Zone Pass at 349 THB.";
// Exhaustive ID records preserve the menu translations independently of source row order.
const passText = {
  "one-zone": {
    description: "Choose either the Indoor or Outdoor group of zones.",
    benefits: [
      "Unlimited time in your chosen zones during opening hours",
      "95 THB discount on food and drinks",
      "Indoor choice: socks included",
      "Outdoor choice: an ema wooden wish plaque included",
    ],
  },
  "all-zone": {
    description: "Visit both Indoor and Outdoor zones.",
    benefits: [
      "Access to all zones with unlimited time during opening hours",
      "95 THB discount on food and drinks",
      "An animal food basket worth 120 THB",
      "Socks and an ema wooden wish plaque",
    ],
  },
} satisfies Record<
  (typeof passes)[number]["id"],
  { description: string; benefits: string[] }
>;
const experienceText = {
  basket: {
    name: "Animal food basket",
    unit: "basket",
    note: "Promotional price shown in the shop menu. Includes dog and cat food, goat food, grass for goats and fish food.",
  },
  "alligator-gar": {
    name: "Feed the alligator gar",
    unit: "3 sticks",
    note: "Feed fish at the pond, following staff instructions.",
  },
  "goat-milk": {
    name: "Bottle-feed a miniature goat",
    unit: "bottle",
    note: "Spend a little time with the goats.",
  },
  ema: {
    name: "Write an ema wish plaque",
    unit: "plaque",
    note: "Write your wish on a wooden plaque.",
  },
  koi: {
    name: "Feed the koi",
    unit: "bag",
    note: "Watch and feed koi at the pond.",
  },
} satisfies Record<
  (typeof experiences)[number]["id"],
  { name: string; unit: string; note: string }
>;
const foodText = {
  "dog-cat": { name: "Dog and cat food", note: "" },
  "goat-rabbit": { name: "Goat and rabbit food", note: "" },
  grass: { name: "Grass for goats and rabbits", note: "" },
  "fish-duck": { name: "Fish and duck food", note: "" },
  bird: { name: "Bird food", note: "Limited availability each day" },
  "goat-milk": { name: "Goat milk · 1 bottle", note: "" },
  "alligator-gar": { name: "Alligator gar food · 3 sticks", note: "" },
} satisfies Record<
  (typeof animalFood)[number]["id"],
  { name: string; note: string }
>;
const spots = [
  "Café and restaurant",
  "Indoor Pet Zone",
  "Kurama Garden",
  "Nine-tailed fox fortune sticks",
  "Alligator gar pond",
  "Little Farm Friends",
  "Japanese garden",
  "Four-direction lotus",
  "Koi pond",
  "Fox house",
  "Rabbit house",
  "As You Wish Garden",
  "Miniature goat house",
  "Red Japanese bridge",
  "Scenic rowing boat pier",
  "Desert garden",
];

export function localizedActivities(locale: Locale) {
  if (locale === "th")
    return {
      admissionSummary,
      passes,
      animalZones,
      experiences,
      animalFood,
      gardenSpots,
    };
  return {
    admissionSummary: englishAdmission,
    passes: passes.map((pass) => ({ ...pass, ...passText[pass.id] })),
    animalZones: {
      indoor: [
        "Dog and cat room",
        "Meerkat and prairie dog zone",
        "Civet zone",
      ],
      outdoor: [
        "Fox house (Red Fox, Marble Fox and Arctic Fox)",
        "Miniature goat house",
        "Rabbit house",
      ],
    },
    experiences: experiences.map((activity) => ({
      ...activity,
      ...experienceText[activity.id],
    })),
    animalFood: animalFood.map((food) => ({ ...food, ...foodText[food.id] })),
    gardenSpots: spots,
  };
}
