import source from "../reference-data/owner-feedback-2026-10-27/animal-roster.json";
import { join } from "node:path";

// A one-time, additive content import. Normal animal editing belongs in CMS/MCP.
const origin = new URL(process.env.CMS_BASE_URL ?? "http://127.0.0.1:8787");
if (!["localhost", "127.0.0.1"].includes(origin.hostname)) throw new Error("This importer accepts only the local café CMS");
const apply = Bun.argv.includes("--apply");
const headers: Record<string, string> = process.env.ADMIN_API_TOKEN ? { authorization: `Bearer ${process.env.ADMIN_API_TOKEN}` } : {};
async function api(path: string, method = "GET", body?: unknown) {
  const form = body instanceof FormData;
  const response = await fetch(new URL(path, origin), { method, redirect: "manual", headers: { ...headers, ...(!form ? { "content-type": "application/json" } : {}) }, body: body === undefined ? undefined : form ? body : JSON.stringify(body) });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  return response.json() as Promise<any>;
}
if ((await api("/health")).project !== "acupofzoo") throw new Error("Wrong CMS project");
let roster = await api("/api/venue/animals");
const result: Array<{ sourceId: string; cmsId: string | null; action: string }> = [];
for (const animal of source.animals) {
  // Existing names/IDs are left untouched. This never replaces owner edits.
  const existing = roster.draft.find((item: any) => item.id === animal.id || item.title === animal.title || item.titleEn?.toLowerCase() === animal.titleEn.toLowerCase());
  if (existing) { result.push({ sourceId: animal.id, cmsId: existing.id, action: "preserved" }); continue; }
  if (!apply) { result.push({ sourceId: animal.id, cmsId: null, action: "would-create" }); continue; }
  const bytes = await Bun.file(join(import.meta.dir, "../src/assets/animal-roster", animal.id + ".png")).arrayBuffer();
  const view = new DataView(bytes);
  const form = new FormData();
  form.set("file", new File([bytes], animal.id + ".png", { type: "image/png" }));
  form.set("width", String(view.getUint32(16))); form.set("height", String(view.getUint32(20)));
  form.set("altTh", animal.title); form.set("altEn", animal.titleEn); form.set("sourceKey", `acupofzoo:canva-animal:${animal.id}`);
  const asset = await api("/api/assets", "POST", form);
  const ids = new Set(roster.draft.map((item: any) => item.id));
  roster = await api("/api/venue/animals", "POST", { expectedVersion: roster.version, animal: { title: animal.title, titleEn: animal.titleEn, description: animal.description, descriptionEn: animal.descriptionEn, mediaAssetId: asset.id, visible: true, featured: false } });
  result.push({ sourceId: animal.id, cmsId: roster.draft.find((item: any) => !ids.has(item.id)).id, action: "created-draft" });
}
console.log(JSON.stringify({ applied: apply, version: roster.version, published: false, result, pendingDuplicateNames: source.pendingDuplicateNames }, null, 2));
