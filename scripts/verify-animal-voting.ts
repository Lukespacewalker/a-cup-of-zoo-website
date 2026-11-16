import { Database } from "bun:sqlite";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { fixtureVenue } from "../src/lib/content/fixture-data";
import { partyIds, type PartyVoteTotals } from "../src/lib/voting/party-ids";
import { createLocalCmsRuntime } from "../../CMS-Platform-acupofzoo/apps/api/src/local/create-local-cms-runtime";
import { acupofzooProject } from "../../CMS-Platform-acupofzoo/packages/contracts/src/project";

// All writes use fresh local SQLite/object storage. Never point this at a live CMS.
const root = await mkdtemp(join(tmpdir(), "acupofzoo-vote-integration-"));
const databasePath = join(root, "cms.sqlite");
let available = true;
let runtime: Awaited<ReturnType<typeof createLocalCmsRuntime>>;
const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: request => available ? runtime.fetch(request) : new Response(null, { status: 503 }) });
const cms = server.url.origin;
runtime = await createLocalCmsRuntime({ databasePath, storageRoot: join(root, "objects"), mediaPublicUrl: cms + "/media", adminApiToken: "local-vote-test-admin", mcpApiToken: "local-vote-test-mcp", project: acupofzooProject });
const reservation = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response(null) });
const port = reservation.port; await reservation.stop(true);
const origin = `http://127.0.0.1:${port}`;
const configDir = "tmp/animal-vote-integration";
await mkdir(configDir, { recursive: true });
const { compatibility_date, compatibility_flags, durable_objects, migrations } = Bun.JSONC.parse(await Bun.file("wrangler.jsonc").text()) as Record<string, unknown>;
await writeFile(`${configDir}/wrangler.json`, JSON.stringify({ name: "acupofzoo-vote-test", main: "../../src/worker.ts", compatibility_date, compatibility_flags, durable_objects, migrations, workers_dev: false, vars: { SITE_ENV: "local", CONTENT_MODE: "cms", CMS_BASE_URL: cms, SEARCH_INDEXING: "disabled" } }));
await writeFile(`${configDir}/astro.config.mjs`, `import base from '../../astro.config.mjs';\nimport cloudflare from '@astrojs/cloudflare';\nexport default {...base,root:process.cwd(),cacheDir:${JSON.stringify(join(root, "astro-cache"))},vite:{cacheDir:${JSON.stringify(join(root, "vite-cache"))}},adapter:cloudflare({configPath:'./${configDir}/wrangler.json',persistState:false,remoteBindings:false})};\n`);
const child = Bun.spawn(["node", "node_modules/astro/bin/astro.mjs", "dev", "--ignore-lock", "--config", `${configDir}/astro.config.mjs`, "--host", "127.0.0.1", "--port", String(port)], { cwd: resolve(import.meta.dir, ".."), stdout: "ignore", stderr: "inherit" });
let assertions = 0;
function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); assertions++; }
async function admin(path: string, method = "GET", body?: unknown) {
  const response = await fetch(cms + path, { method, headers: { authorization: "Bearer local-vote-test-admin", "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  assert(response.ok, `Admin ${path}: ${response.status}`); return response.json() as Promise<any>;
}
async function tool(name: string, args: Record<string, unknown> = {}) {
  const response = await fetch(cms + "/mcp", { method: "POST", headers: { authorization: "Bearer local-vote-test-mcp", "content-type": "application/json", "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": name }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args, _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {}, "io.modelcontextprotocol/clientInfo": { name: "animal-vote-integration", version: "1" } } } }) });
  const body = await response.json() as any;
  assert(response.ok && body.result && !body.result.isError, `MCP ${name}: ${JSON.stringify(body)}`);
  return JSON.parse(body.result.content[0].text);
}
const page = async (path = "/animals/") => { const response = await fetch(origin + path); assert(response.ok, path); return response.text(); };
const vote = (id: string, from = origin, body = "{}", type = "application/json") => fetch(`${origin}/api/party-votes/${encodeURIComponent(id)}/`, { method: "POST", headers: { origin: from, "content-type": type }, body });
async function totals() {
  const response = await fetch(`${origin}/api/party-votes/`);
  assert(response.ok && response.headers.get("cache-control") === "no-store", "Party totals are available and uncached");
  return response.json() as Promise<PartyVoteTotals>;
}
const history = () => fetch(`${cms}/api/public/animal-votes`).then((response) => response.json());
try {
  const content = structuredClone(fixtureVenue.content);
  content.animals = [{ ...content.animals.find(({ id }) => id === "nama")!, title: "เพื่อนทดสอบ", titleEn: "Test animal", mediaAssetId: null }];
  await admin("/api/venue", "POST", { content });
  await admin("/api/venue/publish", "POST", { expectedVersion: 1 });
  const deadline = Date.now() + 45_000;
  while (true) {
    if (child.exitCode !== null) throw new Error("Astro exited before readiness");
    try { if ((await fetch(origin + "/animals/", { signal: AbortSignal.timeout(3000) })).ok) break; } catch {}
    if (Date.now() > deadline) throw new Error("Astro did not become ready");
    await Bun.sleep(200);
  }
  const seeded = await fetch(`${cms}/api/public/animal-votes/nama`, { method: "POST" });
  assert(seeded.ok, "Separate local CMS has one historical vote");
  assert((await page()).includes('data-ready="true"'), "Workerd party totals reach SSR");
  const historicalBefore = await history();
  const fresh = await totals();
  assert(fresh.total === 0 && JSON.stringify(fresh.items) === JSON.stringify(partyIds.map((partyId) => ({ partyId, count: 0 }))), "New ballot has exactly 14 parties at zero");
  for (let count = 1; count <= 2; count++) {
    const result = await vote("fox");
    assert(result.ok && (await result.json() as PartyVoteTotals).total === count, "Repeat vote adds exactly one through Astro endpoint");
  }
  const html = await page();
  assert(/data-party-total[^>]*>\s*2\s*</.test(html) && html.includes('data-leader-name'), "Score and leaders appear on a fresh SSR request");
  assert((await vote("fox", "https://foreign.test")).status === 403, "Cross-origin request rejected");
  assert((await vote("unknown")).status === 404, "Unknown party rejected");
  assert((await vote("fox", origin, "{}", "text/plain")).status === 415, "Non-JSON type rejected");
  for (const body of ["not-json", "", '{"count":999}', " ".repeat(64) + "{}"]) {
    assert((await vote("fox", origin, body)).status === 400, "Malformed or oversized vote body rejected");
  }
  assert((await totals()).total === 2, "Invalid requests never mutate totals");
  const parallel = await Promise.all(Array.from({ length: 12 }, () => vote("dog")));
  const snapshots = await Promise.all(parallel.map(async (response) => {
    assert(response.ok, "Concurrent vote succeeded");
    return (await response.json() as PartyVoteTotals).total;
  }));
  assert(new Set(snapshots).size === 12 && (await totals()).total === 14, "Concurrent requests each increment exactly once");
  assert((await fetch(`${origin}/api/votes/nama/`, { method: "POST", headers: { origin, "content-type": "application/json" }, body: "{}" })).status === 410, "Old individual vote route retired");
  assert((await fetch(`${origin}/api/votes/`)).status === 410, "Old website score listing retired");
  assert(JSON.stringify(await history()) === JSON.stringify(historicalBefore), "Party votes leave historical CMS totals unchanged");
  const retirement = await Bun.file(new URL("./sql/2026-11-16-retire-individual-animal-votes.sql", import.meta.url)).text();
  const legacyDb = new Database(databasePath);
  try {
    const nonVoteAudit = () => legacyDb.query(`SELECT * FROM audit_logs
      WHERE NOT (action = 'animal.voted' AND entity_type = 'animal-votes') ORDER BY id`).all();
    const otherAuditBefore = JSON.stringify(nonVoteAudit());
    const venueBefore = JSON.stringify(legacyDb.query("SELECT * FROM venue_documents").all());
    const assertRetired = () => {
      assert(legacyDb.query("SELECT 1 FROM animal_vote_counts").get() === null, "Every legacy score row was purged");
      assert(legacyDb.query("SELECT 1 FROM audit_logs WHERE action = 'animal.voted' AND entity_type = 'animal-votes'").get() === null, "Legacy vote audit rows were purged");
      assert(JSON.stringify(nonVoteAudit()) === otherAuditBefore, "Unrelated audit rows are intact");
      assert(JSON.stringify(legacyDb.query("SELECT * FROM venue_documents").all()) === venueBefore, "The venue and animal roster are intact");
    };
    legacyDb.transaction(() => legacyDb.exec(retirement))();
    assertRetired();
    const retiredVote = await fetch(`${cms}/api/public/animal-votes/nama`, { method: "POST" });
    assert(retiredVote.status === 404, "A direct CMS vote cannot reopen the old ballot");
    assertRetired();
    assert((await totals()).total === 14, "Purging individual votes preserves party totals");
  } finally {
    legacyDb.close();
  }
  let venue = await admin("/api/venue");
  await admin("/api/venue", "PUT", { expectedVersion: venue.version, content: { ...venue.draft, holidayNote: "PRIVATE unrelated draft" } });
  let roster = await tool("list_animals");
  roster = await tool("update_animal_draft", { id: "nama", expectedVersion: roster.version, changes: { title: "ชื่อจาก MCP", titleEn: "MCP renamed animal" } });
  assert(!(await page()).includes("ชื่อจาก MCP"), "Animal draft stays private");
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert((await page("/en/animals/")).includes("MCP renamed animal"), "Published CMS name appears in English party details");
  venue = await admin("/api/venue");
  assert(venue.draft.holidayNote === "PRIVATE unrelated draft" && venue.published.holidayNote !== venue.draft.holidayNote, "Roster publish preserves unrelated private draft");
  roster = await tool("create_animal_draft", { expectedVersion: roster.version, animal: { title: "เพื่อนใหม่", titleEn: "New friend", description: "ทดสอบ" } });
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert((await page()).includes("เพื่อนใหม่"), "Published unassigned animal remains discoverable");
  roster = await tool("update_animal_draft", { id: "nama", expectedVersion: roster.version, changes: { visible: false } });
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert(!(await page()).includes('data-resident="nama"'), "Published hide removes the member");
  roster = await tool("update_animal_draft", { id: "nama", expectedVersion: roster.version, changes: { visible: true } });
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert((await page()).includes('data-resident="nama"') && (await totals()).total === 14, "Restore returns the member and leaves party totals intact");
  const home = await page("/");
  assert(home.includes('animal-parties--home') && home.includes('href="/animals/#animal-family"'), "Homepage links to full board");
  for (const animal of roster.draft) roster = await tool("update_animal_draft", { id: animal.id, expectedVersion: roster.version, changes: { visible: false } });
  await tool("publish_animals", { expectedVersion: roster.version });
  assert(!(await page()).includes('data-resident='), "Empty published CMS roster contributes no members");
  available = false;
  const unavailable = await page();
  assert(unavailable.includes('data-ready="true"') && !unavailable.includes('data-resident='), "CMS outage keeps party votes available and does not expose cached private animals");
  assert((await vote("fox")).ok && (await totals()).total === 15, "Party votes remain separate from CMS availability");
  console.log(`PASS: ${assertions} assertions, disposable CMS/MCP and Astro/workerd party voting`);
} finally {
  if (child.exitCode === null) {
    if (process.platform === "win32") await Bun.spawn(["taskkill.exe", "/PID", String(child.pid), "/T", "/F"], { stdout: "ignore", stderr: "ignore" }).exited;
    else child.kill();
  }
  await server.stop(true); runtime.close();
  if (!resolve(root).startsWith(resolve(tmpdir()) + sep) || !root.includes("acupofzoo-vote-integration-")) throw new Error("Unexpected cleanup path");
  try { await rm(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }); } catch { console.warn("Disposable SQLite remains locked until process exit."); }
}

