import type { PublicVenueDto } from "@lukespace-cms/client";
import { fixtureVenue } from "../content/fixture-data";
import { englishAdmission } from "./activities";
import type { Locale } from "./locale";

// Known source strings only: changed CMS Thai text is never silently treated as translated.
const source = fixtureVenue.content;
const translations: Record<string, string> = {
  [source.locationLabel]: "Khlong 6, Pathum Thani",
  [source.addressLine!]:
    "27/8 Moo 3, Liap Khlong L 5–6 Road, Soi Sutthiphan 11, Khlong Hok, Khlong Luang, Pathum Thani 12120, Thailand",
  [source.holidayNote!]:
    "Open as usual when Tuesday falls on a public holiday. Check the café's announcements before travelling.",
  [source.admissionText!]: englishAdmission,
};
const faqText = [
  [
    "Are you open on Tuesdays?",
    "Normally closed on Tuesdays. When Tuesday falls on a public holiday, the café opens as usual. Check the café's announcements before travelling.",
  ],
  ["How much is admission?", englishAdmission],
  [
    "Do children need a ticket?",
    "Children under 100 cm tall enter free and must be accompanied by at least 1 adult taking part in the activity. Children entering Indoor zones must buy new socks for 49 THB.",
  ],
  [
    "How can I call the café?",
    "Use the call buttons above to contact the café.",
  ],
  [
    "Is parking available?",
    "The information provided lists parking, but the number of spaces and any parking charges have not been confirmed.",
  ],
];
source.faqs.forEach((faq, index) => {
  translations[faq.question] = faqText[index][0];
  translations[faq.answer] = faqText[index][1];
});
const spaceText = [
  [
    "Garden seating",
    "Relax among the trees, then explore the Japanese garden and other corners of the café.",
  ],
  ["Inside the café", "A look at the indoor seating area."],
  [
    "By the water",
    "Watch ducks and fish by the water. Fish and duck food is available to buy at the café.",
  ],
];
source.activities.forEach((activity, index) => {
  translations[activity.title] = spaceText[index][0];
  translations[activity.description] = spaceText[index][1];
});

export function englishSourceText(
  text: string | null | undefined,
  fallback: string,
) {
  if (!text) return fallback;
  return translations[text] ?? (/[\u0E00-\u0E7F]/.test(text) ? fallback : text);
}
export function localizedVenue(
  venue: PublicVenueDto | null,
  locale: Locale,
): PublicVenueDto | null {
  if (!venue || locale === "th") return venue;
  return {
    ...venue,
    content: {
      ...venue.content,
      displayName: englishSourceText(venue.content.displayName, "A Cup of Zoo"),
      locationLabel: englishSourceText(
        venue.content.locationLabel,
        "See the map for the café's location",
      ),
      addressLine: englishSourceText(venue.content.addressLine, "") || null,
      holidayNote: englishSourceText(
        venue.content.holidayNote,
        "Check café announcements for current holiday opening hours.",
      ),
      admissionText: englishSourceText(
        venue.content.admissionText,
        "Check current admission details with the café.",
      ),
      faqs: venue.content.faqs.map((faq) => ({
        ...faq,
        question: englishSourceText(faq.question, "More information"),
        answer: englishSourceText(
          faq.answer,
          "Contact the café for current details; an English translation of this update is not yet available.",
        ),
      })),
      activities: venue.content.activities
        .filter(
          (activity) =>
            translations[activity.title] && translations[activity.description],
        )
        .map((activity) => ({
          ...activity,
          title: translations[activity.title],
          description: translations[activity.description],
        })),
    },
  };
}

export const englishMediaAlt: Record<string, string> = {
  "cat-portrait": "An orange cat sitting on a chair at A Cup of Zoo",
  "cats-and-dog": "Two cats resting together with the café's dog",
  "ducks-pond": "Ducks swimming in the café's green pond",
  "cafe-garden-seating": "A table by the window overlooking the café garden",
  "cafe-interior-gallery":
    "Indoor café seating with animal artwork and decorations",
  drinks: "Colourful drinks and a dessert from the café",
  croissant: "A croissant with fox decorations from the café",
  "entrance-promo-banner":
    "The entrance to A Cup of Zoo with the café's signs and animal decorations",
};
