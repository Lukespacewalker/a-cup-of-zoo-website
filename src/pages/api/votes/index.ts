import type { APIRoute } from "astro";
import { runtimeConfig } from "../../../lib/content/runtime-config";
import { loadVoteTotals } from "../../../lib/voting/gateway";
export const GET: APIRoute = async () => {
  const result = await loadVoteTotals(runtimeConfig());
  return Response.json(
    result.state === "ready" ? result.totals : { error: "Voting unavailable" },
    {
      status: result.state === "ready" ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
};
