# Page heroes and Zoo Clubs visibility

Status: complete locally. Root owns implementation and acceptance. See [verification and review](../../review/page-heroes-zoo-clubs-2026-10-27/README.md).

## Accepted direction

The user accepted shorter full-width image heroes for Animals, Activities and Events, with compact openings for information pages, and requested that Zoo Clubs be prominent. This plan records that decision; it supersedes the split opening treatment for those three pages in the earlier garden-experience plan. Existing content, membership terms, locale routes and the homepage's main hero remain in scope for preservation.

Implementation choices by Root: one shared Astro hero; on narrow screens, place copy below a shorter photo to preserve subjects and readability. Highlight Zoo Clubs in desktop/mobile navigation, move its homepage introduction near the experience introduction, and give the membership page a distinct green introduction with immediate benefits and its existing LINE signup destination. Preserve the cream/olive palette, existing type and watercolor artwork. No new dependencies or deployment.

## Work and acceptance

- [x] Add shared `src/components/site/PageHero.astro` and apply it to AnimalsPage, ActivitiesPage and EventsPage. Keep existing anchors, calls to action and animal admission details. Full-width image treatment on desktop, shorter than the homepage hero; readable photo and text on phones.
- [x] Update Header and HomePage so Zoo Clubs is visible in primary navigation and early homepage content; remove the superseded lower homepage membership teaser. Preserve the group-events introduction.
- [x] Update ClubPage and owner-content.css with a clear Zoo Clubs heading, free membership, existing signup link, immediate benefits and unchanged detailed terms.
- [x] Verify Astro check/build, existing affected browser tests and actual renders/interactions in Thai/English, desktop/mobile and light/dark. Check navigation, locale switching, hero anchors, image crops, horizontal fit, focus and signup destination.

## Constraints and verification scope

Work in the existing dirty checkout using targeted patches; preserve unrelated map work and all pre-existing edits. Before-edit snapshots of touched existing files are in the task's temporary backup directory. This is a reversible presentation change; apply the user's proportional workflow preference instead of introducing separate design-approval, commit or worktree ceremonies. Use the existing tests and browser interactions; add assertions only for meaningful navigation behavior.

Completion means the authorized UI changes work locally with evidence. Live deployment needs a separate instruction. Root's source review and renders are maker evidence; no independent verdict is implied.

## Integration decision

The initial placement above the shop map is superseded by the map position updated concurrently in another session. Preserve that map immediately after the experience introduction and place the Club invitation immediately after it, before the cat story. The lower duplicate Club teaser is removed.

