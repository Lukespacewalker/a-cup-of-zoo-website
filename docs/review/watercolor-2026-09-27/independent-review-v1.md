# Independent acceptance review — watercolor paper design

**Status:** PARTIAL — frozen V1 reviewed; V2 language-control styling is pending a targeted recheck.

**V1 QA verdict:** **PASS**. No required criterion failed and no required V1 evidence is missing.

## Review target and independence

- V1 target: `watercolor-mali-v1`, HEAD `efe43dac53ce641e36e995b87e951e7181ddc295`, plus the dirty/untracked state recorded in `review-target.json`.
- The manifest contained 227 SHA-256 entries. All 227 matched before inspection and all 227 matched again after the V1 review.
- Reviewer: delegated fresh-context read-only reviewer. I did not author the implementation, product code, tests, renders or maker logs. I received the review brief, plan and frozen evidence but no implementation conversation history.
- Isolation limit: Root and reviewer shared one filesystem and Root owned the already-running fixture server. Product/test files stayed read-only during this review; only this report was written.
- Root later announced a user-requested V2 change to make the language control visually match the theme control. This report preserves the completed V1 result and does not accept V2 until its replacement manifest and focused evidence are checked.

## Required findings

None for V1.

The implemented result conforms to the approved scope and supports the primary family-planning and English-visitor tasks:

- The full shop-sign artwork remains in the scrolling page composition at 320, 390 and 1440 px, while the poster footer is absent. HTML headings and food/visit actions remain visible and readable above it.
- Mali 500 gives Thai and English main headings the same informal character without turning body copy, food names or prices into display text. Narrow English and Thai wrapping remains balanced and does not collide with header controls.
- Selected real photos retain clear subjects and irregular brush edges. Light and dark renders show the page background outside the masks; no rectangular white seam or materially faded subject was found.
- The generated meerkats, ducks and Nine-Tailed Fox are stylistically coherent, decorative, non-interactive and hidden from assistive technology. The small duck appears at the activities garden heading and is absent from the homepage.
- The wishing-corner copy is factual in both languages. It describes the photographed plaques and fortune-stick corner without promising outcomes or adding participation terms or fees.
- Activities preserve package prices, child rules and direct paths to menu and visit information. The long page is information-dense but remains scannable through its section jump navigation, cards, headings and aligned price rows.
- The official header/footer logo, native menu, noindex state, locale routes, both telephone links and the 47-item food catalog remain present.

## Evidence used

### Source inspection

I inspected the plan and review notes; `HomePage.astro`, `ActivitiesPage.astro`, `WishingCorner.astro`, `WatercolorAnimal.astro`, `FoxSeal.astro`, `SiteLayout.astro`, header/footer, watercolor/global/activity styles, locale/business catalogs and the focused E2E/unit tests. This established semantic links/buttons, decorative-image treatment, mask fallback, localized copy and unchanged business data. Source inspection alone was not treated as interaction or visual evidence.

### Render inspection

I visually inspected all 72 current maker PNGs in the final naming matrix:

- `hero-{th|en}-{320|390|1440}-{light|dark}.png`
- `home-{th|en}-{320|390|1440}-{light|dark}.png`
- `home-{th|en}-{320|390|1440}-{light|dark}-{friends|wishes}.png`
- `activities-{th|en}-{320|390|1440}-{light|dark}.png`
- `activities-{th|en}-{320|390|1440}-{light|dark}-wishes.png`

I also inspected `menu-en-390-dark.png` for the corrected dark decorative seal and menu typography. Viewport crops were used for text, masks and control legibility; full-page captures were used for sequence, repetition and density. Fixed mobile CTAs visible at viewport boundaries were not treated as proof of interaction behavior.

### Executed interactions

Using my own BrowserOS Neo tab against `http://127.0.0.1:4321/`, I actually:

1. Opened English home and clicked **Discover the wishing corner** to `/en/activities/#wishing-corner`.
2. Switched to Thai and observed the equivalent `/activities/#wishing-corner` anchor and Thai wishing section.
3. Clicked the Thai menu route, switched to English, clicked **Plant-based dishes**, and observed `/en/menu/#plant-based` with the section in view.
4. Queried the rendered menu after those clicks: 47 coded items were present; B3 showed 189 THB and R9 showed 129/159 THB options.
5. Clicked **Plan your visit**, then **Pass benefits and child admission**, reaching `/en/activities/#passes`.
6. Read the rendered child rules: under 100 cm free, at least 1 participating adult, 49 THB new socks for Indoor zones, outdoor animals return at 18:00 and the café closes at 19:00.
7. Confirmed rendered phone links `tel:+66989838037` and `tel:+66922791890`.

At a disposable 390 px browser emulation, computed source state showed no horizontal overflow, Mali on the main heading, Noto Sans Thai Looped on body copy, the canvas texture loaded, the brush mask applied and decorative fox filter `none`. A later optional headless Playwright command produced no output before its tool timeout, so it is **NOT RUN** evidence and is not used in the verdict.

### Maker evidence reused

- `e2e.log`: 24/24 passed.
- `affected-final.log`: 4/4 passed after the final wrapping refinement.
- `check.log`: 56 files, zero errors, warnings or hints.
- `build.log`: final asset preparation and Astro server build completed.
- `render-observations.json`: 24 TH/EN home/activities width/theme states, with no overflow or broken images, masks active and noindex retained.
- Earlier unchanged business-data evidence: 22 unit tests passed, including all 47 menu entries and TH/EN numeric parity.

## V2 targeted recheck required

After Root supplies the V2 manifest, compare only the language-control change against V1. The affected `.language-switch` should visually match the transparent, borderless theme control while keeping its TH/EN destination text, semantic link/href, accessible label, 44 px target, focus indication and equivalent-hash behavior. This is the single actionable recommendation and the remaining acceptance dependency.

## Limits and optional gaps

- Physical iOS/Safari behavior, screen-reader output, Core Web Vitals/network performance and customer research on premium perception were **NOT RUN** and are not claimed.
- Dark mode keeps the paper treatment much quieter than light mode. It remains coherent and readable in the supplied renders; a stronger dark texture would be an optional art-direction choice, not a V1 acceptance failure.
- No behavior was otherwise declined as outside the plan/spec.

No product or test paths were changed by this review.
