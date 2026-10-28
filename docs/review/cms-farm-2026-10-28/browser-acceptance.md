# FARM browser acceptance — 28 October 2026

Root performed the interactions below in BrowserOS Neo against disposable local CMS, Vite Admin and the exact production website bundle served by workerd. Production data was not used for listing mutation tests. This is maker evidence; the independent reviewer inspected frozen source and ran backend tests separately.

- Thai listing editor: edited description/price, uploaded PNG with Thai/English alt text, moved it to cover, saved draft v3. Public listing retained old description, price and cover. Explicit publish + confirmation v4 exposed the changes and all three images.
- English editor and list: switched interface and content language, checked labels/price. Mobile navigation opened and closed with Escape. At390px editor had no page overflow; image order/actions were usable.
- Background/conflict regression: unsaved Thai description survived43 seconds in another tab and an external update to v5. Saving the stale editor returned409, retained description/1700.50 and blocked publish/archive. Native Load latest confirmation: Cancel retained fields; Accept loaded latest2000 price and cleared error.
- Native Archive + Confirm archived the local record at v6. Public list returned empty and detail404. All three associated images remained HTTP200; record remained readable in Admin with editing locked.
- Storefront: native card navigation, gallery thumbnail keyboard Enter, and English counterpart navigation worked. Cover and gallery images loaded. LINE and both confirmed phone actions were present.
- Responsive detail measurements after two animation frames: viewport320/390/1024/1440, scroll width320/390/1009/1425 respectively; all main images loaded. Actual mobile and desktop screenshots inspected. Theme emulation confirmed dark colours and no390px overflow, but no separate dark interaction suite is claimed.
- Empty listing state: actual desktop screenshot inspected; clear empty message and LINE action. Missing detail returns404.
- Backend outage: separate workerd instance with unreachable API returned503 for Thai index/detail and English index. Actual Thai390px screenshot inspected: unavailable message and retry link; no empty-stock claim.
- Published article: production news navigation and article rendering inspected on desktop/mobile, then archived. Public article URL now404 by design.

Source target: `farm-review-target.json` (37 files and two HEADs). Independent PASS covered migration, optimistic locking, archive rollback and MCP profile isolation. Final doc-only correction removed an incorrect AOED archive reference.
