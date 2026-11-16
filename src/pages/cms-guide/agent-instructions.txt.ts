import type { APIRoute } from "astro";
import instructions from "../../../AGENTS.md?raw";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(instructions, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
