# CMS animal management implementation plan

**Goal:** Owners can add, edit bilingual names/descriptions, choose/upload images, hide/show and order animals through Admin or narrow MCP tools without editing website code.

**Architecture:** Keep the existing `venue.animals` schema and stable IDs. REST and MCP share animal-specific application use cases using the current optimistic locking and audit repository. Publish only the animal roster, retaining unrelated draft and published venue fields. Enable only through the existing `venue-content` module.

**Scope (updated by the user's reply):** Include repeat voting, the homepage podium and the detailed score-jar page. Store counts separately in CMS with a new additive local migration; no remote migration or deployment is included. One published visible CMS roster item is one voting candidate (including existing group records). Votes accumulate without a voter account or duplicate-voter limit. The storefront's deployed fixture configuration remains an integration dependency; fixture mode must never fabricate scores or accept fake votes.

**Execution:** Root implements in the existing `CMS-Platform-acupofzoo` worktree, preserving its substantial pre-existing dirty/untracked state. Website scope includes the vote routes, homepage podium, animal roster link, initial source data and integration checks. Use executing-plans and TDD proportionately; do not create commits containing inherited work. Independent review uses exact hashes and the saved before-state.

**Source completeness update:** The user requested every animal from Canva. Page 4 was rechecked against the live viewer. The owner confirmed that MINE (20/21) and YIN-YANG (22/25) each identify one animal, with a shared score. The complete named roster is 23 animals: five foxes, four individually named meerkats, eleven dogs and three cats. Import as additive local CMS drafts, retaining existing records, scores and unrelated settings. Preserve originals and a traceable source manifest.

## Acceptance and constraints

- Stable IDs are generated on creation and cannot be renamed by animal update. Hiding retains the item and its ID; no hard-delete UI/tool.
- Saving never changes public content. Animal publication affects only animals; venue settings drafts stay private.
- Stale versions fail without writes/audit. Unknown IDs, missing images, duplicate/incomplete ordering and invalid fields fail clearly.
- Admin works in Thai and English, including image upload/selection, mobile layout, keyboard controls, loading/error/empty/conflict states, and explicit publish confirmation.
- MCP never needs a full venue payload for animal editing, retains token isolation and produces `ai/mcp` audit entries. Other project catalogs/navigation remain unchanged.
- Verify a real disposable CMS → MCP → published API → Astro render; no production state in tests.

## Tasks

1. [x] Contracts/application/REST/MCP: `packages/contracts/src/animals.ts`, venue domain publication method, animal use cases, animal HTTP routes, MCP registration. Add and run failing tests for preservation, publication, version conflict, invalid image/ID/order, project/auth isolation; implement and rerun.
2. [x] Admin: dedicated `/th/animals` and `/en/animals` route and navigation; list with reorder buttons; one focused editor; upload/choose image; save and roster-only publish. Reuse design tokens and existing form patterns. Test navigation and actual browser interactions with disposable storage.
3. [x] Verify and document: CMS check/test/build across profiles; focused storefront integration; actual desktop/mobile renders and interactions; independent read-only review. Update the MCP tool catalog and superseded owner-ready guidance. Record evidence and remaining production connection requirement.
4. [x] Voting storage/API: new `0012_acupofzoo_animal_votes.sql`, application repository/use cases and Bun/D1 adapters. Atomic +1 with minimal anonymous audit; eligibility checked against the published roster in the write transaction; name/image/publish/hide never reset totals. Public routes enabled only in `acupofzoo`. Tests cover repetition/concurrency, rollback, hidden/missing/draft animals and other profiles.
5. [x] Voting UI: `/vote/` and `/en/vote/`, homepage top-three teaser, same-origin Astro API proxy, exact numerical totals and at most 45 illustrative balls per jar. Graceful unavailable/empty/zero/tie states, mobile and reduced motion, repeat votes and persisted scores verified against disposable CMS.

## Review focus

- No other venue draft can accidentally publish with the roster.
- A stale editor cannot overwrite newer edits or silently discard local typing on query refresh.
- Changing animal name/image preserves ID and other animals.
- Hidden records remain recoverable and referenced older images still resolve.
- Upload failures, empty CMS setup and mobile controls offer a usable next step.

## Progress

## Authorized production rollout — 28 October 2026

The user requested deployment and coordination with the CMS chat. This section supersedes the earlier local-only stop for this task. CMS task `01a17b93-05df-7f00-b3f8-d10bb739a5db` owns CMS provisioning, configuration, migrations, secrets, API/Admin release and initial content. This task owns the storefront release and live voting acceptance; avoid simultaneous storefront deployment.

- [x] Confirm the CMS origin, reviewed migration and published roster of 23 named animals with images. MINE and YIN-YANG each retain one ID/count; no seeded test votes or duplicate generic legacy animals.
- [x] Freeze the combined accepted voting/ZooClub build, confirm it preserves the complete 19-pin map, and prepare production CMS runtime configuration. Preserve unrelated work in progress.
- [x] Run the exact release bundle against the real CMS, then Wrangler dry run and deployment using the café account. Record the previous/live versions and 214 unchanged bundle hashes.
- [x] Verify both languages and domains, complete roster/images, homepage podium, repeat voting and persisted totals, mobile layout, and public indexing. Live version `4b18293c-4c0b-486a-860e-dfec07ca78c7` passed; two acceptance votes for Nama remain in production. See the deployment record.

## Earlier local progress

- Source inspection complete. Existing worktree is `acupofzoo-local-prototype`; no new checkout needed. `.agents/design.md` referenced by Admin instructions is absent in both CMS checkouts, so use the implemented Admin components/tokens as the design reference.

- Implementation, local content import and required verification complete. See [current outcome and limitations](../../cms-animal-voting.md) and [review evidence](../../review/animal-voting-2026-10-28/README.md). No remote deployment was performed.

