import type { APIRoute } from "astro";
import { submitPartyVote } from "../../../lib/voting/party-gateway";

export const POST: APIRoute = ({ params, request }) =>
  submitPartyVote(request, params.id);
