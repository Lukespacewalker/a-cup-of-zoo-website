# Garden & Animal Experience — implementation evidence

Current plan: [approved design and implementation](../../superpowers/plans/2026-09-28-garden-animal-experience.md).

## Delivered locally

- Hero uses the existing film, a usable poster, play/pause, reduced-motion handling and native source-error fallback. CSS crops the letterbox bars embedded in the source; original media remains unchanged.
- Warm paper, calmer Noto headings, Mali accents, existing watercolor animals. No line doodles or legacy cartoon stickers are rendered in the new composition.
- Home introduces café / animals / garden, then the cat room on an olive background, café, garden, wishing corner, passes and visit details. User approved the olive-section direction during implementation.
- Cat room belongs to the existing Indoor group. Activities retain all six zones, five activities, feeding options, child terms and prices; the user's four additional brochure crops supply six zone thumbnails and five activity photos.
- Menu retains all 47 dishes and variants, with food photos earlier on mobile. Home and Visit use the same OpeningHours component and venue source.
- All source photographs remain unmodified. CSS framing selects photo windows; brochure words and prices are HTML in the page, not embedded UI text.

## Ownership and target

Root is sole product writer, on branch codex/garden-animal-experience. Baseline HEAD: 1fc2599a9fa32ad6ab02760a93e425934adb6919. Existing dirty planning documents and reference assets from this conversation are preserved. No CMS writes or deployment.

Ruling: reuse the dedicated checkout and its sibling CMS dependency with one writer; do not create a second checkout solely for ceremony. Independent reviewer gets a fresh conversation, exact source/test hashes in review-target.json and the plan/evidence, but shares the filesystem and local server. It cannot edit product/tests. This is independent review, not filesystem isolation.

## Evidence

| Check | Result |
|---|---|
| Baseline | Astro 56 files zero diagnostics; unit22 /246 assertions. Old E2E selectors failed; baseline log preserves the failures. |
| Final Astro check | 61 files, zero errors/warnings/hints |
| Unit suite | 22 pass,246 assertions; catalog/business code unchanged afterwards |
| Full browser suite | 29 pass before the new source-abort regression |
| Olive section affected checks | 9 pass (theme/visit/experience navigation) |
| Review fixes and brochure delta | 13 pass (hero including native network abort, locale, theme widths); one redundant image block removed afterwards |
| Content verification | invalid=[]; displayName and parkingNote still need confirmation as before |
| Build | Successful Cloudflare server build; final build rerun after review delta |
| Hours source mutation | Disposable local fixture changed to11:15–18:30; Home=Visit in both languages; original bytes restored in finally |
| Media | H.264/yuv420p,1920×1080,8sec,2,215,450bytes; Chromium currentTime advanced after Play, remained fixed after Pause |
| Olive contrast | Text7.89–10.80:1; link hover6.94:1, measured from computed colors |
| Responsive | Primary routes at320/390/768/1440 across light/dark/auto in E2E; extra English home,1920 and720×500 reflow renders |

Logs are alongside this file. Screenshots with -fold are viewport captures. Full-page visual captures eagerly decode lazy images solely for capture so offscreen photographs appear; production lazy loading is unchanged. Section screenshots can contain the viewport-fixed shortcut bar mid-image; actual scroll/navigation was tested separately.

## Review and corrections

Fresh reviewer review_garden verified frozen hashes, inspected source plus supplied TH renders and executed a controlled failed MP4 request. Initial verdict FAIL, one P2: source error did not bubble to video, leaving a misleading Pause control. Root added a shared terminal failure handler on both elements and a real network-abort test. The final delta review is recorded in independent-review.md.

## Scope and limits

- BrowserOS neo was used for live inspection; its background media load and screenshot/device metrics were inconsistent, so repeatable render and interaction evidence comes from local Playwright Chromium. No claim of iOS Safari/device coverage.
- 720×500 is a layout-reflow equivalent of a1440×1000 viewport at200%; native browser toolbar zoom was not verified.
- Captured final TH/EN composition; a complete before-change screenshot matrix was not saved. Baseline source/interaction failures and earlier review history remain available.
- No measured production CWV, new-visitor research or claim that customers perceive luxury. Final subjective visual acceptance belongs to the user.
- The supplied goat photograph remains in reference-data; its overlay obstructs the feeding action, so the final activity list uses the newer unobstructed brochure photos instead.
- The feeding/animal illustration sheets are reference inputs. Existing watercolor ducks, meerkats and fox establish the decorative style; no generated replacement animals or invented species.
- No external preview was updated. Current result is local-only at http://127.0.0.1:4321/.

## Acceptance

Implementation and automated checks are complete subject to final review result below. Technical review and visual preference are separate: user approved the direction, but full final composition remains available for their assessment.


Final independent technical verdict: PASS; no required findings remain. See independent-review.md. User visual acceptance and native zoom/device gaps remain explicitly separate.


## Follow-up: logo, arrows and menu photos

User requested removing the white logo box, consistent arrow shapes across operating systems, and always-visible menu photographs. ShopLogo applies an SVG alpha mask derived from the original monochrome logo, preserving its ink instead of generating new lettering; currentColor supplies accessible light/dark ink. Header and footer both use it. ArrowIcon uses SVG paths throughout the site, including the category-back link and local font preview; no Unicode arrow characters remain in src. Menu galleries are plain HTML containers and show all supplied images without disclosure controls, including with JavaScript disabled.

Validation: Astro63 files zero diagnostics,16 relevant browser tests passed (menu/locale/theme/hero). Visually checked light/dark logo and both menu photos at390px. This small follow-up was Root-reviewed; the earlier independent verdict applies to the previous frozen target. No physical iOS device test is claimed. Screenshots: logo-light.png, logo-dark.png, menu-both-photos.png.

## Follow-up: current animal roster

The user confirmed that the formerly historical list describes animals currently at the café; missing photographs do not mean missing animals. Removed the historical-post disclosure and date/availability qualification. Dog/cat breeds are now visible directly under the Indoor dog-and-cat room; existing meerkat/prairie-dog/goat/rabbit entries remain in their documented zones without duplicate roster cards. Remaining species and birds are visible immediately below the two zone columns; their specific housing was not invented. No zone or admission entitlement added. This supersedes the earlier historical-directory design decision.

Validation: check63 files zero diagnostics;6 relevant locale/navigation E2E passed. Rendered and checked visible roster/no horizontal overflow at320/390/1440. Root-reviewed copy/layout follow-up.

## Deployment — 28 September 2026

Explicit user request: deploy. Built and deployed via bun run deploy:preview to the existing a-cup-of-zoo-preview Worker. Version bd29a273-3d7c-4fac-884e-0528121e0e6d. This supersedes earlier local-only status statements. Staging fixture mode and noindex preserved; no CMS writes or custom-domain changes.

Verified eight TH/EN routes return200 with X-Robots-Tag:noindex,nofollow (deploy-smoke.json). Live BrowserOS inspection confirms SVG logos/arrows,47 menu dishes and both plant-based photos loaded; animal roster changes are visible. One batched browser call hit its30second cap while decoding remote images; follow-up confirmed they had loaded. Deployment output in deploy.log. Local preview restarted on4321.
