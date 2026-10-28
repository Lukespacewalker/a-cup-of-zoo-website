# Zoo Clubs tier artwork — 28 October 2026

Local and live Club acceptance: PASS. Published in coordinated release `4b18293c-4c0b-486a-860e-dfec07ca78c7`. Added small watercolor illustrations to all five levels, visible Lv. labels, and theme-aware benefit rows with localized text badges. Coupon emphasis identifies only the new coupon, and the birthday souvenir is emphasized only when first added at Besties. Commercial terms and the LINE signup URL remain unchanged.

## Verification

- `bun run check`: 88 files, zero errors, warnings or hints after the final CSS change.
- `bun run build`: passed after the final CSS change.
- Existing owner-content, theme and experience-navigation suites: 7 passed. After aligning desktop comparison rows with CSS subgrid, reran the affected owner-content suite: 3 passed.
- Actual BrowserOS neo inspection: Thai and English at 320, 390, 768 and 1440 CSS px in light, dark and automatic dark themes. Five images loaded; no horizontal overflow. First Thai 320px dark/auto readings were affected by viewport restoration and were explicitly repeated at 320px; see `rechecked320` in [viewport checks](viewport-checks.json).
- New-benefit badge and emphasized text contrast against the highlighted row: 5.23:1 light, 5.55:1 dark/automatic dark. Badges provide a text distinction in addition to color. Artwork is decorative with empty alt text and hidden from the accessibility tree.
- Executed theme cycling and persistence, Thai-to-English switching, and keyboard Enter on the membership-terms link. Confirmed the exact added benefits per tier, the existing LINE URL and unchanged 500 THB birthday-cake condition. See [interaction checks](interaction-checks.json).
- Reflow at 640 CSS px and 2x device scale: one column, no overflow. This is device emulation, not a manual browser zoom interaction.
- Inspected all five generated originals: 1254 × 1254 PNG with alpha. Astro serves responsive WebP candidates; the originals are project-local. See [exact prompts and generation method](../../../src/assets/club/PROMPTS.md).

## Actual renders

- [Thai, light, desktop](club-th-light-desktop.png)
- [Thai, dark, desktop](club-th-dark-desktop.jpg)
- [English, light, desktop](club-en-light-desktop.jpg)
- [Thai, light, mobile / Besties](club-th-light-mobile.jpg)
- [English, dark, mobile / Besties](club-en-dark-mobile.jpg)

The original site style, compact artwork, aligned desktop rows and readable single-column mobile cards were inspected visually. Only newly introduced or improved benefits receive the green highlight; Friend's starting birthday benefit uses the warm gold treatment. Existing mobile shortcuts remain visible.

## Review scope

Root implemented and reviewed this reversible presentation change in the existing dirty checkout. This is maker evidence, not an independent review. The baseline commit is `1fc2599a9fa32ad6ab02760a93e425934adb6919`; [source hashes](source-hashes.json) identify the exact changed product files and assets, including files already untracked before this task. The before-edit snapshots are under ignored `tmp/zooclub-tier-artwork-2026-10-28-before/`. Unrelated working changes were preserved.

Initial local acceptance did not include deployment. The subsequent user instruction explicitly authorized deployment and coordination; follow the production rollout below. The existing membership conditions still apply; the illustrations do not define additional benefits.

## Coordinated production rollout

Status: published on apex/www and the existing workers.dev URL. The animal/voting chat deployed the combined package once CMS was READY according to [the CMS handoff](../../cms-cloudflare-deployment-2026-10-28.md); its [deployment record](../animal-voting-2026-10-28/deployment.md) records the publishing action. Wrangler deployment history independently confirmed version `4b18293c-4c0b-486a-860e-dfec07ca78c7` at100% on 2026-10-28T06:02:38Z. ZooClub coordinated the candidate and verified the public Club pages; it did not run a competing deployment.

ZooClub copied the accepted 12:49 build to `C:/Users/Sutti/.codex/artifacts/acupofzoo-club-integrated-release-2026-10-28/dist/` and froze 214 files with SHA-256. Club source hashes and accepted voting source hashes matched before copying. Wrangler dry run passed. The actual frozen Worker, served locally on port4340, preserved five loaded responsive Club illustrations and the expected new-benefit rows in both languages; home retained19 map pins and a3-place podium, Animals retained23 named animals, and Vote retained23 cards. See [frozen Worker checks](frozen-worker-checks.json).

The voting owner copied the214 manifest files into its final production package, set only the three CMS runtime variables, and ran the43 disposable CMS/MCP/voting assertions successfully on that exact combined Worker. The old voting-only release is superseded. The voting owner also persisted the CMS runtime in source `wrangler.jsonc` to preserve it on future builds.

Live Club checks passed on `https://acupofzoo.com/club/`, `/en/club/`, and the corresponding two www routes: HTTP200, all five images decoded, expected new-row counts `[0,2,3,3,2]`, unchanged signup and terms, and no horizontal overflow across320/390/1440px in light/dark (24 combinations). See [public-page evidence](live-checks.json). Native theme clicks persisted the theme, and the language link reached the English Club route. Actual renders were inspected on the live pages: [Thai desktop](live-th-desktop.jpg), [English mobile light](live-en-mobile.jpg), [English mobile dark](live-en-mobile-dark.jpg). The detailed voting/CMS acceptance remains owned by the voting/CMS chats.
