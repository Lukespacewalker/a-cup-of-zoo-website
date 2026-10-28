import type { APIRoute } from "astro";
import { runtimeConfig } from "../../../lib/content/runtime-config";
import { forwardVote } from "../../../lib/voting/gateway";
export const POST: APIRoute = ({ params, request }) =>
  forwardVote(runtimeConfig(), params.id, request);
