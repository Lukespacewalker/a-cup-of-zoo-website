# CMS Cloudflare rollout coordination — 28 October 2026

## Current accepted website — Three.js podium and jar stickers

**PASS**: website `d99b1af6-25b6-45b3-8dfd-fd189c5afb30` on apex/www. Shared Three.js podium on home and animals, circular portraits stuck on jars, miniature full jars ×N, heart total/top refresh and straight paper controls.96 live checks/34 page responses passed.23 animals and all pre-existing scores retained; deliberate Nama acceptance vote62→63, total70→71, others unchanged. CMS API/Admin/FARM unchanged; no deployment hold remains. [Release evidence](review/animal-podium-2026-10-28/README.md). This section supersedes the prior website visual treatment below; earlier entries remain history.

## Previous accepted website — unified animal directory and voting

**PASS**: website `6a9de7ed-da00-422b-863c-f867f3221ac9` on apex/www. Animals and voting share `/animals/` and `/en/animals/`; old vote routes301 to the directory. Exact1 vote=1ball,50 per full jar, circular portrait and inline effect, CMS-driven search. All23 animals and their scores preserved.72 live read-only checks/34 page responses,23 decoded animal images,5 Club tiers and19 map pins verified. One acceptance vote Dorayaki0→1; previous Nama21/Daifuku2 unchanged, total23→24. [Release evidence](review/unified-animals-2026-10-28/README.md).

Root completed the website release; no deployment hold remains. API `25a71fbf-2872-45e9-bee7-654aa3b79669` and Admin `f1f3ab53-2762-459c-a181-e3acd85d5a75` unchanged. CMS/MCP/FARM remain as accepted below. This website section supersedes the prior website version and proportion-based jar UI; retain earlier rollout entries as history.

## Previous accepted release — CMS and FARM complete

**PASS**: FARM website version `83f8c452-54e2-40a0-955f-bfc498045cfe`, API `25a71fbf-2872-45e9-bee7-654aa3b79669`, Admin `f1f3ab53-2762-459c-a181-e3acd85d5a75`. Additive migration0013 applied. MCP exposes17 tools; legacy and modern SDK connections both verified. API71 checks and website20 checks pass. Venue version2,23 animals,28 images and two existing votes are preserved. Zoo Clubs images remain reachable.

Public listings: https://acupofzoo.com/farm/ and `/en/farm/`. No sale listings are invented; the current empty state invites contact through LINE. Admin supports images, description, baht price, draft, explicit publish and archive. Archived records/images remain available internally. The production article display test passed and its fixture is now archived.

Root owned this subsequent FARM release after the voting/Club release completed. This section supersedes earlier ownership holds, pending-rollout statements,13-tool counts and article-publication status below; those entries remain as history. [Release evidence](review/cms-farm-2026-10-28/README.md). Mac setup is documented in CMS `docs/acupofzoo-mac-mcp.md`; actual connection from the owner's MacBook remains pending there.

## Earlier rollout history

Storefront live acceptance is now **PASS** for version `4b18293c-4c0b-486a-860e-dfec07ca78c7`: 34 successful page responses across apex/www, 23 named animals/images, repeat voting and persistence, 320/390px layouts, 19 map pins and ZooClub live checks. Two real acceptance votes for Nama remain (total2); preserve them during later CMS updates. Production CMS variables are persisted in source Wrangler. The voting deployment task is complete; future FARM releases should retain this configuration and existing IDs/counts. Receipt: `docs/review/animal-voting-2026-10-28/deployment.json`.

Storefront release receipt: **deployed version `4b18293c-4c0b-486a-860e-dfec07ca78c7`**, containing voting and accepted ZooClub artwork, to apex/www with production CMS variables. Voting owner is performing live acceptance; ZooClub owner may inspect live club views now. Source `wrangler.jsonc` is updated to CMS production mode for future builds. See `docs/review/animal-voting-2026-10-28/deployment.md`.

Website coordination: the voting release owner received the ZooClub owner's deployment request and will include the accepted Tier artwork/UI in the same storefront release. The old 12:38 voting-only bundle will not be deployed. ZooClub owner is preparing the combined freeze/build; voting owner retains runtime-config/deployment ownership and CMS live acceptance. See `docs/review/animal-voting-2026-10-28/deployment.md`. FARM code remains a later release as agreed.

Status: **READY for storefront CMS mode and voting release**. Base CMS is deployed, authenticated, seeded and verified remotely. Website release owner may set `CONTENT_MODE=cms` and `CMS_BASE_URL=https://acupofzoo-cms-api.a-cup-of-zoo-website.workers.dev` and deploy the combined website with Club artwork. This chat has not deployed or changed storefront Wrangler configuration.

## Verified production handoff

