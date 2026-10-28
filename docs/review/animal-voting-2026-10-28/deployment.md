# Voting production rollout — 28 October 2026

Status: deployed; live acceptance PASS. Website version `4b18293c-4c0b-486a-860e-dfec07ca78c7` is live on apex/www and the existing workers.dev URL. The frozen 214-file combined package was deployed with production CMS variables and retained dashboard variables. Deployment log: `C:/Users/Sutti/.codex/artifacts/acupofzoo-voting-release-2026-10-28/deploy-production.log`. ZooClub owner independently executed its live UI acceptance and reported PASS.

The user authorized deployment and coordination with the CMS task. CMS task `01a17b93-05df-7f00-b3f8-d10bb739a5db` owns API/Admin/storage/migrations and initial publication. The voting task owns the storefront release and live acceptance.

Coordination update: ZooClub task `01a18106-83f1-70c2-9c29-eb5350912063` reported the user's deployment/coordination request and its accepted artwork/UI changes. Include those changes in the final storefront release. The 12:38 voting bundle below is now verification evidence only and must not be deployed on its own. ZooClub owner is preparing a frozen combined build; voting owner will confirm its hashes, CMS runtime, map/voting checks and deploy once CMS is READY. ZooClub owner will check live club views. Keep one storefront deploy owner and record the combined build path here or in the ZooClub review record.

## Frozen storefront

- Prior live version confirmed through Wrangler: `59c5411c-36fd-40f7-a466-c6b6ea73e163` (complete map).
- Saved, previously verified build: `C:/Users/Sutti/AppData/Local/Temp/acupofzoo-voting-build-20261028`, created 12:38 local time.
- Release copy: `C:/Users/Sutti/.codex/artifacts/acupofzoo-voting-release-2026-10-28/dist`.
- `bundle-hashes.json` freezes 209 files. The only release configuration changes are `SITE_ENV=production`, `CONTENT_MODE=cms`, and `CMS_BASE_URL=https://acupofzoo-cms-api.a-cup-of-zoo-website.workers.dev`.
- Wrangler dry run passed: 64 modules, 145 assets; account and existing apex/www routes preserved. Dashboard variables will be retained on deployment.

## Additional exact-bundle verification

BrowserOS checked the saved Worker through local Wrangler: 19 map pins, 3 compact podium cards and no compact jars; full board 23 distinct animals and all 23 images loaded. At 390px there was no horizontal overflow. This initial render used fixture mode, so voting was correctly unavailable; it is not production CMS evidence.

The existing disposable CMS integration runner was adapted only to start the frozen Worker via Wrangler instead of Astro dev. All 43 assertions passed, including actual repeat +1, MCP changes/publication, private draft preservation, hiding/restoring with preserved scores, empty state, cross-origin rejection and outage. The first run hit a local ProxyWorker dropped connection on POST; enabling full transport logging and rerunning the unchanged Worker passed. Both logs are retained, and live production repeat voting remains a required acceptance check.

No production test animals or seed scores have been created by this task.

## Live acceptance

CMS handoff confirmed reviewed migrations, authenticated API/Admin, 23 published named animals, 28 referenced images, zero initial votes and 44 remote checks. The final storefront package read that live CMS successfully before deployment; all 23 animal images loaded and voting was ready.

After deployment, BrowserOS checked all 17 sitemap paths on apex and www: 34 HTTP 200 responses, correct canonical URLs, public indexing and `Allow: /`. Home retained 19 map pins and the 3-place voting podium in both languages. Animals and Vote each contained 23 named residents/candidates; all 23 portraits loaded in Thai and English. MINE and YIN-YANG each had one ID.

Actual native button clicks on the live Thai board voted for Nama twice: 0 → 1 → 2, with inline confirmation. Reload, the public totals endpoint and the English page on www all retained 2. These two acceptance votes remain in production; no resets or test animals were introduced. Thai/English boards at 320/390px had no horizontal overflow and all 23 vote buttons enabled. The native homepage detail link navigated to the full board; an immediate read preceded page rendering, so a selector wait and settled read confirmed all 23 jars. Actual live desktop dark and mobile light renders were inspected.

Evidence: [live browser interactions](live-browser.json), [apex HTTP checks](live-apex-http.json), and [ZooClub live acceptance](../zooclub-tier-artwork-2026-10-28/live-checks.json). ZooClub owner checked four live locale/domain routes, five loaded images, and 24 viewport/theme states. All 214 production bundle hashes matched again after deployment. Source `wrangler.jsonc` now persists the production CMS variables for subsequent releases.

## Combined candidate

ZooClub supplied `C:/Users/Sutti/.codex/artifacts/acupofzoo-club-integrated-release-2026-10-28/dist`, with 214 manifest files, from its accepted build. All supplied hashes matched before copying. The final production package is `C:/Users/Sutti/.codex/artifacts/acupofzoo-voting-release-2026-10-28/dist-production`, copied only from the supplied manifest to exclude generated local Wrangler state. `production-bundle-hashes.json` freezes those 214 files after the three CMS runtime variables are set.

The exact combined Worker passed all 43 disposable CMS/MCP/voting assertions (`combined-integration.log`). Product code and assets are byte-identical in the final production copy. ZooClub owner retains its frozen-bundle visual checks and will inspect live club pages; voting owner retains deployment ownership.
