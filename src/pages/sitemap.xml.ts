import type { APIRoute } from "astro";
import { isDemoPost, thaiTranslation } from "../lib/content/posts";
import { gatewayFromRuntime, runtimeConfig } from "../lib/content/runtime-config";
import { configuredSite, sitemapXml } from "../lib/seo/metadata";
import { bilingualPaths, localePath } from "../lib/i18n/locale";
import { canIndex } from "../lib/seo/indexing";
import { listingGateway, listingPath } from "../lib/content/listings";

const staticPaths = [...bilingualPaths, ...bilingualPaths.map(path => localePath(path, "en")), "/news/"];

export const GET: APIRoute = async ({ site, url }) => {
  const config = runtimeConfig();
  if (!canIndex(url, site, config.searchIndexing)) {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  }
  const origin = configuredSite(site);
  if (!origin) return new Response("Site domain is not configured", { status: 503 });
  try {
    const posts = await gatewayFromRuntime().listPosts();
    const listings = listingGateway(config);
    const [thaiListings, englishListings] = await Promise.all([listings.list("th"), listings.list("en")]);
    const urls = [
      ...staticPaths,
      ...posts.filter((post) => !isDemoPost(post)).map((post) => `/news/${encodeURIComponent(thaiTranslation(post).slug)}/`),
      ...thaiListings.flatMap(item=>item.translations.filter(t=>t.locale==="th").map(t=>listingPath(t.locale,t.slug))),
      ...englishListings.flatMap(item=>item.translations.filter(t=>t.locale==="en").map(t=>listingPath(t.locale,t.slug))),
    ];
    const body = sitemapXml(origin, urls);
    return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
  } catch {
    return new Response("unavailable", { status: 503 });
  }
};
