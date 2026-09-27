# Watercolor paper café — implementation plan

**Owner:** Root implements and integrates. The existing TH/EN chat finishes its current review before Root edits shared product files.

**Goal:** Present A Cup of Zoo as a warm, cute and carefully composed boutique café for families and English-speaking visitors, using the user's shop-sign watercolor hero, quiet paper texture, real photographs with brush edges, and the shop's Nine-Tailed Fox mascot.

**Approved design:** User discussion and approval on 2026-09-27. Full-width paper hero with the supplied sign illustration; remove excess blank space and printed footer from its visible frame without changing the sign. Real photographs remain factual; watercolor animal accents share one style. The mascot is “น้องจิ้งจอกเก้าหาง” / “Nine-Tailed Fox”, associated with the wishing corner and fortune sticks. Use the supplied actual wishing-corner photograph. The three supplied black brush shapes are references/source masks for photo edges blending into paper.

**Architecture:** Continue the existing Astro shared TH/EN page components. Add a small watercolor illustration component and a focused stylesheet. Preserve source pictures; use responsive presentation and CSS masks for crop/edges, with an unmasked fallback. Optimize bitmap assets locally through Astro. No new runtime library.

**Execution:** Root uses the executing-plans workflow, scaled to this visual change. The user authorized both plan and implementation; no second approval is needed. No parallel product writer. A separate final read-only review will cover residual visual and interaction risk.

## Constraints

- Preserve pending theme/TH/EN work and the server used by that chat; wait for its completed turn before shared-file edits.
- Retain native menu, all 47 current Heyzine food prices/options, package prices and conditions, two phones 0989838037/0922791890, noindex, SEO locale behavior and working navigation. Do not deploy.
- Keep TH/EN content equivalent and current route when switching language. Do not invent blessings fulfilled, ritual instructions, charges, ingredients or services.
- Keep image subjects, especially faces, food and the shop sign, readable inside opaque mask regions. Decorative edges must not reduce text contrast or interactive target sizes.
- Keep light/dark/auto modes usable. Preserve existing brand logo; replace decorative line-art accents in the redesigned homepage with watercolor art rather than altering the official logo.
- Do not turn all menu photographs into ornament. Prices, food details and package conditions retain clear structure.
- No unrelated cleanup, commits of other work, destructive actions or publication.

## Tasks and acceptance

### 1. Prepare source assets and the art direction

Files: `src/assets/watercolor/`, `docs/review/watercolor-2026-09-27/asset-notes.md`.

- [x] Save the supplied hero, wishing-corner photo and brush sources into the project.
- [x] Generate a transparent watercolor Nine-Tailed Fox from the supplied praying statue. Preserve large ears, nine tails, golden cream body, forehead red spiral, curved closed eyes, red nose and joined hands. No text or background scenery.
- [x] Prepare matching transparent meerkat and duck watercolor spot illustrations from the supplied references. Inspect alpha, recognizability and edges.
- [x] Record asset provenance, prompts and output paths. Keep real photographs unchanged apart from web encoding/resizing and presentation crop.

### 2. Implement paper, hero and photo treatment

Files: `src/components/pages/HomePage.astro`, `src/components/site/WatercolorAnimal.astro`, `src/styles/watercolor.css`, `src/layouts/SiteLayout.astro` (shared texture import only if needed).

- [x] After the TH/EN owner completes, record a baseline and read its final review before editing.
- [x] Replace homepage image collage with a full-width paper composition and the supplied sign illustration. TH/EN heading and menu/visit actions stay real accessible HTML. Use distinct mobile/desktop framing; preserve the sign, avoid footer typography from the poster.
- [x] Add restrained paper grain and warm cream/cocoa/sage palette. No high-frequency texture across small text.
- [x] Apply brush masks to selected real homepage photographs. Invert source mask luminance in CSS; supply standard and WebKit forms and an unmasked fallback. Preserve source media and alt text.
- [x] Replace homepage decorative generic doodles with the coherent watercolor animal set. Keep useful real-photo content and a clear path to animals, menu and visits.

### 3. Add the wishing-corner story in both languages

Files: `src/components/pages/HomePage.astro`, `src/components/pages/ActivitiesPage.astro`, `src/styles/watercolor.css`.

