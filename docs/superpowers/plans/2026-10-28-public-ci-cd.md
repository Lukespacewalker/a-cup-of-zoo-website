# Public repository and CI/CD

**Goal:** Make the website reproducible from this public repository and deploy automatically after checks pass.

**Design:** Use GitHub Actions and the existing Wrangler deployment. Keep the current default branch `codex/garden-animal-experience`; PRs and branch pushes run checks, and only the default branch can deploy. Root selected GitHub Actions because it runs the existing Bun/Playwright commands and separates verification from production credentials.

**Constraints:** Preserve website behavior and production CMS data. Never submit production votes during CI. Keep credentials in GitHub Secrets. A fresh checkout must install without a sibling CMS repository. Do not publish or change the CMS application.

The CMS client is unpublished and its private upstream main branch lacks the current venue/voting DTO files. Vendor the exact small public SDK snapshot, including its source hashes, rather than introduce private-repository credentials or rewrite the SDK.

- [x] Create the repository, push the existing branch and set visibility public as requested.
- [x] Copy the current public SDK into `vendor/cms-client`, preserve all exports/runtime source, update the file dependency and frozen Bun lockfile. Record provenance and snapshot update instructions.
- [x] Add one GitHub workflow with read-only repository permissions: frozen install, generated assets, formatting, Astro/unit/content checks, fixture Playwright tests, build/dry run; deploy job depends on checks and only runs for the default branch.
- [x] Scope the Cloudflare deploy token to the existing account/zone and store it as `CLOUDFLARE_API_TOKEN` in the production environment. Keep test fixture configuration out of the production build and ignore `.dev.vars*`.
- [x] Verify a clean website-only checkout, independently review the frozen CI/dependency delta, then push and observe the real GitHub run and deployment.

**Acceptance:** Public repository, matching remote HEAD, successful Actions checks and automatic Cloudflare deployment, reachable apex/www and unchanged voting data. An absent credential or failed live run remains incomplete and must be reported.

Local evidence: a fresh website-only checkout with newly installed dependencies passed 45 unit tests/365 assertions, format check, Astro check104 files,42 fixture browser tests (16 CMS-only tests skipped), content validation, production build and Wrangler dry run. Independent fresh-context read-only review passed staged tree `373f88198470575b33b12b436e9fbaf3d27ed76f` after closing the same-named-tag deployment loophole. All12 SDK runtime blobs match their upstream/snapshot hashes. Live Actions acceptance follows the push; its immutable run receipt is the authority for completion.

Live acceptance: [run40680964366](https://github.com/Lukespacewalker/a-cup-of-zoo-website/actions/runs/40680964366) passed both jobs on Ubuntu for source `ad09fe4bd9a1eb77fdd8e33aa56057f9a6c0b60f`, including42 browser tests/16 intentional skips and45 unit tests/365 assertions. It automatically deployed version `0b44532f-5d03-445d-85bc-7ca04e0288ae`; public-domain smoke checks passed and all23 vote counts remained unchanged at total71. GitHub environment policy/secret location and public visibility were independently verified read-only. The initial run reported legacy action-runtime warnings; action pins were then updated to current official Node24 releases and Ubuntu24.04 explicitly for the final run.
