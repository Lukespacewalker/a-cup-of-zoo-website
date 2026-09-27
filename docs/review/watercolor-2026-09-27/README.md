# Watercolor paper design — 27 September 2026

Root implemented the approved visual refresh on top of the completed TH/EN work. The prior 227-file TH/EN target matched before shared product edits (see `baseline.json`). No CMS writes, price changes or deployment.

## Result

- Full-width hero using a transparent watercolor derivative of the user's shop-sign artwork, with the poster's blank margins/footer removed. Headline/actions remain localized HTML. Source artwork retained alongside the derived asset.
- A visible ivory watercolor-paper/canvas texture across the site, with a 60% theme-colored wash. Light/dark/auto remain available.
- Supplied brush masks blend selected real photographs into the background. Face/food subjects remain visible; menu catalog photographs retain clear rectangular presentation for comparison. CSS fallback keeps the photograph when masking is unsupported.
- A coherent watercolor Nine-Tailed Fox, meerkat group and duck illustration set. Official logo unchanged; decorative fox seals use the new mascot.
- A factual wishing-corner story and actual café photograph, shared between Thai/English home and activities pages. No claims that wishes come true or invented participation terms.
- At the user's request, small watercolor ducks appear only beside the activities garden heading, not beside the real duck photograph on the homepage.
- The user selected Mali for Thai headings and a matching English feel. Main h1/h2 now use the existing locally hosted Mali 500 Thai and Latin faces. Balanced wrapping prevents narrow-screen orphan words; body copy, food names and prices keep the existing font.
- Final user update: language and theme controls share transparent borderless 44px circular targets, colour and hover treatment. TH/EN text, accessible labels, semantic links and equivalent page/hash behavior remain intact.

Plan: [watercolor-canvas.md](../../superpowers/plans/2026-09-27-watercolor-canvas.md). Asset provenance, exact prompts and built-in generation notes: [asset-notes.md](asset-notes.md).

## Maker evidence

- New wishing-corner navigation test was RED before implementation (missing homepage link), then GREEN with locale/section retained.
- Full E2E: 24 passed. Updated the existing photo-journal keyboard test to target the remaining real-photo links after the approved collage removal; focus-visible, reduced-motion and Enter-navigation assertions remain intact.
- After moving the duck illustration: 11 affected locale/visit/wishing tests passed. After adding texture: 4 theme/wishing tests passed, including existing 320/390/768/1440 and light/dark/auto layout coverage.
- After the Mali change and correcting an inherited dark-mode invert on decorative watercolor fox seals: full E2E 24 passed (12.5s). The final balance-only refinement is covered in `affected-final.log` and the final render matrix. The dark mascot was observed with `invert(1)` before the fix and `none`/`normal` afterward.
- After the final language-control style change: 9 affected locale/theme/wishing tests passed (9.0s), final build passed at 09:32, and 12 TH/EN header states at 320/390/1440 light/dark have 44px targets without overlap or page overflow. See `language-control.log` and `header-observations.json`.
- Unit: 22 passed, including all 47 menu entries and numeric parity for translated menu, packages and conditions.
- Astro check: 56 files, zero errors/warnings/hints. Build log is saved separately.
- `render-check.mjs`: 24 page states (TH/EN × home/activities × 320/390/1440 × light/dark) with no overflow or broken images, active masks and retained noindex. PNGs require visual inspection; counts alone do not prove visual quality.
- BrowserOS: actually clicked the new English homepage wishing-corner link; verified `/en/activities/#wishing-corner`, English section and both phone links. Playwright separately exercised locale switching, package/category links, keyboard/reduced motion and menu price checks.

## Image evidence conventions

`home-*` and `activities-*` are full-page captures; `hero-*`, `*-friends` and `*-wishes` are viewport captures. The capture script scrolls actual image viewports before full-page capture because Chromium can defer painting offscreen masked/lazy images. No product CSS is overridden for captures. Sticky mobile controls may appear within a full-page image at the capture viewport boundary; actual interactions are checked separately.

Revision 2 supersedes the earlier outlined language control. Use `header-v2-*` and `hero-v2-*` for the current header appearance, including the English error-page return-home label. Earlier page/body renders remain evidence for the unchanged imagery, texture, headings and content below the header. `review-target-v1.json` preserves the first frozen manifest; `review-target.json` describes the final control change and added evidence.

## Acceptance and limits

Final verdict: **PASS** for `watercolor-mali-language-v2`. The independent reviewer verified all 246 frozen hashes with zero mismatches and reported no required findings. See [independent-review.md](independent-review.md) for the separate source, render, interaction and maker evidence, including the bounded language-control follow-up.

Independent review and final result are recorded in `independent-review.md`. Root is the maker; the reviewer is briefed separately and may only read product/test files and write the review report. Shared filesystem and local fixture server; no isolated production deployment. Review target contains SHA-256 hashes and HEAD/dirty state.

This is local preview evidence, with Chromium desktop/mobile viewports; it is not a physical iOS Safari test or customer research on luxury perception/willingness to pay. English news remains explicitly labelled as Thai from the earlier approved scope. Noindex, both phones and native menus stay in place.

Preview: http://127.0.0.1:4321/ and http://127.0.0.1:4321/en/.
