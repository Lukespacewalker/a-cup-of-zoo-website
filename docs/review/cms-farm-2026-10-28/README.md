# Café CMS and FARM release

PASS for the deployed server and website scope. [Version receipt](deployment.json), [frozen source target](target.json), [Root browser observations](browser-acceptance.md).

Independent reviewer `/root/owner_ready_review` inspected the frozen changes and ran 12 focused tests, 21 actual workerd/D1 checks and 16 MCP isolation assertions. Required findings about unsaved edits and stale documentation were fixed. The reviewer made no product edits or production calls; UI evidence was supplied by Root. A final documentation-only correction removed the mistaken AOED archive reference.

CMS check passed across eight packages; API suite70 tests/515 assertions passed. All four Admin profiles built; the final café build and dry run passed after the editor fix. Website check96 files/zero issues and33 unit tests/327 assertions passed. Website deployed from the fresh frozen `site-farm-dist-2/server/wrangler.json` output because a repeat build into the existing output directory hit Astro/Node cleanup incompatibility. No dependency workaround was shipped.

Live verification:71 API checks;20 website checks across apex/www; both real MCP SDK negotiation modes connected, listed17 tools and read venue. Migration0013 applied successfully. Venue version2,23 animals,28 media and two existing votes were preserved. Club pages and all12 distinct image URLs returned200. Anonymous/wrong-scope access is rejected. No fabricated sale listing was published.

The requested article was displayed on the live website and archived after verification. A disposable local listing covered upload/order, draft isolation, publish, conflict recovery and archive; no production listing mutations were needed.

MacBook setup: [CMS guide](../../../../CMS-Platform-acupofzoo/docs/acupofzoo-mac-mcp.md). Actual Codex/Claude execution on the owner's MacBook is still to be performed there. Tokens are stored separately in a private local artifact and are absent from this repository and these receipts.