- API version: `4c90769c-0c87-4188-b1da-db93305893df`.
- Compatibility follow-up API version: `cc756ea8-aa9b-4088-92ad-ea374048a5f3`; independent PASS plus12 tests/122 assertions and20 reviewer boundary checks. Live SDK connections now pass both initialization-based2025 and modern2026, each lists13 tools and reads venue. Admin and bindings unchanged. Mac setup documented in CMS `docs/acupofzoo-mac-mcp.md`; physical Mac execution not claimed.
- Admin version: `77bcc1d3-244b-4793-ae5a-df6436950a45`.
- All ten migrations through `0012_acupofzoo_animal_votes.sql` applied to the new café D1 successfully.
- Published venue version2, exactly23 distinct named animals,28 referenced R2 images all returning images with HTTP200, confirmed phones `+66989838037` and `+66922791890`.
- Initial vote totals: all23 candidates zero, total0; no vote writes performed by this chat.
- Remote checks:44 pass including anonymous401, Admin/MCP token separation, public no-store, images and Admin reachability. Modern MCP SDK connection discovers13 tools and reads venue successfully.
- Independent review: PASS for21 frozen files, matching HEADs/hashes,11 reviewer auth/profile/MCP tests and46 bootstrap assertions. Review accepted preparation; live checks above verify actual operation.
- Evidence: `C:/Users/Sutti/.codex/artifacts/acupofzoo-cms-launch-2026-10-28/` (`migrate-remote.log`, `deploy-api.log`, `deploy-admin.log`, `bootstrap-remote.log`, `verify-base-remote.json`, `mcp-client-check.json`). No credentials in this document.
- Follow-up owned here: add MCP initialization compatibility for older Codex/Claude clients (modern client already works), article smoke test, FARM listings and Mac setup. These do not block current public venue/voting endpoints. No FARM product code changes yet.
- Requested article smoke fixture now published through MCP: `cms-display-test`, ID `8b63b4ef-fa44-4a46-8822-7192f261e3de`, version2, bilingual, cover image, excerpt carries `[[demo]]` and explicit test titles. Draft404 and published public API verified. Storefront owner can include `/news/cms-display-test/` in live checks after CMS mode. Kept visibly labelled for review.

Rollout sequencing: publish the already-reviewed CMS/animal/voting base first so the website owner can deploy voting, then add FARM listings in a subsequent reviewed CMS update. No listing product code has changed yet. The first named-profile OAuth refresh accidentally omitted the separate `workers_scripts:write` scope; correcting that now before further deployment. D1/R2 creation succeeded; Worker deployment access is not claimed until rechecked.

Access correction complete: named profile now includes `workers_scripts:write` alongside account/user/Worker/routes/D1 permissions. `wrangler deployments list --config wrangler.jsonc --profile nawaratthinsook` succeeds and confirms live website version `59c5411c-36fd-40f7-a466-c6b6ea73e163`. No website deployment has been made by this chat.

CMS owner: this chat (Cloudflare CMS, FARM listings). Website release/vote verification owner: the animal/voting chat per its coordination message. This chat will not deploy the storefront or edit its Wrangler CMS mode while that release is in progress. FARM storefront changes will be prepared after the CMS interface is ready, with their release coordinated through this record. No chat message was sent back; shared project documentation is the coordination channel.

## Provisioned resources

- Account: `033dbd2d33d8bb93fcc2930c22752d8a`, profile `nawaratthinsook`.
- R2 activated successfully via BrowserOS Neo; due now $0, usage beyond included allowance is billed under Cloudflare's displayed terms. Bucket created: `acupofzoo-media` (Standard).
- D1 created: `acupofzoo-cms`, ID `0105228f-701f-4f75-be82-42d8e5da88d2`, region APAC. No remote migrations have run yet.
- Named Wrangler profile refreshed with existing Worker/account access plus D1. Read-only D1/R2 listing now succeeds. No secret values belong in this record.

## Live interfaces

- API base: `https://acupofzoo-cms-api.a-cup-of-zoo-website.workers.dev`
- MCP: API base + `/mcp`
- Admin: `https://acupofzoo-cms-admin.a-cup-of-zoo-website.workers.dev`
- Public venue, news and voting retain the reviewed contracts. Apply migration0012 with the other reviewed migrations before opening votes. The FARM implementation reuses Products under the acupofzoo profile with snapshot publication, adding its own ordered migration if required.

## Initial content and release gate

Import23 named Canva animals with stable IDs and source images; duplicate MINE/YIN-YANG cards represent one candidate each. Do not copy seeded test votes. Preserve existing production content/IDs if discovered; hide legacy generic records rather than silently creating duplicate visible candidates. The local importer remains localhost-only; use a separate explicit production bootstrap over authenticated APIs/MCP.

Only mark READY here after migrations, API/Admin deployment, secrets, confirmed venue publication,23 visible named animals/media and unauthorized/public/MCP checks succeed. Record exact endpoint and verification counts for the website owner. Do not switch the storefront to an unready CMS.
