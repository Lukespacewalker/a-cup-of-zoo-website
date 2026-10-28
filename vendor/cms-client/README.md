# Public CMS client snapshot

This is the exact runtime source of `@lukespace-cms/client` 0.1.0 used by this website on 28 October 2026. It contains the REST client and public DTO schemas, with `zod` as its only runtime dependency. API origin and authentication remain caller-owned.

Source: `CMS-Platform-acupofzoo/packages/client` from the local CMS worktree at HEAD `2a0d7a6bfefb898d8de327c086aa9dfdd5cad1d5`, including its then-uncommitted generated venue and animal-voting DTOs. The commit alone cannot reconstruct those files. `snapshot.sha256.json` records the exact copied runtime bytes; `public-contracts.revision.json` preserves the upstream contract generator's revision and hashes.

Only the package manifest differs from upstream: CMS-only generation/check/test scripts and development dependencies were omitted. All twelve TypeScript source files and all exports are preserved unchanged. The website installs this package via `file:./vendor/cms-client`, so a fresh checkout does not require private CMS repository access.

To update, regenerate and test the public client in the CMS repository, replace this directory's `src` and `public-contracts.revision.json` with that snapshot, refresh the SHA-256 file, record the source revision here, and run `bun install` followed by website checks/build. Review public API changes before committing; do not edit generated schemas independently in this website.
