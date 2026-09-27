import { menuCatalog, sandwichExtras } from "../content/menu-catalog";
import type { Locale } from "./locale";

// Translate source text only. Prices, codes, portions and source images are inherited.
export const englishDishes: Record<string, [string, string]> = {
  SIG1: ["Cat Rice", "Herb fried rice with mackerel and side dishes. A dish for people."],
  SIG2: ["Dog Rice", "The café's fried rice with noodles and 3 kinds of pork. A dish for people."],
  SIG3: ["Parrot Salad (Lemongrass Salad)", "Lemongrass and herbs tossed with shrimp, minced pork and crispy fish."],
  A1: ["French Fries", "Crispy French fries."],
  A2: ["Hash Browns", "Fried potato hash browns."],
  A3: ["Mozzarella Sticks", "Crispy fried cheese sticks."],
  A4: ["Samurai Pork Gyoza", "Fried pork-filled gyoza."],
  A5: ["Clucking Chicken Combo", "A fried chicken combo."],
  A6: ["Crispy Chicken Cartilage", "Crispy fried chicken cartilage."],
  A7: ["Salt-Fried Chicken Wings", "Fried chicken wings seasoned with salt."],
  A11: ["Isan Crying Pork Neck", "Isan-style pork neck."],
  B1: ["Original Egg Sandwich", "Bread, scrambled egg and double cheese."],
  B2: ["Bacon & Double Cheese Egg Sandwich", "Scrambled egg, bacon and double cheese."],
  B3: ["Ham & Double Cheese Egg Sandwich", "Scrambled egg, ham and double cheese."],
  B4: ["Loaded Korean-Style Sandwich", "Fresh vegetables, egg, ham, shrimp roe and the café's sauce."],
  V1: ["Rainbow Farm Salad", "Fresh vegetables, boiled egg, shrimp roe and the café's dressing."],
  V2: ["Two-Tone Spicy Salad", "A spicy pork and shrimp salad."],
  V3: ["Spicy Seafood Glass Noodle Salad", "Glass noodles tossed with spicy dressing and seafood."],
  V4: ["Spicy Minced Pork Glass Noodle Salad", "Glass noodles tossed with spicy dressing and minced pork."],
  V5: ["Spicy Seafood Instant Noodle Salad", "Instant noodles tossed with spicy dressing and seafood."],
  V6: ["Spicy Minced Pork Instant Noodle Salad", "Instant noodles tossed with spicy dressing and minced pork."],
  V7: ["Spicy Mixed Seafood Salad", "Mixed seafood tossed with spicy dressing."],
  S1: ["Spaghetti with Minced Pork & Tomato Sauce", "Tomato sauce with minced pork."],
  S2: ["Spaghetti Carbonara", "Cream cheese sauce, bacon and ham."],
  S3: ["Spicy Seafood Spaghetti", "Spicy Thai-style stir-fried spaghetti with seafood."],
  S4: ["Spaghetti with Dried Chilli & Bacon", "Spaghetti stir-fried with dried chilli and bacon."],
  M1: ["Grilled Chicken Steak", "Grilled chicken thigh with gravy and a vegetable salad."],
  M2: ["Grilled Pork Chop", "Grilled pork chop with gravy and a vegetable salad."],
  M3: ["Grilled Pangasius Fish Steak", "Grilled pangasius with gravy and a vegetable salad."],
  M4: ["Captain's Fish & Chips", "Breaded fried pangasius, French fries, hash browns, sauce and lemon."],
  A8: ["Edamame", "Boiled edamame served with pink salt."],
  A9: ["Cream of Mushroom Soup & Baked Croissant", "Cream of mushroom soup with a baked croissant."],
  A10: ["Cream of Mushroom Soup", "A bowl of cream of mushroom soup."],
  R1: ["Fried Rice", "Fried rice with your choice of protein."],
  R2: ["Railway-Style Fried Rice", "Dark soy sauce fried rice with your choice of protein."],
  R3: ["Holy Basil Stir-Fry with Rice", "Served with a fried egg. The seafood option also includes mussels."],
  R4: ["Garlic & Pepper Stir-Fry with Rice", "Served with a fried egg."],
  R5: ["Chinese Kale in Oyster Sauce with Rice", "Served with a fried egg."],
  R6: ["Thai Omelette with Rice", "An omelette served with rice."],
  R7: ["Minced Pork Omelette with Rice", "A minced pork omelette served with rice."],
  R8: ["Minced Shrimp Omelette with Rice", "A minced shrimp omelette served with rice."],
  R9: ["Curry Powder Stir-Fry with Rice", "Curry powder stir-fry with your choice of protein, served with rice."],
  R10: ["Black Pepper Stir-Fry with Rice", "Served with a fried egg."],
  P1: ["Chickpea Fries", "Made from chickpeas, served with Vegan Japanese Sesame Mayo."],
  P2: ["Chilli & Salt Tofu with Rice", "Tofu stir-fried with chilli and salt, served with steamed rice."],
  P3: ["High-Protein Plant-Based Roast Pork with Rice", "Plant-based meat made from soy and rice protein, cooked with hot air."],
  P4: ["High-Protein Plant-Based Holy Basil Stir-Fry with Rice", "Plant-based meat made from soy, rice and mung beans, stir-fried with holy basil."],
};
const sections: Record<string, [string, string, string]> = {
  signature: ["Signature dishes", "Playful names, flavours from A Cup of Zoo.", "Cat Rice and Dog Rice, two signature dishes for people"],
  starters: ["Small plates", "Something to share while you spend time together.", "French fries, hash browns, cheese sticks and gyoza from the café"],
  sandwiches: ["Sandwiches", "Egg Drop and loaded Korean-style sandwiches.", "Egg Drop sandwiches with ham, bacon, egg and cheese"],
  salads: ["Salads & spicy salads", "Vegetables and spicy salads for a lively meal.", "Rainbow Farm Salad from the café"],
  pasta: ["Spaghetti", "Tomato sauce, cream cheese or Thai-style stir-fries.", "Spaghetti with tomato sauce and carbonara"],
  steaks: ["Steaks", "A filling plate for a leisurely meal.", "Grilled chicken steak and pork chop"],
  soup: ["Soup & light bites", "Warm soup with a croissant, or edamame to nibble on.", "Edamame and cream of mushroom soup with a croissant"],
  rice: ["Rice dishes", "Choose your protein and check the price of each option below.", "Fried rice, railway-style fried rice, holy basil rice and garlic rice"],
  "plant-based": ["Plant-based dishes", "Another choice for your meal.", "Chickpea fries with Japanese-style sesame sauce"],
};
const extraNames: Record<string, string> = {
  "แฮม 1 แผ่น": "Ham · 1 slice", "เบคอน 20 กรัม": "Bacon · 20 g", "ชีส 1 แผ่น": "Cheese · 1 slice",
  "ไข่คน 1 ฟอง": "Scrambled egg · 1 egg", "ไข่ดาว 1 ฟอง": "Fried egg · 1 egg", "ไข่กุ้ง 10 กรัม": "Shrimp roe · 10 g",
};
export function localizedMenu(locale: Locale) {
  if (locale === "th") return menuCatalog;
  return menuCatalog.map(section => ({ ...section,
    title: sections[section.id][0], lede: sections[section.id][1], imageAlt: sections[section.id][2],
    items: section.items.map(item => ({ ...item, name: englishDishes[item.code][0], note: englishDishes[item.code][1],
      variants: item.variants?.map((variant, index) => ({ ...variant,
        label: index === 0 ? "Pork / minced pork / chicken" : "Shrimp / squid / seafood / bacon",
      })),
    })),
  }));
}
export function localizedExtras(locale: Locale) {
  return locale === "th" ? sandwichExtras : sandwichExtras.map((group, index) => ({ ...group,
    title: index === 0 ? "Egg Drop add-ons (B1–B3)" : "Korean-style sandwich add-ons (B4)",
    items: group.items.map(item => ({ ...item, name: extraNames[item.name] })),
  }));
}
