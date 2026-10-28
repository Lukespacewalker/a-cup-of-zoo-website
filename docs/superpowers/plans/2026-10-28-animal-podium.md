# Animal jar stickers and Three.js podium

Root implements inline with executing-plans, then requests one independent read-only review. User explicitly requested completion through deployment; no additional design approval gate. This follow-up supersedes the visual treatment in the completed unified-animal plan, preserving its data and voting behavior.

## Design and acceptance

- Circular animal photo becomes a sticker on the front of the glass jar; remove the decorative heart inside it. Keep one actual ball per vote, capacity50, existing scores/IDs/CMS unchanged. Root chooses CSS glass jars with only the shared podium using Three.js, avoiding a WebGL context per animal.
- Represent stored full jars as a miniature full jar beside the active jar with ×N. Hide it at zero. Remove visible arithmetic/full-jar prose and keep an accessible description. Exact score remains visible.
- Top toolbar shows a heart icon with total and a real refresh link. Straight paper-like cards and small-corner buttons/search, per user's theme correction; circular portraits and curved glass remain intentional.
- Same Three.js podium on homepage and animal directory: softly lit olive/ochre/clay plinths, circular CMS portraits, exact score and honest tied/zero ranks. Each entry links to that animal. HTML content remains usable without WebGL/JS and on context loss. Directory podium updates after successful votes without a full reload.
- Lazy-load Three.js near the viewport, cap pixel ratio, render on demand with a short entrance/hover response, honor reduced motion, release resources on page exit. At most one podium/context per rendered page. No continuous idle rendering or external texture/font requests.
- Preserve Thai/English,320/390px mobile, dark theme, keyboard focus and stable card dimensions; no new overly rounded cards or pill buttons. Preserve FARM,Club,map and older route redirects.

## Work

- [x] Read current source/official Three.js guidance; save before snapshots and current design.
- [x] Add failing browser coverage for jar sticker, miniature counts, top refresh/heart, podium and accessible fallback; implement components/controller/Three.js enhancement and styling.
- [x] Verify real disposable CMS voting including49→50→51 and podium refresh, ties/zero, mobile, reduced motion, WebGL failure/context loss, noJS, pointer/keyboard. Inspect actual Neo renders. Run affected unit tests, Astro check and production build.
- [x] Freeze exact files/bundle, independent review and resolve findings; dry-run then deploy website only. Confirm live public routes, preserved CMS scores, both podium placements and one purposeful vote if needed; update coordination/evidence.

Completed as `d99b1af6-25b6-45b3-8dfd-fd189c5afb30`; [acceptance evidence](../../review/animal-podium-2026-10-28/README.md). Final review PASS after caption and dark-score contrast fixes. Old first-card-above-fold criterion now applies to the podium's animal links, since the user explicitly requested a podium above the directory; image/card geometry and keyboard focus remain checked. Total70→71 from one Nama acceptance vote, all other scores preserved.

Files: new `src/components/site/AnimalPodium.astro`, `src/lib/voting/podium.ts`, `src/lib/voting/podium-scene.ts`, `src/styles/animal-podium.css`; existing AnimalDirectory/AnimalVotes, voting/directory, animal-votes CSS, package+lock and disposable browser tests. No backend/schema/auth changes. Shared checkout continues the accepted single-owner workflow; preserve unrelated dirty work, no broad commit/reset.
