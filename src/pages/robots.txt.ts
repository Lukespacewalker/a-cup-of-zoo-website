import type { APIRoute } from "astro";
import { runtimeConfig } from "../lib/content/runtime-config";

export const GET: APIRoute = () => {
  const config = runtimeConfig();
  const body = config.environment === "production"
    ? "User-agent: *\nAllow: /\n"
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
