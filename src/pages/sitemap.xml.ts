import type { APIRoute } from "astro";
import { isDemoPost, thaiTranslation } from "../lib/content/posts";
import { gatewayFromRuntime, runtimeConfig } from "../lib/content/runtime-config";
import { configuredSite, sitemapXml } from "../lib/seo/metadata";
import { bilingualPaths, localePath } from "../lib/i18n/locale";

const staticPaths = [...bilingualPaths, ...bilingualPaths.map(path => localePath(path, "en")), "/news/"];

export const GET: APIRoute = async ({ site }) => {
  const config = runtimeConfig();
  if (config.environment !== "production") {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  }
  const origin = configuredSite(site);
  if (!origin) return new Response("Site domain is not configured", { status: 503 });
  try {
    const posts = await gatewayFromRuntime().listPosts();
    const urls = [
      ...staticPaths,
      ...posts.filter((post) => !isDemoPost(post)).map((post) => `/news/${encodeURIComponent(thaiTranslation(post).slug)}/`),
    ];
    const body = sitemapXml(origin, urls);
    return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
  } catch {
    return new Response("unavailable", { status: 503 });
  }
};
