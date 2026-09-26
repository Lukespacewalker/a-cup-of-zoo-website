import type { APIRoute } from "astro";
import { runtimeConfig } from "../lib/content/runtime-config";
import { configuredSite } from "../lib/seo/metadata";

export const GET: APIRoute = ({ site }) => {
  const config = runtimeConfig();
  const origin = configuredSite(site);
  const body = config.environment === "production"
    ? `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${new URL("/sitemap.xml", origin).href}\n` : ""}`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
