import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { fixtureVenue } from "../src/lib/content/fixture-data";
import { createLocalCmsRuntime } from "../../CMS-Platform-acupofzoo/apps/api/src/local/create-local-cms-runtime";
import { acupofzooProject } from "../../CMS-Platform-acupofzoo/packages/contracts/src/project";

// All writes use fresh local SQLite/object storage. Never point this at a live CMS.
const root = await mkdtemp(join(tmpdir(), "acupofzoo-vote-integration-"));
let available = true;
let runtime: Awaited<ReturnType<typeof createLocalCmsRuntime>>;
const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: request => available ? runtime.fetch(request) : new Response(null, { status: 503 }) });
const cms = server.url.origin;
runtime = await createLocalCmsRuntime({ databasePath: join(root, "cms.sqlite"), storageRoot: join(root, "objects"), mediaPublicUrl: cms + "/media", adminApiToken: "local-vote-test-admin", mcpApiToken: "local-vote-test-mcp", project: acupofzooProject });
const reservation = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response(null) });
const port = reservation.port; await reservation.stop(true);
const origin = `http://127.0.0.1:${port}`;
const configDir = "tmp/animal-vote-integration";
await mkdir(configDir, { recursive: true });
await writeFile(`${configDir}/wrangler.json`, JSON.stringify({ name: "acupofzoo-vote-test", compatibility_date: "2026-09-25", compatibility_flags: ["nodejs_compat"], workers_dev: false, vars: { SITE_ENV: "local", CONTENT_MODE: "cms", CMS_BASE_URL: cms, SEARCH_INDEXING: "disabled" } }));
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
const vote = (id: string, from = origin) => fetch(`${origin}/api/votes/${encodeURIComponent(id)}/`, { method: "POST", headers: { origin: from, "content-type": "application/json" }, body: '{"count":999}' });
try {
  const content = structuredClone(fixtureVenue.content);
  content.animals = [{ ...content.animals[0], id: "test-animal", title: "เพื่อนทดสอบ", titleEn: "Test animal", mediaAssetId: null }];
  await admin("/api/venue", "POST", { content });
  await admin("/api/venue/publish", "POST", { expectedVersion: 1 });
  const deadline = Date.now() + 45_000;
  while (true) {
    if (child.exitCode !== null) throw new Error("Astro exited before readiness");
    try { if ((await fetch(origin + "/animals/", { signal: AbortSignal.timeout(3000) })).ok) break; } catch {}
    if (Date.now() > deadline) throw new Error("Astro did not become ready");
    await Bun.sleep(200);
  }
  assert((await page()).includes('data-ready="true"'), "Real CMS totals reach workerd SSR");
  for (let count = 1; count <= 2; count++) {
    const result = await vote("test-animal");
    assert(result.ok && (await result.json() as any).count === count, "Repeat vote adds exactly one through Astro endpoint");
  }
  assert((await page()).includes('data-count="2"'), "Score persists on fresh page request");
  assert((await vote("test-animal", "https://foreign.test")).status === 403, "Cross-origin request rejected");
  let venue = await admin("/api/venue");
  await admin("/api/venue", "PUT", { expectedVersion: venue.version, content: { ...venue.draft, holidayNote: "PRIVATE unrelated draft" } });
  let roster = await tool("list_animals");
  roster = await tool("update_animal_draft", { id: "test-animal", expectedVersion: roster.version, changes: { title: "ชื่อจาก MCP", titleEn: "MCP renamed animal" } });
  assert(!(await page()).includes("ชื่อจาก MCP"), "Animal draft stays private");
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert((await page("/en/animals/")).includes("MCP renamed animal"), "MCP publication appears in English jars");
  venue = await admin("/api/venue");
  assert(venue.draft.holidayNote === "PRIVATE unrelated draft" && venue.published.holidayNote !== venue.draft.holidayNote, "Roster publish preserves unrelated private draft");
  roster = await tool("create_animal_draft", { expectedVersion: roster.version, animal: { title: "เพื่อนใหม่", titleEn: "New friend", description: "ทดสอบ" } });
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert((await page()).includes('data-count="0"'), "New animal starts with zero votes");
  roster = await tool("update_animal_draft", { id: "test-animal", expectedVersion: roster.version, changes: { visible: false } });
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert((await vote("test-animal")).status === 404 && !(await page()).includes('data-animal-id="test-animal"'), "Published hide removes jar and refuses votes");
  roster = await tool("update_animal_draft", { id: "test-animal", expectedVersion: roster.version, changes: { visible: true } });
  roster = await tool("publish_animals", { expectedVersion: roster.version });
  assert((await page()).includes('data-count="2"'), "Restore keeps earlier score");
  assert((await page("/")).includes('animal-votes--compact') && (await page("/")).includes('href="/animals/#animal-family"'), "Homepage podium links to full board");
  for (const animal of roster.draft) roster = await tool("update_animal_draft", { id: animal.id, expectedVersion: roster.version, changes: { visible: false } });
  await tool("publish_animals", { expectedVersion: roster.version });
  assert((await page()).includes("ยังไม่มีเพื่อนสัตว์เปิดรับโหวต"), "Empty roster offers an honest state");
  available = false;
  const unavailable = await page();
  assert(unavailable.includes('data-ready="false"') && unavailable.includes("ตอนนี้โหลดคะแนนไม่ได้"), "Unavailable CMS never fabricates votes");
  assert((await vote("test-animal")).status === 503, "Unavailable CMS cannot accept a fake vote");
  console.log(`PASS: ${assertions} assertions, real disposable CMS → MCP → Astro/workerd → voting endpoint`);
} finally {
  if (child.exitCode === null) {
    if (process.platform === "win32") await Bun.spawn(["taskkill.exe", "/PID", String(child.pid), "/T", "/F"], { stdout: "ignore", stderr: "ignore" }).exited;
    else child.kill();
  }
  await server.stop(true); runtime.close();
  if (!resolve(root).startsWith(resolve(tmpdir()) + sep) || !root.includes("acupofzoo-vote-integration-")) throw new Error("Unexpected cleanup path");
  try { await rm(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }); } catch { console.warn("Disposable SQLite remains locked until process exit."); }
}

