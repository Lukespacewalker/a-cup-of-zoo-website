import { join } from "node:path";
import { fixtureVenue } from "../src/lib/content/fixture-data";
import source from "../reference-data/owner-feedback-2026-10-27/animal-roster.json";

// First-time bootstrap only. Never import the local database or its test votes.
const base = new URL(process.env.CMS_BASE_URL ?? "http://127.0.0.1:8797");
const cloudOrigin = "https://acupofzoo-cms-api.a-cup-of-zoo-website.workers.dev";
const local = ["localhost", "127.0.0.1"].includes(base.hostname) && base.protocol === "http:";
if ((!local && base.origin !== cloudOrigin) || base.pathname !== "/" || base.search || base.hash || base.username || base.password) throw new Error("Unexpected bootstrap origin");
const apply = Bun.argv.includes("--apply");
const publish = Bun.argv.includes("--publish");
if (publish && !apply) throw new Error("Publishing requires --apply");
if (apply && !Bun.argv.includes("--confirm-project=acupofzoo")) throw new Error("Explicit café project confirmation required");
const token = process.env.ADMIN_API_TOKEN;
if (!token) throw new Error("ADMIN_API_TOKEN is required; never pass it as a command argument");
const root = join(import.meta.dir, "..");

async function request(path: string, method = "GET", body?: unknown) {
  const form = body instanceof FormData;
  const response = await fetch(new URL(path, base), {
    method, redirect: "manual",
    headers: { authorization: `Bearer ${token}`, ...(!form ? { "content-type": "application/json" } : {}) },
    body: body === undefined ? undefined : form ? body : JSON.stringify(body),
  });
  if (response.status >= 300 && response.status < 400) throw new Error("Bootstrap refuses redirects");
  return response;
}
async function json(path: string, method = "GET", body?: unknown): Promise<any> {
  const response = await request(path, method, body);
  if (!response.ok) throw new Error(`${method} ${path}: HTTP ${response.status}`);
  return response.json();
}

if ((await json("/health")).project !== "acupofzoo") throw new Error("Wrong CMS project");
const existing = await request("/api/venue");
if (existing.status !== 404) throw new Error(existing.ok ? "Venue already exists; bootstrap will not overwrite it" : `Venue preflight: HTTP ${existing.status}`);
if (source.animals.length !== 23 || new Set(source.animals.map(a => a.id)).size !== 23) throw new Error("Expected 23 distinct confirmed animals");

const content = structuredClone(fixtureVenue.content);
const uploads = new Map<string, { file: string; altTh: string; altEn: string }>();
for (const animal of source.animals) uploads.set(`owner-${animal.id}`, { file: `src/assets/animal-roster/${animal.id}.png`, altTh: animal.title, altEn: animal.titleEn });
for (const item of [...content.activities, ...content.menuHighlights]) if (item.mediaAssetId) uploads.set(item.mediaAssetId, { file: `src/assets/site/${item.mediaAssetId}.png`, altTh: item.title, altEn: item.titleEn ?? item.title });
// Validate all local image inputs before making any writes.
for (const item of uploads.values()) {
  const file = Bun.file(join(root, item.file));
  if (!(await file.exists()) || file.size > 5 * 1024 * 1024) throw new Error(`Missing or oversized image: ${item.file}`);
}
if (!apply) {
  console.log(JSON.stringify({ origin: base.origin, applied: false, animals: 23, images: uploads.size, publicationRequested: publish }));
} else {
  const ids = new Map<string, string>();
  for (const [key, item] of uploads) {
    const bytes = await Bun.file(join(root, item.file)).arrayBuffer();
    const view = new DataView(bytes);
    if (view.getUint32(0) !== 0x89504e47) throw new Error("Expected a PNG source");
    const form = new FormData();
    form.set("file", new File([bytes], `${key}.png`, { type: "image/png" }));
    form.set("width", String(view.getUint32(16))); form.set("height", String(view.getUint32(20)));
    form.set("altTh", item.altTh); form.set("altEn", item.altEn);
    form.set("sourceKey", `acupofzoo:initial:${key}`);
    const asset = await json("/api/assets", "POST", form);
    ids.set(key, asset.id);
  }
  for (const item of [...content.animals, ...content.activities, ...content.menuHighlights]) if (item.mediaAssetId) {
    const assetId = ids.get(item.mediaAssetId);
    if (!assetId) throw new Error(`Unmapped media: ${item.id}`);
    item.mediaAssetId = assetId;
  }
  const created = await json("/api/venue", "POST", { content });
  const final = publish ? await json("/api/venue/publish", "POST", { expectedVersion: created.version }) : created;
  console.log(JSON.stringify({ origin: base.origin, applied: true, published: publish, version: final.version, animals: content.animals.map(a => a.id), images: uploads.size, voteWrites: 0 }));
}
