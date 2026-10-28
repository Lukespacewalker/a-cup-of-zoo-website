# Unified animal discovery and voting

User approved the generated concept and explicitly requested the live website change. This is the current plan for this follow-up; the prior voting deployment plan is complete history. Root implements inline using executing-plans and proportionate TDD, then obtains one fresh read-only review. No additional approval pause is needed for the already authorized deployment.

## Outcome and constraints

- One animal directory at `/animals/` and `/en/animals/`, preserving all published CMS animals, descriptions, images and stable IDs. Existing `/vote/` links redirect permanently to the matching directory anchor; sitemap and homepage link use the unified page.
- Normal cards show the real CMS photo, name, description and exact score. Successful votes temporarily transform the image area into a circular portrait above a glass jar, with one new falling ball, then restore the photo. Layout and keyboard focus stay in place. A score-jar toggle lets visitors inspect the jar without voting. Repeated votes remain allowed.
- One ball equals one vote. A full jar holds 50; `fullJars=floor(count/50)` and `balls=count%50`. Keep the exact total and a localized full-jar/remainder label. Animate the fiftieth ball before storing that full jar. Never scale against other animals or reset CMS scores.
- Preserve current warm paper/olive/watercolor style, light/dark themes, 320px mobile and reduced motion. Only acknowledge successful CMS responses. Keep useful discovery content when scores are unavailable and provide no-JavaScript reading.
- Search reads the CMS name/description directly. Ruling: use a name/breed search instead of the concept's species chips because CMS has no species field; adding animals must not require a hardcoded species map or backend migration.
- Reuse the existing shared checkout after confirming the CMS/FARM owner is idle and release `83f8c452-54e2-40a0-955f-bfc498045cfe` is accepted. Preserve FARM/Club and unrelated dirty work; save exact before snapshots. No CMS/API/auth/migration changes, no bulk commits.

## Tasks and evidence

- [x] Snapshot touched sources and write failing jar arithmetic tests for 0/1/2/49/50/51/100/103/large totals.
- [x] Implement bounded exact jar model, unified cards/controller, stable inline feedback, search and persistent jar inspection; keep homepage podium compact.
- [x] Merge the page content and redirects/links, preserving zone/pass information. Update integration assertions to the unified routes and execute real disposable CMS → website → voting checks.
- [x] Test actual interactions against disposable state: 0→1→2, 49→50→51, repeated votes, failures, search, keyboard, reduced motion, Thai/English/mobile and image loading. Run Astro check, relevant unit/browser tests and production build.
- [x] Freeze exact reviewed source and build, obtain fresh read-only final review, resolve findings, dry-run and deploy. Verify live pages, redirects, preserved totals, search/navigation and one intentional acceptance vote if needed. Record version, hashes and evidence.

Completed: [release evidence](../../review/unified-animals-2026-10-28/README.md). Independent review PASS after refresh-link and English320px label fixes;9 browser tests,34 unit tests/340 assertions,98-file Astro check,43 compiled integration assertions and72 live read-only checks passed. Version `6a9de7ed-da00-422b-863c-f867f3221ac9`; Dorayaki acceptance vote0→1, all other existing scores preserved.

