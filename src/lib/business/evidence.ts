export type EvidenceClaim = {
  field: string;
  sourceIds: string[];
  verificationStatus: "user_provided" | "source_verified" | "owner_confirmed" | "unknown";
};

export type EvidenceFile = {
  sources: Array<{ id: string; verifiedAt: string | null; checkedAt?: string | null; accessStatus?: string }>;
  initialValues: {
    admissionPrice: number | null;
    coordinates: unknown;
    hoursVerification: string;
    phoneConflict?: boolean;
  };
  claims: EvidenceClaim[];
};

export function assessEvidence(evidence: EvidenceFile) {
  const invalid: string[] = [];
  if (evidence.initialValues.admissionPrice !== null) invalid.push("admissionPrice");
  if (evidence.initialValues.coordinates !== null) invalid.push("coordinates");
  for (const claim of evidence.claims) {
    const verified = claim.verificationStatus === "source_verified" || claim.verificationStatus === "owner_confirmed";
    if (verified && claim.sourceIds.length === 0) invalid.push(claim.field);
  }
  const maps = evidence.sources.find((source) => source.id === "google-maps");
  if (maps?.verifiedAt && maps.accessStatus === "fetch_failed") invalid.push("google-maps");
  if (evidence.initialValues.hoursVerification === "source_verified" || evidence.initialValues.hoursVerification === "owner_confirmed") {
    const hours = evidence.claims.find((claim) => claim.field === "regularHours");
    if (!hours || hours.verificationStatus === "user_provided") invalid.push("regularHours");
  }
  return {
    invalid,
    ready: evidence.claims.filter((claim) => claim.verificationStatus === "source_verified" || claim.verificationStatus === "owner_confirmed").map((claim) => claim.field),
    needsConfirmation: evidence.claims.filter((claim) => claim.verificationStatus === "user_provided" || claim.verificationStatus === "unknown").map((claim) => claim.field),
  };
}
