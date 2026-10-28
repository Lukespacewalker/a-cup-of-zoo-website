# Café CMS Cloudflare launch, article smoke test and FARM listings

Status: deployed and verified for the Cloudflare/server/website scope. Physical MacBook client connection remains to be performed on the owner's machine. Root owns implementation and integration. The user authorized Cloudflare CMS/MCP deployment, a test article, Codex and Claude Code clients on a MacBook, and image/description/price listings managed through CMS/MCP without checkout. They explicitly directed setup through the signed-in BrowserOS Neo account. This is the current plan for this follow-up; completed animal/voting and website plans remain historical inputs.

Coordination update: the animal/voting chat received a user instruction to deploy and coordinate. It owns storefront CMS configuration, deployment and live vote verification; this chat owns CMS provisioning/deployment/data. Do not deploy the storefront concurrently. Publish readiness in [the shared deployment record](../../cms-cloudflare-deployment-2026-10-28.md). This ownership supersedes the initial single-owner storefront rollout wording below; FARM implementation/release remains within this task after coordination.

## Design and boundaries

- Use the existing acupofzoo CMS profile and reviewed animal/voting implementation. Separate API/Admin Workers, D1 and R2 from Portfolio and other projects, in the existing café account `033dbd2d33d8bb93fcc2930c22752d8a`.
- Intended hosts: `acupofzoo-cms-api.a-cup-of-zoo-website.workers.dev` and `acupofzoo-cms-admin.a-cup-of-zoo-website.workers.dev`; storefront remains `https://acupofzoo.com`. Replace the café profile's .invalid placeholders with these explicit deployment origins. Preserve other profiles.
- Reuse the existing Products aggregate for FARM listings: bilingual title/description, ordered cover/gallery images, nullable price in THB, draft/publication and archive. No inventory, checkout, payments or invented animals/prices. Café Admin presents these as listings and hides unrelated merchandise fields. MCP exposes explicit draft, image, publish and archive operations through shared application use cases.
- Café listings follow its existing snapshot publication policy: editing a published listing leaves the previous public version visible until explicit publication. Add an ordered snapshot migration if needed and preserve atomic optimistic locking/audit invariants in D1 and local adapters.
- Public `/farm/` and `/en/farm/` list only published listings, with localized detail pages and current phone/LINE enquiry actions. Empty and unavailable states are honest. Reuse existing visual patterns and keep routes accessible on mobile and keyboard.
- Test an explicitly labelled sample article and test listing against disposable local CMS first. Seed production with confirmed venue/animal data and media through authenticated APIs, preserving stable animal IDs and votes. Do not publish a fabricated sale listing. The requested article display test can use factual café information with a clear test label; record whether retained or archived after verification.
- Keep separate Admin/MCP bearer secrets outside source and logs. Prepare MacBook setup for both clients using environment/secure local secret storage. Verify real protocol negotiation and tool calls; do not claim MacBook installation when only instructions/local checks are possible.

## Work and acceptance

1. [x] Inspect previous work, project instructions and Cloudflare access. R2 activated via authorized UI; named Wrangler profile re-authenticated with existing Worker/account permissions plus D1. Empty D1/R2 inventories verified.
2. [x] Record baselines; implement listing snapshot/MCP/Admin behavior with regression tests for draft isolation, conflict, archive visibility, images and profile isolation.
3. [x] Implement storefront listings and exercise sample article/listing rendering against disposable CMS; inspect Thai/English desktop/mobile and keyboard flows.
4. [x] Add explicit deployment profiles, bindings, seeds and Mac client instructions. Run CMS check/test/build and profile dry runs; storefront affected checks/build/tests.
5. [x] Freeze source/build target and obtain independent read-only review for migrations, publication/archive safeguards and production configuration. Root fixes findings and reruns affected evidence.
6. [x] Apply reviewed migrations to the newly created café database, provision separate secrets, deploy API/Admin, seed confirmed data and connect storefront. Verify unauthorized rejection, MCP tools, publication isolation, images, live article and listing routes; record versions/resource IDs and remaining MacBook verification.

## Evidence and constraints

User workflow permits proceeding without another design approval. Production writes are authorized for this café rollout; no other CMS project or database is in scope. Do not reset/commit inherited dirty changes. No chat-to-chat messages without explicit authorization. Reuse the existing read-only reviewer for mandatory high-impact review. H: has space again, but preserve earlier C: artifacts and use task-specific disposable storage/log paths. No generated credentials may enter review files.

## Final acceptance

See [release evidence](../../review/cms-farm-2026-10-28/README.md). API/Admin/website are live; article display verified then archived; no fabricated sale listing published. The physical MacBook was not accessible from this Windows session, so installation there is documented but not claimed.
