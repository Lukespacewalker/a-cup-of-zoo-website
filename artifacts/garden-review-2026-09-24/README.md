# Japanese garden cafe refinement — 24 September 2026

> Historical review. The user subsequently rejected this composition as too close to a SaaS landing page. Its visual acceptance is superseded by the [Root redesign and review](../root-cafe-review-2026-09-24/README.md). The checks below describe the earlier snapshot only.

Result: PASS for the scoped local design and interaction review. The previous website is preserved at commit `a8cf8e1`. The refinement is the working-tree delta from that commit, including the new `FoxSeal.astro` and `garden.css` files. Exact reviewed source hashes are in `source-hashes.json`.

GPT-6-Sol implemented the refinement. Root directed the design, inspected actual BrowserOS renders, exercised interactions, and requested corrections. This was a same-workspace review with shared task context, not an independent blind review. Root did not edit product source.

## Design

Warm ivory, wood brown, and muted garden green; overlapping photo-journal composition; the original fox logo as a restrained host; staggered real animal photographs; quieter numbered markers; visible keyboard focus; reduced-motion support. The existing content and CMS behavior were retained.

## Evidence

- Final actual viewport captures: [desktop light](desktop.jpg), [mobile light](mobile.jpg), [desktop dark](desktop-dark.jpg).
- Root visually checked desktop at 1440 × 1000, mobile at 390 × 844, and narrow mobile at 320 × 900, including light and dark appearances.
- DOM checks of `/`, `/animals/`, `/activities/`, `/menu/`, and `/visit/` at widths 320, 390, 768, 1024, and 1440 found no horizontal overflow and no failed completed image loads. This does not claim every lazy image was loaded at every width.
- Executed mobile menu opening, first-link focus, Escape dismissal, and focus return; clicked an animal card and confirmed navigation to `/animals/`.
- Executed keyboard theme switching, automatic dark preference, card-to-card Tab navigation, and visible card focus. Reduced-motion emulation produced zero-duration card transitions.
- Corrected narrow heading wrapping, mobile mascot/caption overlap, clipping of the shop ribbon, small-text contrast, dark hover colors, and clipped card focus outlines.

## Automated validation

- Worker reported final Astro check with zero diagnostics and a successful production build after the presentation fixes.
- Unit tests: 7/7; content verification passed.
- E2E: 8/8 against an isolated fixture preview on port 4322. These ran before the final presentation-only fixes; final type/build and direct browser checks cover those fixes. The populated CMS preview on port 4321 is not the empty-news fixture expected by one E2E test. Assertions were not weakened.
- Final `git diff --check` passed. Git's CRLF-to-LF notice is informational.

No deployment, push, production action, or CMS content write was performed. Checks used browser viewport/media emulation, not physical mobile devices; this is not a comprehensive accessibility audit.
