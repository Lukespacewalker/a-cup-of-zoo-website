import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join, sep } from "node:path";
import { fixtureVenue } from "../src/lib/content/fixture-data";
import { createLocalCmsRuntime } from "../../CMS-Platform-acupofzoo/apps/api/src/local/create-local-cms-runtime";
import { acupofzooProject } from "../../CMS-Platform-acupofzoo/packages/contracts/src/project";

// Disposable local preview only. Scores and credentials here are test data.
const root = await mkdtemp(join(tmpdir(), "acupofzoo-voting-preview-"));
const cmsOrigin = "http://127.0.0.1:8796", adminOrigin = "http://127.0.0.1:5178", siteOrigin = "http://127.0.0.1:4336";
const runtime = await createLocalCmsRuntime({ databasePath: join(root, "cms.sqlite"), storageRoot: join(root, "objects"), mediaPublicUrl: cmsOrigin + "/media", project: acupofzooProject, adminOrigin, adminApiToken: "animal-review-admin", mcpApiToken: "animal-review-mcp" });
const server = Bun.serve({ hostname: "127.0.0.1", port: 8796, fetch: request => runtime.fetch(request) });
const content = structuredClone(fixtureVenue.content);
for (const [index, animal] of content.animals.entries()) {
  const file = Bun.file(animal.id === "mee-chok"
    ? "reference-data/owner-feedback-2026-10-27/assets/asset-12.png"
    : `src/assets/animal-roster/${animal.id}.png`);
  const bytes = await file.arrayBuffer(); const dimensions = new DataView(bytes);
  const form = new FormData(); form.set("file", new File([bytes], `animal-${index}.png`, { type: "image/png" }));
  form.set("width", String(dimensions.getUint32(16))); form.set("height", String(dimensions.getUint32(20)));
  form.set("altTh", animal.title); form.set("altEn", animal.titleEn || "Animal");
  const response = await fetch(cmsOrigin + "/api/assets", { method: "POST", headers: { authorization: "Bearer animal-review-admin" }, body: form });
  if (!response.ok) throw new Error(`Test upload failed ${response.status}`);
  animal.mediaAssetId = (await response.json() as { id: string }).id;
}
const admin = (path: string, method: string, body: unknown) => fetch(cmsOrigin + path, { method, headers: { authorization: "Bearer animal-review-admin", "content-type": "application/json" }, body: JSON.stringify(body) });
if (!(await admin("/api/venue", "POST", { content })).ok) throw new Error("Test venue creation failed");
if (!(await admin("/api/venue/publish", "POST", { expectedVersion: 1 })).ok) throw new Error("Test publication failed");
for (const [index, animal] of content.animals.entries()) for (let n = 0; n < [18,12,9,4,2,6][index]; n++) await fetch(cmsOrigin + "/api/public/animal-votes/" + animal.id, { method: "POST" });
await mkdir("tmp/animal-voting", { recursive: true });
await writeFile("tmp/animal-voting/wrangler.json", JSON.stringify({ name: "acupofzoo-local-voting-review", compatibility_date: "2026-09-25", compatibility_flags: ["nodejs_compat"], workers_dev: false, vars: { SITE_ENV: "local", CONTENT_MODE: "cms", CMS_BASE_URL: cmsOrigin, SEARCH_INDEXING: "disabled" } }));
await writeFile("tmp/animal-voting/astro.config.mjs", `import base from '../../astro.config.mjs';\nimport cloudflare from '@astrojs/cloudflare';\nexport default {...base,root:process.cwd(),cacheDir:${JSON.stringify(join(root, "astro-cache"))},vite:{cacheDir:${JSON.stringify(join(root, "site-vite-cache"))}},adapter:cloudflare({configPath:'./tmp/animal-voting/wrangler.json',persistState:false,remoteBindings:false})};\n`);
const cmsRoot = resolve("../CMS-Platform-acupofzoo");
const adminConfig = resolve("tmp/animal-voting/admin.config.ts");
await writeFile(adminConfig, `import base from '../../../CMS-Platform-acupofzoo/apps/admin/vite.config.ts';\nexport default {...base,cacheDir:${JSON.stringify(join(root, "admin-cache"))}};\n`);
const children = [
  Bun.spawn(["node", "node_modules/astro/bin/astro.mjs", "dev", "--ignore-lock", "--config", "tmp/animal-voting/astro.config.mjs", "--host", "127.0.0.1", "--port", "4336"], { cwd: process.cwd(), stdout: "inherit", stderr: "inherit" }),
  Bun.spawn(["bun", "x", "vite", "--config", adminConfig, "--host", "127.0.0.1", "--port", "5178", "--strictPort"], { cwd: join(cmsRoot, "apps/admin"), env: { ...process.env, VITE_CMS_PROJECT: "acupofzoo", VITE_API_URL: cmsOrigin }, stdout: "inherit", stderr: "inherit" }),
];
console.log(JSON.stringify({ cmsOrigin, adminOrigin, siteOrigin, root, note: "Disposable test data only" }));
let stopping = false;
async function stop() {
  if (stopping) return; stopping = true;
  for (const child of children) if (child.exitCode === null) {
    if (process.platform === "win32") await Bun.spawn(["taskkill.exe", "/PID", String(child.pid), "/T", "/F"], { stdout: "ignore", stderr: "ignore" }).exited;
    else child.kill();
  }
  await server.stop(true); runtime.close();
  const absolute = resolve(root);
  if (!absolute.startsWith(resolve(tmpdir()) + sep) || !absolute.includes("acupofzoo-voting-preview-")) throw new Error("Unexpected cleanup path");
  try { await rm(absolute, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }); } catch { console.warn("Disposable SQLite remains locked until process exit."); }
  process.exit(0);
}
process.on("SIGINT", () => void stop()); process.on("SIGTERM", () => void stop());
await Promise.race(children.map(child => child.exited));
await stop();
