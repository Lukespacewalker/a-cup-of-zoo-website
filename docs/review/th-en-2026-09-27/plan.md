# TH/EN implementation plan

Root implements the user-approved scope in the existing working tree, preserving all boutique changes. No deployment or CMS edits. One current plan; no additional design approval needed.

- [x] Add failing E2E for English routes, equivalent language switch, complete menu/child conditions, locale metadata and absence of untranslated Thai UI.
- [x] Share page templates between Thai and `/en/` wrappers. Add locale/path helpers and English text translations; derive English catalogs by changing text only, retaining all original numbers, codes, source references and images.
- [x] Localize Header/Footer/Layout/error text/alt/labels, business text, Menu JSON-LD, canonical/hreflang/OG locale and production sitemap. News remains Thai with an explicit English label; no fake English news routes.
- [x] Run unit/E2E/check/build, compare all menu offers/add-ons/package/activity/child/hour/phone/map values between languages; test same-page/hash language switch, navigation/category jumps/gallery and no-JS menu.
- [x] Render 320/390/1440 light/dark, inspect typography/doodles/overlap and scan English UI/attributes for Thai leakage. Save images and exact target hashes, obtain read-only independent review, resolve findings, leave local English preview running.

Acceptance: both audiences can complete home → menu/prices → passes/child terms → hours/maps/contact in their language. All 47 current menu prices and variants remain unchanged. No fabricated drinks/desserts, ingredient/allergen/quality/service claims. Local/staging noindex unchanged; production canonical/hreflang share configured origin. English CMS text is translated only when a known source string matches; unfamiliar Thai updates must not be silently presented as translated English.
