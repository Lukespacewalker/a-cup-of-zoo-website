import {
  animalVoteTotalsSchema,
  animalVoteCountSchema,
  type AnimalVoteTotals,
} from "@lukespace-cms/client";
import type { ContentConfig } from "../content/create-gateway";
export type VoteState =
  | { state: "ready"; totals: AnimalVoteTotals }
  | { state: "disabled" | "unavailable"; totals: null };
const headers = {
  "content-type": "application/json",
  "cache-control": "no-store",
};
const fail = (status: number) =>
  new Response(JSON.stringify({ error: "Voting is currently unavailable" }), {
    status,
    headers,
  });

async function boundedJson(response: Response) {
  if (!response.body) throw new Error("Empty voting response");
  const reader = response.body.getReader();
  let body = "",
    size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 32_768) {
        await reader.cancel();
        throw new Error("Voting response too large");
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    return JSON.parse(body + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}
export async function loadVoteTotals(
  config: ContentConfig,
  fetcher: typeof fetch = fetch,
): Promise<VoteState> {
  if (config.mode !== "cms" || !config.cmsBaseUrl)
    return { state: "disabled", totals: null };
  try {
    const response = await fetcher(
      new URL("/api/public/animal-votes", config.cmsBaseUrl),
      { signal: AbortSignal.timeout(2000), redirect: "manual" },
    );
    if (!response.ok) throw new Error("Voting unavailable");
    return {
      state: "ready",
      totals: animalVoteTotalsSchema.parse(await boundedJson(response)),
    };
  } catch (error) {
    console.warn(
      "Voting totals unavailable",
      error instanceof Error ? error.message : "Unknown error",
    );
    return { state: "unavailable", totals: null };
  }
}
export async function forwardVote(
  config: ContentConfig,
  id: string | undefined,
  request: Request,
  fetcher: typeof fetch = fetch,
) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return fail(403);
  if (
    !request.headers.get("content-type")?.startsWith("application/json") ||
    !id ||
    id.length > 80
  )
    return fail(422);
  if (config.mode !== "cms" || !config.cmsBaseUrl) return fail(503);
  try {
    const response = await fetcher(
      new URL(
        `/api/public/animal-votes/${encodeURIComponent(id)}`,
        config.cmsBaseUrl,
      ),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
        signal: AbortSignal.timeout(5000),
        redirect: "manual",
      },
    );
    if (!response.ok) return fail(response.status === 404 ? 404 : 503);
    const result = animalVoteCountSchema.parse(await boundedJson(response));
    if (result.animalId !== id) return fail(503);
    return new Response(JSON.stringify(result), { headers });
  } catch {
    return fail(503);
  }
}
