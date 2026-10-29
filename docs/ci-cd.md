# CI/CD

Repository: https://github.com/Lukespacewalker/a-cup-of-zoo-website (public).

[Check and deploy](../.github/workflows/ci.yml) runs on pull requests, pushes and manual dispatch. Verification uses Bun 1.3.14, Node 22, frozen dependencies, prepared assets, formatting, Astro diagnostics, unit/content checks, fixture browser tests, production build and Wrangler dry run. The CMS public SDK is [vendored](../vendor/cms-client/README.md); no private repository credentials are needed to build.

Browser tests create a temporary ignored `.dev.vars` with local fixture mode and a loopback-only CMS origin, then remove it before production build. The standard suite contains 42 fixture tests; the 17 CMS-backed voting/portrait tests deliberately skip because they require a separate disposable CMS. CI never submits votes to production.

The deploy job requires successful verification and runs only for the repository's current default branch (`codex/garden-animal-experience`). Other branches and PRs cannot enter that job. `workflow_dispatch` on the default branch also deploys. Deployments run in the GitHub `production` environment and use the existing apex/www routes and production CMS configuration. Concurrent runs for a branch are serialized.

The `production` GitHub environment permits deployments only from `codex/garden-animal-experience` and stores `CLOUDFLARE_API_TOKEN` as an environment secret. Update its deployment branch policy if the default branch changes. The dedicated token has Workers Scripts Edit on Cloudflare account `033dbd2d33d8bb93fcc2930c22752d8a` and Workers Routes Edit/Zone Read only for `acupofzoo.com`; it has no D1/R2 or token-management permissions. The account ID is public configuration; token values stay in GitHub Secrets. The token is exposed only to the deploy command, after checks pass. The workflow does not deploy or migrate the CMS.

To verify locally from a fresh checkout:

```sh
bun install --frozen-lockfile
bun run prepare:assets
bun run format:check
bun run check
bun run test:unit
bun run verify:content
bun run build
bunx wrangler deploy --dry-run
```

For fixture browser tests, use the temporary `.dev.vars` values shown in the workflow and run `bun run test:e2e --workers=2`. Remove that file before production build/deploy. Local deployment can continue using the existing `nawaratthinsook` Wrangler profile; GitHub Actions uses the dedicated token instead of a personal OAuth session.
