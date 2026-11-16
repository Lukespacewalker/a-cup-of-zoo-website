import type { APIRoute } from "astro";
import { respondWithPartyVoteTotals } from "../../../lib/voting/party-gateway";

export const GET: APIRoute = respondWithPartyVoteTotals;
