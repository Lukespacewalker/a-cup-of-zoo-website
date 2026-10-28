# Page heroes and Zoo Clubs — 27 October 2026

Local acceptance: **PASS after the contrast correction**. No deployment was performed.

Deployment follow-up: the user's 28 October instruction authorized publication with the full-width map and a header alignment correction. See the [completed release](../hero-map-header-release-2026-10-28/README.md). The local-only statement above describes the original acceptance date.

The Animals, Activities and Events pages now share a 460px desktop photo hero. Narrow screens place the title, description and action beneath a 220px photo. Tablet shading preserves text contrast, and image positions preserve the important subjects. Existing anchors, localized actions and animal admission qualifications remain available.

Zoo Clubs is highlighted in desktop navigation and first in the mobile menu with a free-membership label. Its homepage invitation follows the preserved shop map and precedes the cat story; the old lower invitation is removed. The Club page opens with its name, free signup, welcome points and earning rules. Existing membership terms and the LINE destination are unchanged.

## Verification

- [Astro diagnostics](final-check.log): 80 files, zero errors, warnings or hints. [Build](final-build.log): successful. The subsequent correction changes only one CSS color rule.
- Seventeen existing relevant browser tests covered hero interaction, locale/metadata, owner content, menu navigation and themes. [Canonical-port run](browser-tests.log): 16 passed, with the width matrix interrupted by an `ERR_ABORTED` during a development reload. The [affected tests](final-affected.log) subsequently passed 4/4. After the color correction, [all three theme tests](accepted-theme.log) passed again, including the full 320/390/768/1440 light/dark/automatic width matrix. Assertions were not changed.
- [Additional keyboard checks](navigation.json): homepage invitation and primary navigation enter the correct Club route in Thai at 1440px and English at 320px; the signup destination matches the existing LINE URL. No signup was submitted.
- Root inspected actual desktop, tablet and mobile renders, including English mobile dark mode. Nine exported images (seven page viewports and two homepage invitation crops) are retained in `C:/Users/Sutti/AppData/Local/Temp/acup-hero-club-20261027/renders/`. BrowserOS was used for visual and menu/locale/theme checks; local Playwright captures provided fixed-size artifacts. An initial viewport capture was interrupted by a development reload; the two homepage exports are bounded component crops and make no claim about surrounding image loading.

## Review and final target

A separate read-only Venus reviewer used the frozen source copies and nine renders, with a task brief and Root's evidence but no inherited conversation. Root authored the implementation; both sessions shared the filesystem, so the review used exact hashes rather than the mutable checkout. HEAD was `1fc2599a9fa32ad6ab02760a93e425934adb6919` with dirty/untracked files recorded in [target.json](target.json).

The reviewer found one material issue: active Zoo Clubs navigation had 4.38:1 contrast in light mode. Root reproduced it with an executed failing contrast check, then added a current-page text-color override before the hover rule. [Eight actual computed-style checks](contrast.json) now pass on desktop/mobile in light/dark, normal/hover states: 9.22:1 for the corrected light active link and at least 6.26:1 across all measured states. The final manifest differs from the reviewed manifest only in this CSS file. The final correction was verified by Root; the reviewer did not issue a second verdict.

No other material findings were reported. Screen-reader announcements and 200% text zoom were optional evidence gaps, not executed checks. All unrelated existing changes, including the concurrent homepage map work, were preserved. The initial disk-space failure was handled by redirecting temporary cache/build/test output to C:, without changing production configuration.
