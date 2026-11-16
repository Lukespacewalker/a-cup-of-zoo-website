import type { APIRoute } from "astro";

export const POST: APIRoute = () =>
  Response.json(
    { error: "Individual voting has moved to the animal party ballot" },
    { status: 410, headers: { "cache-control": "no-store" } },
  );
