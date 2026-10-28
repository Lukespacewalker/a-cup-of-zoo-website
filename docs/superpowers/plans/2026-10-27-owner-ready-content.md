# Owner-ready content and shared CMS MCP

Status: implementation and website deployment complete; checks and independent local review PASS. Owner: Root. The production CMS and real AI-client connection remain separate launch work. The user authorized implementation of work supported by the archived owner brief, then specified the Portfolio CMS platform and AI editing through MCP, and subsequently authorized publishing the reviewed website update.

## Current follow-up: search visibility and contact/social design

Status: complete and deployed as `8556b10b-60bf-4578-9093-efc3477eae35`. The user's request to remove noindex, improve footer contact details, and invite home-page visitors to follow Facebook, Instagram and TikTok is verified live. Instagram/TikTok handles are both `@acupofzoo`, supplied by the user. [Review and deployment evidence](../../review/footer-social-2026-10-27/README.md). The immutable15:55 build excludes concurrent unfinished interactive-map changes in the shared checkout; those edits are preserved.

Design: retain the paper/garden palette, use a readable three-column footer on desktop and stacked sections on mobile. Show the current venue address, map and both phone links; social links use recognizable icons with visible platform names and handles. A compact home-page invitation appears before the visit-planning section, with an existing watercolor animal motif and direct profile links. Do not embed third-party feeds. English gets equivalent copy; changed CMS addresses remain visible in their original language when translation is unavailable.

Search visibility is independent of CMS deployment readiness. Add explicit `SEARCH_INDEXING=enabled`, set the canonical site to `https://acupofzoo.com`, and share one indexing policy between head metadata, middleware, robots and sitemap. Only the canonical host and its www equivalent over HTTPS may be indexed. Localhost, workers.dev, font-preview and errors stay noindex; production's fixture-content guard remains intact. Enable canonical/hreflang and a sitemap for the approved public content without pretending the CMS is deployed.

Implementation: update Footer/SiteLayout/HomePage; add small shared social-link/icon components, social account data and styles; update SEO/runtime/config routes. Meaningful tests cover indexing host/path/enable controls and actual Footer/social links at desktop/mobile in both languages. Reuse existing unaffected checks. Acceptance: fresh check/unit/build and browser evidence, a read-only review of the frozen delta, deploy, then confirm live meta/header/robots/sitemap plus working contacts and social links. No migrations or authentication changes.

## Deployment follow-up — 27 October 2026

Historical decision: the noindex requirement in this section is superseded by the current search-visibility follow-up above. Keep this record for the earlier deployment.

The user subsequently authorized publishing this reviewed website update ("เอาขึ้นได้เลย"). Deploy to the existing `a-cup-of-zoo-preview` Worker and its `acupofzoo.com` / `www.acupofzoo.com` domains using the verified `nawaratthinsook` account. Preserve the existing staging/fixture and noindex settings until the production CMS and owner's AI client are connected. Recheck source hashes, build and dry run; deploy; then verify public bilingual routes, source images and key navigation. Record the deployment version and actual online evidence. This supersedes the earlier no-deployment boundary for the website update only.

Completed: version `063e6f63-2955-484d-aedd-094ba6194851` deployed successfully. All 70 reviewed code/asset hashes still matched before deployment. Fresh check, 24 unit tests, content validation, build and Wrangler dry run passed. Root verified 45 public page responses through BrowserOS neo, live language switching, image loading, mobile overflow and keyboard map expansion; the missing route returns 404. [Deployment evidence](../../review/owner-ready-2026-10-27/deployment.json).

## Outcome and constraints

- Preserve the current bilingual site and existing 47-item food catalogue. Add the two owner-provided menu-book links, an expandable shop map, named animal profiles, group/event information, Zoo Clubs information, and partner logos.
- Use the existing CMS platform and the separate `acupofzoo` project profile. Add narrow venue MCP tools over the existing application use cases; drafts and publication remain separate, version checked, and audited as AI actions.
- Keep existing accepted contact numbers. Source brochure phone numbers are superseded; show only the map illustration area, with the existing HTML legend/contact details outside it.
- No production deployment, new authentication system, migrations, membership backend, live camera, games, invented service prices or partner benefits. Frontend source content is not claimed to be CMS editable until mapped to a contract and read by the public frontend.
- Reuse the current checkouts with one writer. Existing uncommitted website and CMS prototype work is the required baseline; preserve unrelated edits. Snapshot touched pre-existing files before editing. No blanket commit/reset.

## Work and acceptance

1. Record baseline and add meaningful tests for menu links, new bilingual pages, native map expansion, mobile overflow and venue MCP draft/publication workflow.
2. Add source-backed site content, localized routes and discoverable navigation; optimize source images through Astro and preserve the established theme.
3. Add project-scoped venue MCP read/save/publish tools, workflow documentation, and tests for validation, stale versions, publication isolation, audit actor and other project tool lists.
4. Run website check/unit/build and relevant browser interactions. Run affected CMS tests plus required shared checks/builds. Inspect desktop/mobile renders and actual interactions.
5. Obtain a fresh read-only review of the exact final files/hashes, address required findings, and report completed local changes and remaining launch inputs.

## Evidence and remaining work

Requirements: [owner brief extraction](../../owner-feedback-2026-10-27.md). Source images are archived under `reference-data/owner-feedback-2026-10-27`.

The domain binding is recorded separately in README; this task still needs a reachable production CMS, production content settings, deployed dependencies and a production publish decision. GTM requires an actual container ID. Membership API, vote rules, camera source, games and automated article ingestion remain separate requirements.

## User scope clarification (same session)

The owner will also have code access. CMS/MCP owns changing articles/news, animal photos and roster, opening hours and contact details. Code owns page structure, layout and new functionality; no generic page builder is requested.

Implemented extension: animal cards read the published venue roster (fixture supplies initial owner artwork only), optional English animal text and additional phone numbers in the shared contract, published special hours on the site, snapshot-only post draft editing and café image upload tools. Footer/visit/event phone actions and business metadata consume CMS contact values. D1 venue writes now bind audit entity values and guard audit insertion using the immediately preceding update's success. Add an actual MCP-to-Astro integration check against a disposable CMS and isolated Cloudflare dev config.

Review fixes: resolve published media by referenced IDs in bounded queries; protect D1 post child writes and publication snapshots with a unique successful-operation audit ID; never restore old phones when CMS data is unavailable or the primary phone is explicitly cleared. Regression tests reproduced each defect before correction. Final verification: website check/build, 24 unit tests, 33 browser tests; CMS checks/builds and 88 tests; 11 actual CMS-to-Astro integration assertions with clean command exit. Detailed evidence and launch dependencies are in the [delivery record](../../owner-ready-changes-2026-10-27.md).
