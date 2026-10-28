# Animal CMS and voting verification — 2026-10-28

Root implements and integrates. Website HEAD has substantial inherited dirty/untracked work; no broad commit or deployment was made. CMS worktree HEAD: `2a0d7a6bfefb898d8de327c086aa9dfdd5cad1d5`. Current behavior and source data are documented in [CMS animal voting](../../cms-animal-voting.md).

## Executed checks

- CMS `bun run check`, `bun run test`, `bun run build`: all pass, 94 tests (64 API), 8 package checks and four Admin profile builds. Logs remain under CMS `tmp/animal-editor-2026-10-28/`.
- Website `bun run check`, `bun test tests/unit`, Astro production build: pass, 31 tests/314 assertions and 88 checked files. Build output was isolated on C: because H: was temporarily full. No deployment used that output.
- Real local CMS → authenticated MCP → Astro/workerd → vote proxy: [43 assertions](integration.log), disposable SQLite/object storage; no API mocking.
- [Local import readback](local-import.json): each of 23 source animals maps to exactly one existing CMS ID; rerun preserves all and performs no write. Persistent local draft version33 has these23 plus3 legacy entries, with the original published roster untouched.
- Root browser interactions: upload PNG, add bilingual animal, save draft, reorder, explicit publish; actual repeated votes18→20 then reload; zero-score first vote; English vote; hide through mobile Admin; confirmation by Enter; actual concurrent editor change returns409 while local typed text remains; dismissing discard keeps text, accepting reload discards explicitly.
- Render/DOM checks: desktop1440, phones390/320; initial full board and later all23 source animals; Thai/English; dark screenshot; reduced-motion animation disabled; no observed horizontal overflow or broken images. Homepage is a three-place podium; detailed page has jars. Screenshots are recorded in BrowserOS tool output, not a claim that every route was browser-tested. Full unrelated Playwright suite was not rerun.

## Independent backend review

Read-only reviewer received a bounded task brief, with no product edits. Shared checkout; exact manifest hashes checked before/after. Manifest: CMS `tmp/animal-editor-2026-10-28/backend-review-hashes.json`. A malformed percent-encoded Admin ID initially returned500; Root added a decode guard and regression test. Recheck PASS: 5 focused tests/90 assertions.

Reviewer also executed actual Miniflare/workerd D1: migration applies,25 concurrent increments return1..25, missing/hidden candidates do not audit, forced audit failure rolls back. Adverse checks cover101st animal rejection, older referenced images, simultaneous versioned edits, draft/published eligibility isolation, hide/restore/image changes retaining scores and Bun rollback. Artifacts: `C:/Users/Sutti/AppData/Local/Temp/acupofzoo-review-notes/`.

Accepted changed hashes after fix:

- `http-animal-routes.ts`: `DE5ACF4F7D5DD1B3A17D363D219CBB0F9A2F26C9FB836D14E366557D82FC3217`
- `animal-editor.test.ts`: `4FC8EAC585D7C00AF92F2BAD8488A5BC8F6748EA50D057E6E8320EF46D1DA985`

## Independent proxy/importer review

Read-only separate reviewer with the supplied task brief, no implementation involvement and no production access. PASS after a reproduced importer redirect bypass was fixed with `redirect: "manual"`. The original reproduction now fails at307 with zero destination requests. Executed16 gateway boundary assertions,57 importer assertions, plus4 existing voting tests. Temporary artifacts: `C:/Users/Sutti/AppData/Local/Temp/acupofzoo-proxy-review-266e33db790b43179ff8ead76e18b49c`.

Frozen accepted SHA-256:

| File | Hash |
|---|---|
| `src/lib/voting/gateway.ts` | `C8CD98B21822BC6A4D9F44A54465C0CCE13B534F68FF3385735C4A244D61E448` |
| `src/pages/api/votes/[id].ts` | `96026317FC2366CBC8B573C25A598B2D972FAC85A3957E91D8046F68B736031B` |
| `src/pages/api/votes/index.ts` | `62E1C67B99C22D521787DC7B0BF70609C40FFD341034ED00FCCE6B023B15DAA5` |
| `scripts/import-cms-animals.ts` | `B3AA1495A85BFD06FE2B0A0818850235CD70F7F829663F0252144303DD06E506` |

These review verdicts cover the stated boundaries. Root owns UI/usability acceptance. Remote migration, production endpoint setup, actual owner AI-client connection and live publication remain outside the executed scope.
