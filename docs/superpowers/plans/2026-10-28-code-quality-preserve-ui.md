# Code quality refactor with unchanged UI

**Goal:** Address the code-quality review while preserving the deployed site's content, appearance, routes, accessibility and interactions.

**Baseline:** `e21f18ebe014fa3c0b551ef0dd49abd4f3b6c63f`, committed after “ออกแบบระบบโหวตสัตว์ใน CMS” completed its Three.js deployment (`d99b1af6-25b6-45b3-8dfd-fd189c5afb30`). This checkpoint contains the preceding work unchanged.

**Execution:** Root integrates the work. Independent writers use separate managed worktrees; workers do not delegate. No deployment or production writes are part of this task.

## Constraints and acceptance

- Keep visible Thai/English text, amounts, ordering, imagery, classes, IDs, links, heading levels and interaction behavior unchanged.
- Preserve the Three.js podium and voting implementation; verify against disposable local CMS data.
- Compare rendered output before/after at mobile and desktop sizes, including light/dark themes; inspect tablet and 320px behavior and keyboard interactions.
- User clarification: remove superseded implementations and style sets completely. Consolidate live effective values into the current styles before deleting the old layers; preserve effective specificity and responsive behavior.
- Existing checks must pass. Record pre-existing failures separately; do not weaken assertions to accommodate a refactor.
- Add focused regression tests for CMS timeout, optional/concurrent news loading, translation identity and structured membership benefits.
- Finish with a fresh-context review of a frozen commit/delta and record the validation evidence.

## Tasks

- [x] Wait for the voting chat to complete; run baseline type/unit checks and commit the current checkout.
- [x] Capture baseline UI/content/style evidence with controlled local data — 39 browser renders with viewport assertions, screenshots and per-element computed styles/geometry.
- [x] Root: fix the CMS factory timeout default and make news loading opt-in, concurrent with venue data when needed. Update callers without changing rendered content.
- [x] Data worker: replace position-coupled activity translations and prose-parsed membership benefits with keyed, explicit data. Preserve all rendered values and add identity/entitlement regressions.
- [x] Component worker: extract duplicated news cards and repeated event galleries; split coherent homepage sections and simplify dense farm markup. Preserve DOM semantics and selectors.
- [x] Root: consolidate overridden CSS, remove confirmed orphan components/props and stale styling, and provide repeatable formatting for the touched source.
- [x] Integrate isolated commits; run type, unit, content, build and appropriate browser/disposable voting checks.
- [x] Compare before/after rendered evidence, resolve material differences, complete independent review and commit the accepted refactor.

## Review focus

- Timeout and CMS failures must remain explicit and must never introduce fixture data into production.
- Homepage/news must still show the same posts and failure/empty states; unrelated pages must not request posts.
- Reordering activity source data must retain translations by ID, including equal-price food items.
- Membership benefit highlights and coupon separators must remain identical in both languages; wording must not control entitlements.
- CSS changes must preserve hover/focus states and both explicit/automatic dark themes; extracted components must not alter whitespace-dependent layout or scoped styles.

## Evidence ledger

- Baseline: `bun run check` — 101 files, no diagnostics; `bun run test:unit` — 34 passed, 340 assertions. Existing extra blank EOF line in `AnimalsPage.astro` is formatting debt to address during this refactor.
- Isolated data/component commits integrated as `30e8942` and `6c69ca5`. Data worker verified 38 unit tests and source-data equivalence; component worker verified 32 baseline fragment comparisons. These are source/fragment checks, not rendered acceptance.
- CMS factory regression first failed because AbortSignal was undefined; fixed default retains the bounded fetch. Optional/concurrent loading tests pass. Integrated suite: 42 tests, 360 assertions.
- BrowserOS viewport emulation was reset during asynchronous capture, so it could not establish controlled desktop evidence. The existing project browser-test runtime captured the 39 cases; BrowserOS remains the tool for additional manual interaction checks.
- Current CSS integrated as `192a53d`; legacy garden/watercolor/experience files removed. Six additional hover/focus/mobile-menu captures bring rendered comparisons to 45. Automatic dark shadow/card-sheet values were restored to their effective baseline values after comparison exposed a specificity difference.
- Existing browser assertions corrected: the accepted garden has 16 stops, including Desert Garden (the test still expected 15); locale URL expectations now use the configured baseURL rather than hardcoded port 4321. No product content was changed to satisfy either assertion.
- Root runtime/formatting commit: `a2c4f84`. Independent review initially FAIL: the CMS SDK swallowed a timed-out post body into null, and six unused legacy tokens remained. Root reproduced the post case RED, validated successful post payloads, removed the tokens and verified GREEN in `acd198c`.
- Final independent review: PASS at `acd198c49e17b9fdfd3fe2abeacae49a15e79ca7`. Fresh context, read-only, no maker involvement, shared filesystem; stateful browser/CMS receipts reused. No required blockers or deferred findings remain.
- Final evidence: 45 unit tests / 365 assertions, Astro check 104 files with no diagnostics, formatting, content verifier and build pass; 42 fixture browser tests, 16 disposable-CMS voting browser tests and 43 CMS/MCP/Astro integration assertions pass. Existing Three.js chunk-size warning remains. See [acceptance record](../../review/code-quality-2026-10-28/README.md).
