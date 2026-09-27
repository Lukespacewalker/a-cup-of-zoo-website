# Independent TH/EN acceptance review — 27 September 2026

> Archived initial review: references to review-target.json below denote [review-target-v1.json](review-target-v1.json). The final target and follow-up verdict are in [review-target.json](review-target.json) and [independent-review.md](independent-review.md). Original findings are retained below.

Verdict: **FAIL** for the frozen initial target. One required English error-page criterion fails. The five primary routes, content parity, visitor journey and supported layouts pass the checks below. This report does not grant deployment approval.

## Target and independence

- HEAD verified as `efe43dac53ce641e36e995b87e951e7181ddc295`.
- All **216 SHA-256 hashes** in `review-target.json` matched before review and again immediately before writing this report.
- Root is the maker of localization and the earlier boutique changes. This reviewer received the task brief and current scope/evidence documents, without inherited conversation history; the reviewer did not make product changes or delegate.
- Review was read-only in the **same filesystem**, without a separate checkout. Root's fixture development server at `http://127.0.0.1:4321` was reused. No build, asset preparation, server stop, CMS change, external navigation, deployment or production request was performed.
- Only this authorized report was written. Browser contexts were disposable. Maker test logs and saved PNGs were read, not overwritten.

## Required finding

### [P2] English 404 uses Thai content and sends the reader to Thai home

Location: `src/pages/404.astro:7–10`.

`/en/not-a-page/` and `/en/news/` correctly return HTTP 404 and `html lang="en"`, while their title, description, heading and home-link text remain Thai. The home link points to `/`. This violates the approved requirement to localize common error text/metadata and breaks the English recovery path. It also makes the document language disagree with its main content.

Own executed Playwright result for both URLs at 320 × 900:

```json
{"status":404,"lang":"en","title":"ไม่พบหน้า · A Cup of Zoo","main":"ไม่พบหน้านี้\n\nกลับหน้าแรก","meta":"ไม่พบหน้าที่ต้องการในเว็บ A Cup of Zoo"}
```

Use the request locale to translate the 404 title, description, heading and recovery label; send English readers to `/en/`. Preserve 404 status and the absence of a translated news route. Recheck both language error paths and English recovery by clicking the link before acceptance.

## Source inspection

Read the five shared page templates, TH/EN wrappers, locale helpers, complete menu/activities translations and their Thai catalogs, venue fixture/mapping, Header/Footer/Layout/Picture/ContentUnavailable, hours formatting, SEO head/metadata/sitemap/robots/middleware/config and localization tests.

- **Content PASS:** all 47 dish codes have English names and notes, with the seven rice dishes' price options and ten sandwich add-on rows. English functions spread original numeric/provenance/image fields and change text only. Names, notes, units and caveats were compared against the Thai source; no added drink/dessert prices, allergen claims, safety assurances or English-service promises were found.
- **Activities/visit PASS:** both passes, benefits, zone groups, feeding offers/regular promotion price, child height/adult/sock terms, 18:00 outdoor cutoff, hours/Tuesday caveat, address/map/phones and parking qualification are retained.
- **CMS fallback PASS by source plus maker unit evidence:** known strings use exact source-key matches. Unknown Thai address content is omitted, unknown FAQ answers expressly say translation is unavailable, and changed Thai activity descriptions are excluded. CMS is not edited. No claim is made that a live CMS outage or production update was exercised independently.
- **News PASS:** English primary nav/footer say `News (Thai)`, point to original news, and the news language control returns to English home. There is no English news page or bilingual news alternate. Its English 404 content is the finding above.
- **SEO PASS within local/source scope:** locale text, OG locale, Menu JSON-LD language, paired alternates and locale-specific business URLs are wired consistently. Production canonical/hreflang/sitemap use configured Astro origin, with one shared `#cafe` identity. The current placeholder domain remains intentionally unconfigured. This is source inspection, not a production deployment/render or search-engine verification.
- Thai promotional entrance image is conditionally restricted to Thai activities; necessary admission/child/activity information is English text on the English page. Proper names/signs inside original photos are permitted by scope.

## Own executed interaction and DOM evidence

Commands used: PowerShell `Get-Content`, `git rev-parse HEAD`, `Get-FileHash -Algorithm SHA256`; disposable inline Node scripts supplied by PowerShell here-strings to **`node --input-type=module`**, importing **`chromium, expect` from `@playwright/test`**, launching Chromium and calling the already-running local server. These scripts did not create test files or modify assertions.

- Independently visited **60 primary page states**: five pages × TH/EN × 320/390/1440 × light/dark, height 900. All returned 200. No document-width overflow, completed broken images or Thai characters in English body/alt/aria-label/title/meta were observed. This DOM scan does not by itself prove all lazy images or visual quality; saved render evidence and visual inspection support those separately.
- At **320**, clicked English home primary Food menu → Rice dishes category (heading in viewport) → gallery open → TH → EN, preserving `#rice`. Opened mobile navigation and closed it with Escape. Clicked sticky Plan your visit → child-admission link → `/en/activities/#passes`, scrolled child terms into view, verified `100 cm` and `49 THB`, then clicked Opening hours & directions.
- Confirmed directions href is the original Google Maps place URL, Facebook href is the original page, and phone hrefs are `tel:+66989838037` and `tel:+66922791890`. Did not visit external destinations or initiate calls.
- Clicked footer `News (Thai)` → original news → `English home` → `/en/`.
- In a separate **JavaScript-disabled 320** context, clicked all **nine** menu-category links and back links, opened/closed all **eight** galleries, then used sticky visit and the child-admission link successfully.
- Independently compared all DOM numeric tokens for TH/EN: menu plus extras **125**, pass/experience/animal-food blocks **31**, hours plus visit band **77**; exact ordered equality in each pair. This supports price/portion/contact preservation, with source inspection covering translation meaning.
- Independently confirmed local robots header/meta `noindex, nofollow`, `/robots.txt` `Disallow: /`, and empty local `/sitemap.xml`.
- English 404 reproduction produced the sole required failure above.

## Render/usability review

Reviewed maker PNGs with `view_image`: English home 320 light and 1440 dark, cover 320 dark/390 light/1440 light, passes 320 dark, food 390 light, visit 320 light, animals 320 light/1440 dark, activities 390 dark and menu 320 light. Long full-page images are scaled by the viewer; detailed cover/pass/food captures were used for close reading rather than treating tiny full-page text as proof of legibility.

English headings and labels wrap; primary home actions remain visible; header controls and doodles occupy separate areas. The boutique palette/photos/illustrations survive in both themes. Dense admission and rice-option information is structured into lists, price rows and category navigation. Fixed mobile menu/visit actions remain usable while scrolling and reaching child terms. Their appearance across a full-page capture is capture behavior, not a finding that underlying content is unreachable; actual scroll/click checks were run. Repeated home and sticky actions are purposeful; no global ban on duplicated controls is proposed.

Maker evidence read and accepted as maker evidence: Astro check **54 files, zero diagnostics**; unit **22 pass**; full E2E **22 pass**; affected E2E **7 pass**; final build complete; render matrix **60 pages/96 PNGs**. Reviewer did not rerun those build/test commands. Root's additional BrowserOS visitor journey is likewise maker evidence and was not substituted for the reviewer's own interactions.

## Acceptance state

No further actionable finding was found in the approved primary-page scope. No optional gap blocks this task beyond the 404 defect. **FAIL remains until the required finding is fixed, affected checks are rerun, and the revised frozen target receives follow-up review.** Production deployment, live CMS state and external map/phone execution were excluded from scope and are not missing acceptance evidence for this local task.
