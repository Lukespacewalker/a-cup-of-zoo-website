import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const manifest = JSON.parse(await readFile(join(root, "reference-data/asset-manifest.json"), "utf8")) as {
  assets: Array<{ id: string; file: string; bytes: number; sha256: string; prototypeUse: boolean; containsIdentifiablePerson: boolean }>;
};
const output = join(root, "src/assets/site");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const asset of manifest.assets) {
  if (asset.id === "child-with-dogs-reference" || asset.containsIdentifiablePerson || !asset.prototypeUse) continue;
  const source = join(root, asset.file);
  const bytes = await readFile(source);
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== asset.sha256 || bytes.byteLength !== asset.bytes) {
    throw new Error(`Asset ${asset.id} does not match the manifest`);
  }
  await copyFile(source, join(output, asset.file.split("/").at(-1)!));
}

const copied = await readdir(output);
if (copied.some((name) => name.includes("child"))) throw new Error("A child image was copied into site assets");
console.log(`Prepared ${copied.length} site images`);
