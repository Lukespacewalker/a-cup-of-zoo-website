# Independent TH/EN acceptance review — 27 September 2026

Final verdict: **PASS** for frozen target revision 2. The sole initial finding is resolved and independently rechecked. Primary routes, content parity, visitor journey, error recovery and supported layouts satisfy the approved local TH/EN scope. This report does not grant deployment approval. The unchanged initial FAIL report is preserved in [independent-review-initial.md](independent-review-initial.md), with its frozen target in [review-target-v1.json](review-target-v1.json).

## Target and independence

- HEAD verified as `efe43dac53ce641e36e995b87e951e7181ddc295`.
- All **216 SHA-256 hashes** in the initial target matched before and after initial review. All **227 SHA-256 hashes** in revision 2 matched before follow-up review. Revision 2 includes 102 PNGs.
- Root is the maker of localization and the earlier boutique changes. This reviewer received the task brief and current scope/evidence documents, without inherited conversation history; the reviewer did not make product changes or delegate.
- Review was read-only in the **same filesystem**, without a separate checkout. Root's fixture development server at `http://127.0.0.1:4321` was reused. No build, asset preparation, server stop, CMS change, external navigation, deployment or production request was performed.
- Only this authorized report was written. Browser contexts were disposable. Maker test logs and saved PNGs were read, not overwritten.

## Resolved initial finding

### [P2] English 404 uses Thai content and sends the reader to Thai home

Location: `src/pages/404.astro:7–10`.

In the initial target, `/en/not-a-page/` and `/en/news/` returned HTTP 404 and `html lang="en"`, while their title, description, heading and home-link text remained Thai. The home link pointed to `/`. This violated the approved requirement to localize common error text/metadata and broke the English recovery path.

Initial independently executed Playwright result for both URLs at 320 × 900:

```json
{"status":404,"lang":"en","title":"ไม่พบหน้า · A Cup of Zoo","main":"ไม่พบหน้านี้\n\nกลับหน้าแรก","meta":"ไม่พบหน้าที่ต้องการในเว็บ A Cup of Zoo"}
```

The revision uses request locale to translate all these fields and route recovery to `/en/`. Unsupported language switches explicitly route to opposite-language home. The fix preserves HTTP 404 and the absence of a translated news route. **Resolved; no outstanding finding.**

## Follow-up review of revision 2

Compared target manifests: the only product changes are `src/pages/404.astro` and `src/components/site/Header.astro`; the localization E2E file and final build evidence also changed. Eleven added files contain the 404 render/check/test evidence. All other frozen files match revision 1, so unchanged source, data, layout and interaction evidence below remains valid. No future watercolor scope was inspected or accepted.

Read the revised 404/Header and regression test. English labels use `lang="en"`; unsupported routes say `Thai home`/`English home` and switch to `/`/`/en/`, while primary-page switches preserve their equivalent route/hash.

Own follow-up command: a PowerShell here-string piped to `node --input-type=module`, importing `chromium, expect` from `@playwright/test`, reusing the local fixture server. Disposable contexts exercised **12 English error states**: `/en/not-a-page/` and `/en/news/` × 320/390/1440 × light/dark, height 900. Every response was 404, `lang=en`, title `Page not found · A Cup of Zoo`, description `The page you are looking for could not be found at A Cup of Zoo.`, heading `Page not found`, no Thai body/alt/aria/metadata, no horizontal overflow and no false hreflang. In every state, actually clicked **Back to home → `/en/`** and **Thai home → `/`**.

Independently exercised Thai `/not-a-page/` (404, Thai heading and `/` recovery) and `/news/` (200, Thai document), clicking `English home → /en/` in both. Rechecked TH menu `#rice` → EN equivalent → TH, preserving page/hash. No regression found.

Visually inspected revised maker PNGs `en-404-320-light.png`, `en-404-390-dark.png` and `en-404-1440-light.png` with `view_image`: readable heading/recovery link, coherent header/footer, no control overlap; the 320 language label wraps inside its button. Maker evidence, distinctly from own interactions: pre-fix regression failed on the missing English heading in `404-red.log`; final E2E **23 pass**, final check **54 files/zero diagnostics**, final Astro build complete, and six 404 renders. These evidence logs were inspected, not independently rerun.

## Source inspection

Read the five shared page templates, TH/EN wrappers, locale helpers, complete menu/activities translations and their Thai catalogs, venue fixture/mapping, Header/Footer/Layout/Picture/ContentUnavailable, hours formatting, SEO head/metadata/sitemap/robots/middleware/config and localization tests.

- **Content PASS:** all 47 dish codes have English names and notes, with the seven rice dishes' price options and ten sandwich add-on rows. English functions spread original numeric/provenance/image fields and change text only. Names, notes, units and caveats were compared against the Thai source; no added drink/dessert prices, allergen claims, safety assurances or English-service promises were found.
- **Activities/visit PASS:** both passes, benefits, zone groups, feeding offers/regular promotion price, child height/adult/sock terms, 18:00 outdoor cutoff, hours/Tuesday caveat, address/map/phones and parking qualification are retained.
- **CMS fallback PASS by source plus maker unit evidence:** known strings use exact source-key matches. Unknown Thai address content is omitted, unknown FAQ answers expressly say translation is unavailable, and changed Thai activity descriptions are excluded. CMS is not edited. No claim is made that a live CMS outage or production update was exercised independently.
- **News PASS:** English primary nav/footer say `News (Thai)`, point to original news, and the news language control returns to English home. There is no English news page or bilingual news alternate. Its English 404 content is now resolved and rechecked above.
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
- Initial English 404 reproduction produced the sole required failure; revision 2 resolves it with follow-up evidence above.

## Render/usability review

Reviewed maker PNGs with `view_image`: English home 320 light and 1440 dark, cover 320 dark/390 light/1440 light, passes 320 dark, food 390 light, visit 320 light, animals 320 light/1440 dark, activities 390 dark and menu 320 light. Long full-page images are scaled by the viewer; detailed cover/pass/food captures were used for close reading rather than treating tiny full-page text as proof of legibility.

English headings and labels wrap; primary home actions remain visible; header controls and doodles occupy separate areas. The boutique palette/photos/illustrations survive in both themes. Dense admission and rice-option information is structured into lists, price rows and category navigation. Fixed mobile menu/visit actions remain usable while scrolling and reaching child terms. Their appearance across a full-page capture is capture behavior, not a finding that underlying content is unreachable; actual scroll/click checks were run. Repeated home and sticky actions are purposeful; no global ban on duplicated controls is proposed.

Maker evidence read and accepted as maker evidence: Astro check **54 files, zero diagnostics**; unit **22 pass**; full E2E **22 pass**; affected E2E **7 pass**; final build complete; render matrix **60 pages/96 PNGs**. Reviewer did not rerun those build/test commands. Root's additional BrowserOS visitor journey is likewise maker evidence and was not substituted for the reviewer's own interactions.

## Acceptance state

**PASS for revision 2.** The required 404 defect is fixed and independently verified; no actionable finding or blocking optional gap remains in the approved TH/EN scope. Valid unchanged evidence is reused rather than rerun. Production deployment, live CMS state and external map/phone execution were excluded from scope and are not missing acceptance evidence for this local task.
