# Footer, social links and public indexing — 27 October 2026

PASS for the saved 15:55 build, deployed as `8556b10b-60bf-4578-9093-efc3477eae35`. The previous version was `063e6f63-2955-484d-aedd-094ba6194851`.

The user's explicit request to remove noindex supersedes the earlier instruction to keep the public site blocked until CMS deployment. Only the canonical HTTPS apex and www host are indexable. The CMS connection remains separate; the website still uses fixture content.

## Frozen target and isolation

The independent reviewer verified the [19-file source target](source-target.json) before concurrent interactive-map work changed the shared checkout. The deployment uses the unchanged saved build at `C:/Users/Sutti/.codex/artifacts/acupofzoo-footer-2026-10-27/dist`, excluding that unfinished map work. No shared source edits were reverted.

The [bundle manifest](bundle-manifest.json) has 180 files. Its JSON SHA-256 is `f2dc49706f1270faff8db65e7538f707656eb41896daf8b16d4bc73f7b82ab11`. Root rechecked every file before deployment. The reviewer independently computed the equivalent sorted-path/content-hash digest `b689f5fb9641bf64ed35f762d7c704e78464de63a36177ec69f644f5ce3c9ac8`.

## Verification

- Astro check: 77 files, zero errors/warnings. Unit tests: 26 passed. Build and Wrangler dry run passed.
- Browser suite against the saved Worker: 33 passed. One locale test assumed port4321 while the isolated server used52201; an artifact copy changed only the port and import location, preserved all assertions, and passed its rerun. The new map suite belongs to concurrent work and is outside this bundle.
- [Built Worker indexing checks](built-indexing.json): 15 synthetic HTTPS requests verify metadata, headers, canonical URLs, language alternates, robots, sitemap and404 behavior.
- Root inspected actual BrowserOS renders: desktop Thai footer and home invitation; mobile Thai footer; English dark footer and home invitation. Address, phone and profile labels remain readable, layout stacks cleanly, and there is no horizontal overflow. Contact tests cover320/390/1440 widths, both languages, links at least44px high and keyboard focus. Root clicked the real theme control to switch modes.
- Independent reviewer: read-only source review, verified frozen source/build hashes, and independently ran11 indexing/SEO tests. PASS; no required findings. Visual acceptance relies on Root's observations, with maker involvement disclosed.
- [Live deployment receipt](deployment.json): all15 sitemap routes return200 with canonical URLs and without noindex. Apex/www robots allow crawling and list the15-route sitemap. Preview and missing routes remain blocked. All15 pages show two phone links and three social profiles. Root inspected the live mobile footer.

Logs and local verification scripts remain under `C:/Users/Sutti/.codex/artifacts/acupofzoo-footer-2026-10-27`. Build/cache output moved there because H: lacked free space; no existing source or cache was deleted.

## Content clarification

The archived Canva dog/cat poster contains13 dog cards and3 cat cards. MINE and YIN-YANG each appear twice, leaving11 distinct dog names; the cat labels are TART, SUM-LEE and VERES. These cards were identified in response to the user's question but are not added by this footer/indexing update. The live roster remains five fox profiles and one meerkat group card.
