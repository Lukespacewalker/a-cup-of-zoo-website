import { expect, test } from "bun:test";
import evidence from "../../reference-data/business-evidence.json";
import { assessEvidence } from "../../src/lib/business/evidence";

test("unverified prices are not converted into free admission", () => {
  expect(evidence.initialValues.admissionPrice).toBeNull();
});

test("maps access does not verify coordinates or a single phone", () => {
  const maps = evidence.sources.find((source) => source.id === "google-maps");
  expect(maps?.verifiedAt).toBeNull();
  expect(evidence.initialValues.coordinates).toBeNull();
  expect(evidence.initialValues.phoneConflict).toBe(true);
  expect(evidence.initialValues.hoursVerification).toBe("user_provided");
});

test("checked dates alone do not mark claims verified", () => {
  const report = assessEvidence(evidence);
  expect(report.invalid).toEqual([]);
  expect(report.ready).toContain("addressLine");
  expect(report.needsConfirmation).toContain("regularHours");
});
