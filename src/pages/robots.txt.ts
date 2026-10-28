import type { APIRoute } from "astro";
import { runtimeConfig } from "../lib/content/runtime-config";
import { configuredSite } from "../lib/seo/metadata";
import { canIndex } from "../lib/seo/indexing";

export const GET: APIRoute = ({ site, url }) => {
  const config = runtimeConfig();
  const origin = configuredSite(site);
  const body = canIndex(url, site, config.searchIndexing)
    ? `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${new URL("/sitemap.xml", origin).href}\n` : ""}`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
