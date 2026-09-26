import { expect, test } from "bun:test";
import evidence from "../../reference-data/business-evidence.json";
import { assessEvidence } from "../../src/lib/business/evidence";

test("tiered admission is not converted into a universal free admission price", () => {
  expect(evidence.initialValues.admissionPrice).toBeNull();
});

test("the user selected both phones without inferring coordinates from Maps access", () => {
  const maps = evidence.sources.find((source) => source.id === "google-maps");
  expect(maps?.verifiedAt).toBeNull();
  expect(evidence.initialValues.coordinates).toBeNull();
  expect(evidence.initialValues.phoneConflict).toBe(false);
  expect(evidence.initialValues.phoneNumbers).toEqual(["+66989838037", "+66922791890"]);
  expect(evidence.initialValues.hoursVerification).toBe("source_verified");
});

test("checked dates alone do not mark claims verified", () => {
  const unverified = structuredClone(evidence);
  unverified.initialValues.hoursVerification = "user_provided";
  unverified.claims.find((claim) => claim.field === "regularHours")!.verificationStatus = "user_provided";
  const report = assessEvidence(unverified);
  expect(report.invalid).toEqual([]);
  expect(report.ready).toContain("addressLine");
  expect(report.needsConfirmation).toContain("regularHours");
});
