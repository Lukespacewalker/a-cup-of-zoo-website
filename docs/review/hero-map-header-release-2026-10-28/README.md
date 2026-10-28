# Hero, full-width map and header release — 28 October 2026

Deployed successfully to **https://acupofzoo.com** and **https://www.acupofzoo.com**. Version `a80dc0e8-2a24-46f0-bedd-a86f192ab053`; previous version `8556b10b-60bf-4578-9093-efc3477eae35`. [Deployment receipt](deployment.json) and [Wrangler output](deploy-profile.log).

The release includes compact full-width page heroes, prominent Zoo Clubs navigation/home introduction, the interactive full-width map and grouped header controls aligned to the right. Header language/theme controls remain adjacent at all checked widths. A narrow English layout initially exceeded the header edge by 3.6px; reducing only the menu button's side padding at 360px and below corrected it while preserving 44px language/theme targets.

## Evidence

- [Astro check](check.log): 80 files, zero errors/warnings/hints. [Unit tests](unit.log): 26 passed. [Final build](build.log) and [Wrangler dry run](dry-run.log): passed.
- [Full browser suite against the saved Worker](e2e-final.log): 39 passed, including map hover/select/close, touch, zoom, keyboard navigation, locale and theme persistence. Artifact copies adapted only the isolated server port and Playwright import path; assertions and repository tests were preserved. An initial artifact import-path setup error was corrected before tests ran.
- [Geometry checks](layout.json): 14 combinations of 320/390/768/1024/1051/1440/1920px and Thai/English. Controls align to the header edge, language/theme gap is at most 4px, touch targets are at least 44px, the map fills the viewport width and pages do not overflow.
- [Live HTTP checks](live-smoke.json): all 15 sitemap pages on both apex/www return 200 with the updated header, expected map/heroes, canonical URLs and public indexing. Preview remains noindex. The smoke script initially assumed a trailing space in a class attribute; the check was corrected to match a complete class token.
- [Live UI checks](live-ui.json): desktop 1440px and mobile 320/390px, right-aligned controls, dark theme, map select/close/zoom and English mobile Zoo Clubs navigation passed. Root inspected actual saved desktop/mobile renders. Root also used BrowserOS on the public site to switch language/theme and select a goat-house stop.

## Frozen build and scope

Base HEAD `1fc2599a9fa32ad6ab02760a93e425934adb6919` plus the recorded dirty/untracked source. The [source manifest](source-manifest.json) contains 173 source/assets files and the [bundle manifest](bundle-manifest.json) contains 182 output files. All hashes matched before deployment and after live verification. The exact saved bundle was deployed; cache/build/test output lives under `C:/Users/Sutti/.codex/artifacts/acupofzoo-release-2026-10-28/` because H: has limited space.

Prior independent map review was reused: ShopMap SHA-256 remained `2E8720F3A95953CC80E300133F85A1AC947D161709F970EF5227E0E21EF7EB67`. Hero/Club and footer/indexing review evidence remains in the earlier records. Root authored and verified the small header layout correction; this release does not claim a new independent review of the whole checkout.

An initial deployment attempt selected the unrelated default OAuth account because the generated config lives outside the project directory. It failed before changing the Worker. Explicit `--profile nawaratthinsook` used the existing directory-bound project profile and completed deployment; no new login or account changes were needed. Existing fixture-content and public-indexing configuration was preserved. No CMS service, authentication or database migration was deployed.
