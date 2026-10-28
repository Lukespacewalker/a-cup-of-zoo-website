# Complete map release — 28 October 2026

Published to https://acupofzoo.com and https://www.acupofzoo.com after the user's explicit “Deploy เลย” instruction. Version `59c5411c-36fd-40f7-a466-c6b6ea73e163`; previous version `a80dc0e8-2a24-46f0-bedd-a86f192ab053`. See [deployment receipt](deployment.json).

The map now covers all 16 numbered places in the owner's illustration plus the restroom and both parking areas, for 19 pins. Stops without photos retain their names/details. The bottom large-map disclosure was removed; the primary zoom remains. Thai/English activities lists now contain 16 places.

## Verified package

Deployed the exact saved build from the completed map correction, rather than rebuilding the shared checkout after unrelated voting work appeared. The 182-file bundle was copied to `C:/Users/Sutti/.codex/artifacts/acupofzoo-map-complete-release-2026-10-28/dist/`, frozen with SHA256 hashes, and confirmed to contain no voting routes. All bundle hashes matched before deployment and after public verification. This release preserves the existing Worker, custom domains, fixture content and indexing configuration.

Prior validation was reused: Astro check had 80 files with zero issues, production build passed, 26 unit tests passed, and the independent illustration/source inventory review passed. The exact saved Worker additionally passed all 10 affected browser tests through Wrangler's local CLI runtime, including every pin at 320/390px, all 16 source numbers, photo-free details, locale links, keyboard, zoom and no-JavaScript links. Only artifact import paths/server URL were adapted; repository assertions were preserved.

Initial artifact test imports required correction, and a Bun-hosted test harness did not respond to requests. Replacing that harness with Wrangler's supported local CLI server resolved the navigation timeouts; the final 10-test run passed in 34.1 seconds. Wrangler dry run passed before publishing. Deployment used the existing `nawaratthinsook` profile and kept dashboard variables.

## Live acceptance

BrowserOS neo checked all 15 sitemap routes on both apex/www: 30 responses returned 200 with the expected canonical URLs and public indexing. All eight map-page responses (home/activities, Thai/English, both domains) contained 19 pins and no bottom map disclosure. Public robots files retained `Allow: /`.

Root inspected live DOM state at desktop 1440px and mobile 390px: numbers 1–16, all 19 pins, loaded illustration, no horizontal overflow and no bottom disclosure. Native place selection opened Desert Garden without an image; keyboard activation closed details and toggled zoom with working map overflow on both pages. Browser pointer clicks under emulation were unreliable in the tool, so live activation evidence is explicitly keyboard/picker evidence; direct touch was exercised by the saved-Worker browser suite.

Saved deployment log, bundle manifest, reviewed-source manifest and live UI/HTTP results are retained in the release artifact directory above. Source changes remain uncommitted. No CMS, authentication, database or voting changes were deployed.
