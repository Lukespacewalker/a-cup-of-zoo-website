# Independent acceptance review — watercolor paper design

**Status:** DONE

**QA verdict:** **PASS**. No required criterion failed and no required evidence is missing for the frozen V2 target.

## Target and independence

- Final target: `watercolor-mali-language-v2`, HEAD `efe43dac53ce641e36e995b87e951e7181ddc295`, plus the dirty/untracked state recorded by 246 SHA-256 entries in `review-target.json`.
- All 246 entries matched before and after the V2 review. The preserved V1 manifest/report record the prior 227-entry target.
- I was a fresh-context, read-only reviewer. I did not author product code, tests, renders or maker logs. Root and reviewer shared one filesystem and Root owned the running fixture server; this report is my only changed path.

## Required findings

None.

The approved result supports family planning and English visitors: the full watercolor shop sign remains in page flow; the warm paper canvas, irregular real-photo masks, coherent animal art and factual bilingual wishing corner are readable across the supplied sizes and themes. Mali gives Thai and English headings a consistent friendly character while body copy, food names and prices retain their established font. The duck decoration appears only at the activities garden heading. Package prices, child rules, 47 menu items/options, noindex, native menu, phone links and equivalent locale navigation remain present.

The V2 language link now matches the theme button: both render as transparent, borderless, round 44 px controls with matched visual weight. TH/EN destination text, semantic link/href, accessible name, focus indication and equivalent-hash behavior remain intact.

## Evidence

### Source

For V1, I inspected the plan/review notes, page components, wishing-corner and animal components, layout/header/footer, relevant styles, locale/business catalogs and focused tests. Source established semantics, decorative-image treatment, localized copy, mask fallback and business data; it was not treated as interaction or visual evidence.

For V2, I compared `review-target-v1.json` and `review-target.json`. The only product delta is `src/styles/garden.css`; header markup/scripts and relevant tests are byte-identical to V1. The changed rule places `.language-switch` and `.theme-button` on the same 44 px transparent circular base with shared hover and focus-visible treatment.

### Rendered output

The V1 review covered all 72 final `hero`, `home` and `activities` TH/EN × 320/390/1440 × light/dark PNGs, including focused friends/wishes crops, plus `menu-en-390-dark.png`. I found no required visual failure: heading wraps were balanced; masked subjects stayed clear without white rectangular seams; composition remained cute, scannable and carefully composed.

For V2, I inspected the supplied current header evidence, including `header-v2-th-390-light.png`, `header-v2-en-1440-dark.png` and `header-v2-error-en-320-light.png`. The language and theme controls match without crowding the wordmark, navigation or mobile menu. The longer error-page `TH · Home` destination remains understandable at 320 px. `header-observations.json` covers all 12 locale/width/theme combinations and reports 44 × 44 px controls with zero overlap and zero horizontal overflow.

### Executed interactions

My V1 BrowserOS Neo interactions actually exercised English home → wishing corner, equivalent-hash locale switching, menu anchors, visit/child-rule navigation, and rendered phone/menu data. They confirmed 47 coded menu items, B3 at 189 THB, R9 at 129/159 THB, the child-height/adult/socks rules, animal/café closing times, and both telephone links.

For V2, I also completed a targeted keyboard check at 390 px on `/en/activities/#wishing-corner`: focusing the language link and pressing Enter reached the Thai page at `/activities/#wishing-corner`; focusing the theme button and pressing Enter changed theme state while retaining that URL/hash. Both controls computed to 44 × 44 px, border 0, radius 50%, transparent background and matched colour; horizontal overflow was zero and keyboard focus exposed a solid accent outline.

Maker `language-control.log` supplies 9/9 passing post-change interaction tests for locale, theme, wishing hash, mobile navigation, error route and relevant width/theme states. `build.log` records a successful final asset preparation and Astro production build. Reused V1 maker evidence includes 24/24 E2E, 4/4 affected checks, 56-file Astro check with zero diagnostics, 24 render states with no overflow/broken images and 22 unchanged unit tests for business data.

## Limits and optional gaps

- Physical iOS/Safari, screen-reader output, Core Web Vitals/network performance and customer research were not run and are not claimed.
- Dark paper texture remains quieter than light mode; supplied renders remain coherent and readable, so this is optional art direction.
- An optional headless Playwright attempt timed out without output and is not evidence. It left no `bun -e` or Playwright Chromium process. BrowserOS work was completed before the final bounded instruction and was not retried. Root's shared server was not stopped or changed.

No product or test paths were changed by this review.
