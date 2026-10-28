# Interactive shop map

## Current correction — 28 October 2026

The user requires every map point, rather than the 11 selected highlights from the first implementation. The prior 11-stop acceptance and native large-map footer below are superseded for this correction. Cover all 16 numbered places in the source illustration, plus the restroom and both parking locations (19 pins). Keep the main zoom action, and remove the separate “Open the large shop map” control at the bottom as explicitly requested. Missing photos are acceptable: show the stop's name/details without a photo placeholder. Preserve third-section home placement, passes → map placement in activities, locale links and existing pointer/focus behavior.

- [x] Match the 16 source numbers to explicit stop data and add the 7 missing places plus rear parking.
- [x] Keep all pin centres inside the illustration, synchronize the activities list and both locales, and handle stops without photos.
- [x] Remove the bottom large-map disclosure; keep the main zoom and a useful static map/link fallback without JavaScript.
- [x] Run exhaustive stop-selection, affected browser tests, Astro check/build and actual desktop/mobile inspection.
- [x] Record final evidence and preserve the earlier implementation/release history below.

Correction acceptance: all 16 numbered places and 3 facilities are present in both pages/locales, with source numbers displayed on pins and in the picker. Places without photos show a small icon and their details. The duplicate bottom map disclosure is gone. Exhaustive selection tests initially failed (19 expected, 11 actual); final affected suite passed all 10 tests, including every pin tapped at 320/390px, uncropped number badges, no-JavaScript links, zoom and the previous navigation regression. A new geometry assertion caught clipped badges 3/4 before the mobile badge offset was fixed. Unit suite: 26 passed. Final Astro check: 80 files, zero errors/warnings/hints; production build passed. Root inspected actual Neo desktop and mobile renders and selected the photo-free Kurama/Desert cards. A read-only independent source/illustration inventory review passed with no material findings, covering all source numbers, locations, lists and footer removal; it did not claim independent runtime testing. The final badge offset was additionally verified by Root's actual 320px render and exhaustive tests.

Validation uses ignored `tmp/map-complete-qa.config.mjs` and `tmp/map-complete.playwright.config.ts`, redirecting build/cache/test output to `C:/Users/Sutti/.codex/artifacts/acupofzoo-map-complete-2026-10-28/` because H: remains low on space. Exact source/image snapshots and SHA256 manifest are in its `review/` folder. The initial local-only status was superseded by the user's “Deploy เลย” instruction: the verified saved bundle was published as version `59c5411c-36fd-40f7-a466-c6b6ea73e163` and passed public checks on both domains. See the [complete-map release evidence](../../review/complete-map-release-2026-10-28/README.md). Source changes remain uncommitted. The earlier release record below describes the previous 11-pin version.

**Goal:** Make the illustrated map a full-width third section on the home page and place the same interactive explorer directly after passes and prices on the activities page, in Thai and English.

**Current decision:** User approved the map direction and these placements on 27 October 2026. This supersedes the map's previous placement near the bottom of ActivitiesPage. Work in the existing checkout to preserve the extensive uncommitted owner-content work and source assets that this feature depends on. Root implements and integrates; no product changes outside the map and its placement.

**Architecture:** Reuse ShopMap.astro with a localized stop catalogue, existing images, CSS, native controls and a small Astro client script. Preserve the original bitmap; frame its illustration with CSS. No dependencies or CMS writes.

**Acceptance:** Third home section (hero → introduction → map); activities passes → map; exactly one explorer on each page; correct locale links; icons aligned with the illustration; hover/focus previews and click/tap selection; close restores overview; mobile details remain below the image; zoom works without trapping page scroll; keyboard and no-JavaScript access; no horizontal page overflow at 320/390/768/1440px in either theme.

## Tasks

- [x] Add behavioral browser tests for placement, hover/select/close, keyboard, zoom, locale and mobile overflow. Run against the previous component and observe the missing-feature failure.
- [x] Build the shared explorer and localized stops. Use the source illustration and established admission facts; distinguish animal-zone admission from other stops. Keep native large-map details for no-JavaScript access.
- [x] Insert after home introduction, move the activities map after passes, retain existing garden and admission anchors without duplicating the map.
- [x] Run Astro check/build, unit tests and affected browser tests; inspect and interact in BrowserOS neo at desktop/mobile sizes and in light/dark themes.
- [x] Freeze the final changed-file hashes, request a read-only independent review, fix material findings and record evidence.

## Review focus

Touch must not depend on hover; keyboard users must be able to select and close a stop. Zoom must retain working markers and not overflow the page. Details must not obscure the illustration on narrow screens. English UI and links must remain English (the original illustration contains baked-in bilingual labels). Existing owner changes and native no-JavaScript large-map access must be preserved.

## Acceptance evidence

- Implemented 11 illustrated stops with hover/focus previews, pinned selection, accessible status, close/Escape, native place picker and zoom. Mobile details sit below the illustration; desktop details sit beside it. Home links to the same explorer in activities.
- Initial placement test failed on the previous third home section. A review regression also failed when pin blur unmounted a hovered link before activation. Fixed focus transfer into details and replaced scroll-sensitive pointer enter/leave with actual pointer movement; the two-viewport navigation regression then passed 10 consecutive repetitions.
- `bun run test:unit`: 26 passed. Whole browser suite before the final review fixes: 38 passed. Final affected suite after all fixes: `PLAYWRIGHT_REUSE_SERVER=1 bunx playwright test tests/e2e/shop-map.spec.ts tests/e2e/owner-content.spec.ts --workers=1`: 8 passed, including the new navigation regression, touch/zoom and no-JavaScript map access.
- Final Astro check: 80 files, zero errors/warnings/hints. Final production build: passed. Because H: ran out of space, the checks imported the unchanged project configuration through ignored `tmp/interactive-map-qa.config.mjs`, redirecting only caches/output to `C:/Users/Sutti/AppData/Local/Temp/acupofzoo-interactive-map-20261027/`. Previous generated dist output was preserved there in `previous-dist`; no original assets were removed.
- Root inspected real Neo renders in desktop light/dark and mobile Thai/English, and executed hover, pin selection and the English place picker. Independent reviewer used a fresh context, read-only frozen files, and the shared live checkout/server. Reviewer inspected desktop and mobile touch/zoom and independently executed the final 1280×720 stationary-pointer wheel-scroll and preview-link navigation. Final verdict: PASS, no remaining material findings. Shared dependencies were not isolated; supplied build/test evidence is distinguished from the reviewer's own interactions.
- Final reviewed ShopMap SHA256: `2E8720F3A95953CC80E300133F85A1AC947D161709F970EF5227E0E21EF7EB67`, base HEAD `1fc2599a9fa32ad6ab02760a93e425934adb6919`. The frozen seven-source/test-file manifest is in the temporary review folder alongside the original acceptance-plan snapshot. This completion note changes only plan status/evidence after review.
- Changes remain local and uncommitted. No deployment or CMS write was performed.

Deployment follow-up: local-only status above is superseded by the user's 28 October deployment instruction. The unchanged reviewed map was published with heroes/Zoo Clubs and header alignment; see the [release evidence](../../review/hero-map-header-release-2026-10-28/README.md). Source changes remain uncommitted; no CMS write was performed.
