import { admissionSummary, passes, animalZones, experiences, animalFood, gardenSpots } from "../content/activities-catalog";
import type { Locale } from "./locale";

export const englishAdmission = "No admission fee for the café area; a minimum of 1 food or drink order per person applies. Animal zones require a One Zone Pass at 249 THB or an All Zone Pass at 349 THB.";
const descriptions = ["Choose either the Indoor or Outdoor group of zones.", "Visit both Indoor and Outdoor zones."];
const benefits = [
  ["Unlimited time in your chosen zones during opening hours", "95 THB discount on food and drinks", "Indoor choice: socks included", "Outdoor choice: an ema wooden wish plaque included"],
  ["Access to all zones with unlimited time during opening hours", "95 THB discount on food and drinks", "An animal food basket worth 120 THB", "Socks and an ema wooden wish plaque"],
];
const experienceText = [
  ["Animal food basket", "basket", "Promotional price shown in the shop menu. Includes dog and cat food, goat food, grass for goats and fish food."],
  ["Feed the alligator gar", "3 sticks", "Feed fish at the pond, following staff instructions."],
  ["Bottle-feed a miniature goat", "bottle", "Spend a little time with the goats."],
  ["Write an ema wish plaque", "plaque", "Write your wish on a wooden plaque."],
  ["Feed the koi", "bag", "Watch and feed koi at the pond."],
];
const foodNames = ["Dog and cat food", "Goat and rabbit food", "Grass for goats and rabbits", "Fish and duck food", "Bird food", "Goat milk · 1 bottle", "Alligator gar food · 3 sticks"];
const spots = ["Café and restaurant", "Indoor Pet Zone", "Kurama Garden", "Nine-tailed fox fortune sticks", "Alligator gar pond", "Little Farm Friends", "Japanese garden", "Four-direction lotus", "Koi pond", "Fox house", "Rabbit house", "As You Wish Garden", "Miniature goat house", "Red Japanese bridge", "Scenic rowing boat pier"];

export function localizedActivities(locale: Locale) {
  if (locale === "th") return { admissionSummary, passes, animalZones, experiences, animalFood, gardenSpots };
  return {
    admissionSummary: englishAdmission,
    passes: passes.map((pass, index) => ({ ...pass, description: descriptions[index], benefits: benefits[index] })),
    animalZones: {
      indoor: ["Dog and cat room", "Meerkat and prairie dog zone", "Civet zone"],
      outdoor: ["Fox house (Red Fox, Marble Fox and Arctic Fox)", "Miniature goat house", "Rabbit house"],
    },
    experiences: experiences.map((activity, index) => ({ ...activity, name: experienceText[index][0], unit: experienceText[index][1], note: experienceText[index][2] })),
    animalFood: animalFood.map((food, index) => ({ ...food, name: foodNames[index], note: food.note ? "Limited availability each day" : "" })),
    gardenSpots: spots,
  };
}
