import { env } from "cloudflare:workers";
import { isPartyId, type PartyVoteTotals } from "./party-ids";

const headers = { "cache-control": "no-store" };

function partyCounter() {
  return env.PARTY_VOTES.getByName("animal-party-ballot");
}

function failure(status: number, error: string) {
  return Response.json({ error }, { status, headers });
}

async function hasEmptyVoteBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return false;

  const decoder = new TextDecoder();
  let body = "";
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 64) {
        await reader.cancel();
        return false;
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    return /^[ \t\r\n]*\{[ \t\r\n]*\}[ \t\r\n]*$/.test(body + decoder.decode());
  } catch {
    return false;
  } finally {
    reader.releaseLock();
  }
}

export async function loadPartyVoteTotals(): Promise<PartyVoteTotals | null> {
  try {
    return await partyCounter().readTotals();
  } catch (error) {
    console.warn("Party vote totals unavailable", error);
    return null;
  }
}

export async function respondWithPartyVoteTotals() {
  const totals = await loadPartyVoteTotals();
  return totals
    ? Response.json(totals, { headers })
    : failure(503, "Party voting is unavailable");
}

export async function submitPartyVote(
  request: Request,
  partyId: string | undefined,
) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return failure(403, "Vote requests must come from this site");
  }
  const mediaType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return failure(415, "Vote requests must use application/json");
  }
  if (!isPartyId(partyId)) return failure(404, "Unknown animal party");
  if (!(await hasEmptyVoteBody(request))) {
    return failure(400, "Vote body must be an empty JSON object");
  }

  try {
    const totals = await partyCounter().castVote(partyId);
    return Response.json(totals, { headers });
  } catch (error) {
    console.error("Party vote failed", error);
    return failure(503, "Party voting is unavailable");
  }
}
