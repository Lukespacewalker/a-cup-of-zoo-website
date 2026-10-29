# Animal face framing

User-approved outcome: every animal has a clear face in its card, jar sticker and podium, through deployment. Keep animal editing in CMS/MCP and preserve the paper theme and existing votes.

Approach: optional `imageFocus: {x:0..100, y:0..100, zoom:1..4} | null` in CMS. Use one square portrait component and clamp the positioned image to the viewport, preserving image proportions. Cards use the same crop as circles. No raster editing or generated animal replacements. Mee Chok's previous extraction cuts its nose; use the retained original meerkat sheet and focus on the correct animal.

- [ ] CMS owner: additive contract/Admin/MCP/public client, preview controls and validation. No migration or auth changes. Supply frozen changes for Root review before CMS deployment.
- [x] Root: shared portrait geometry and component; all three surfaces plus dynamic podium changes; fixture focus data and original source for Mee Chok.
- [x] Root: inspect all 23 real rendered card/circle crops, test focus geometry, CMS field propagation and preserved voting/layout at 320/390/1440px. 17 disposable browser tests, 48 unit tests/370 assertions, Astro106 zero diagnostics; actual rendered portraits reviewed.
- [ ] Integrate reviewed CMS release, publish focus settings through versioned animal API, preserving other drafts and all votes.
- [ ] Website CI/CD deployment and live render/score acceptance on apex/www.

Root owns website, integration and acceptance. Existing CMS chat owns only CMS files. Checks are scoped to image framing and the contracts it touches; no unrelated redesign. Artifacts: `C:/Users/Sutti/.codex/artifacts/acupofzoo-animal-faces-2026-10-29`.
