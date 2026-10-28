# Zoo Clubs tier artwork and benefit highlights

Status: complete and published. The coordinated storefront release is `4b18293c-4c0b-486a-860e-dfec07ca78c7`; Club live acceptance passed on apex/www in Thai/English. See [verification and renders](../../review/zooclub-tier-artwork-2026-10-28/README.md).

Deployment follow-up: the user explicitly authorized deployment and coordination with the other chats. ZooClub owns the combined frozen build and Club verification; the animal/voting chat remains the sole storefront runtime/deployment owner, and the Canva/CMS chat owns CMS provisioning, migration and publication. The combined candidate is `C:/Users/Sutti/.codex/artifacts/acupofzoo-club-integrated-release-2026-10-28/dist/`. It must preserve both the accepted voting source and the final Tier artwork; the older voting-only bundle is superseded. Follow [release coordination](../../cms-cloudflare-deployment-2026-10-28.md) and the voting owner's [deployment record](../../review/animal-voting-2026-10-28/deployment.md). Completion of this follow-up means the combined release is deployed and all five Club illustrations/highlights pass actual public-page verification in both languages.

## Current direction

The user requested a small generated illustration for each membership level, matching the existing style, and theme-aware highlights for benefits added at each tier. Add five compact, transparent watercolor animal illustrations to Friend, Buddy, Besties, Soulmate and Family. Preserve the existing membership thresholds, discounts, coupons, birthday conditions and LINE destination. Keep the existing cream/olive/terracotta palette and support Thai/English and light/dark/automatic themes.

Use the current five-column comparison at wide widths and one readable card per row on phones. Label levels and explain that colored benefit rows indicate additions or upgrades from the previous tier. Within annual coupons, emphasize only the newly added coupon so inherited benefits remain easy to distinguish. Friend's birthday benefit is the starting benefit; Besties adds the birthday souvenir.

This extends the tier presentation in [the prior Zoo Clubs plan](2026-10-27-page-heroes-zoo-clubs.md); its other decisions remain current. A separate carousel or tabs would hide comparisons and add unnecessary interaction. Existing Astro assets and CSS cover this change without dependencies or client JavaScript.

## Work and acceptance

- [x] Generate, inspect and save five transparent watercolor illustrations under `src/assets/club/`; record the exact prompts and generation method.
- [x] Update `src/components/pages/ClubPage.astro` and the tier rules in `src/styles/owner-content.css` with compact artwork, visible levels and localized new/upgrade indicators. Derive changed rows from existing `memberTiers` data rather than duplicate commercial terms.
- [x] Run Astro check and build sequentially, and run existing affected browser tests. Inspect actual Thai/English desktop/mobile renders in both themes, automatic dark theme, reflow and image loading. Execute the theme, language and membership-terms interactions locally.
- [x] Record results and limitations under `docs/review/zooclub-tier-artwork-2026-10-28/`.

## Constraints

Preserve all pre-existing dirty/untracked work. This is a reversible presentation change in the existing checkout; the user's proportional workflow preference applies. Do not deploy or modify membership business data. Local acceptance requires every tier to have its own illustration, only newly added or improved benefits to be highlighted, readable content without horizontal overflow, and intact links and terms. Review evidence is Root's source inspection and executed checks/renders; no independent review is implied.
