import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { assessEvidence, type EvidenceFile } from "../src/lib/business/evidence";

const evidence = JSON.parse(await readFile(join(import.meta.dir, "../reference-data/business-evidence.json"), "utf8")) as EvidenceFile;
const report = assessEvidence(evidence);
console.log(JSON.stringify(report, null, 2));
if (report.invalid.length) {
  console.error("Content verification failed");
  process.exit(1);
}