- [x] Show the real wishing-corner photo and watercolor mascot with “มุมขอพรกับน้องจิ้งจอกเก้าหาง” / “Make a wish with our Nine-Tailed Fox”. Use modest factual copy about visitors leaving wishes and the pictured fortune-stick corner, without outcome claims or unverified participation terms.
- [x] Provide a same-locale link from the homepage to the activities wishing-corner anchor, without disrupting package/child conditions.

### 4. Verify and review the integrated result

Files: `tests/e2e/watercolor.spec.ts`, `docs/review/watercolor-2026-09-27/`.

- [x] Add focused interaction coverage for the new wishing-corner route and language switching. Reuse menu/price/locale checks rather than duplicating implementation assertions.
- [x] Run Astro check, relevant unit tests, E2E and build; inspect every result. Coordinate server/build writes to avoid Windows asset-lock conflicts.
- [x] Render actual TH/EN homepage and activities at 320/390/1440 widths, light/dark; inspect hero crop, paper edges, mask subjects, readable text, CTA visibility and overflow. Check real menu/visit navigation and language switch with the browser.
- [x] Freeze review target by hashes and distinguish source, rendered, interaction and maker evidence. Obtain one separate read-only review. Root fixes necessary issues and reruns affected checks.
- [x] Record completion, remaining limitations and the local preview. Retain noindex and do not deploy.

## Review focus

1. Narrow English labels must not collide with language/menu controls.
2. Hero framing must retain the entire shop sign at 320/390/1440 while excluding the poster's printed footer.
3. Brush edges must genuinely reveal the underlying paper, including dark mode, without white rectangular seams or faded subjects.
4. Decorative art must not obscure buttons, absorb clicks, duplicate accessible content or imply invented café offerings.
5. The new wishing-corner anchor and locale switch must stay in the selected language, with original menu prices and child conditions intact.

## Progress / decisions

- Plan written after explicit user approval. Root is the implementation owner; independent illustration preparation does not change the TH/EN review target.
- CSS masking is a rendering treatment; source photos remain unchanged. Food catalog photography remains structured to prioritize comparison and prices.

- Update: the user moved the small duck artwork from the homepage to the activities garden heading to avoid repeating the real duck photo. Implemented in both locales.
- Update: the user requested visibly textured canvas paper. A new built-in generated paper texture replaces washi; a 60% theme-colored wash keeps text areas calm.
- Update: the user selected Mali for Thai headings and wanted a matching English feel. Use the existing locally hosted Mali 500 Thai/Latin font for main h1/h2 in both languages; body, food names and prices retain Noto Sans Thai Looped. This supersedes the earlier serif English hero/wishing heading treatment.
- Update: the user requested the language control look like the theme control. Share borderless transparent 44px round targets, colour and hover treatment, retaining the TH/EN destination text, semantic link, accessible label and equivalent-route/hash behavior. This supersedes the earlier outlined language control; verification targets revision 2.
- Integration: new `WishingCorner.astro` shares the bilingual story between home and activities. Decorative `FoxSeal.astro` now uses the watercolor mascot throughout primary pages; official header/footer logo unchanged. Old animal-page doodle overlays replaced by the coherent photo treatment.
- Maker verification complete: TH/EN baseline 227 hashes matched; new wishing-corner interaction failed before implementation and passed afterwards. Latest full E2E 24 passed (12.5s); final balance-only CSS affected theme/wishing 4 passed (8.4s); unit 22 passed with unchanged business data; Astro check 56 files/zero diagnostics. Final build passed at 09:19 and final render matrix has 24 states with no overflow/broken images. BrowserOS actual EN switch loads Mali 500; body retains Noto Sans Thai Looped.
- Final revision 2 adds the requested borderless language control. Nine affected locale/theme/wishing tests passed (9.0s), 12 header states have 44px targets without overlap, and build passed at 09:32. Revision 1's body/artwork evidence remains valid; current controls are captured in `header-v2-*` and `hero-v2-*`.
- Independent read-only review: **PASS**, no required findings. Final `review-target.json` records HEAD, dirty state and 246 hashes, all verified with zero mismatches by the reviewer. Report: `docs/review/watercolor-2026-09-27/independent-review.md`. Root is the sole product writer; the fresh-context reviewer shares the filesystem and writes only the report.
- Completion: local Thai/English preview available at `http://127.0.0.1:4321/` and `/en/`. Noindex and current business data retained; no deployment. The prior TH/EN monitoring heartbeat is paused. Physical iOS/Safari and customer research are not part of this evidence; the optional timed-out reviewer command is excluded from acceptance evidence.
