import type { APIRoute } from "astro";
import { isDemoPost, thaiTranslation } from "../lib/content/posts";
import { gatewayFromRuntime, runtimeConfig } from "../lib/content/runtime-config";

const staticPaths = ["/", "/animals/", "/activities/", "/menu/", "/visit/", "/news/"];

export const GET: APIRoute = async () => {
  const config = runtimeConfig();
  if (config.environment !== "production") {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  }
  try {
    const posts = await gatewayFromRuntime().listPosts();
    const urls = [
      ...staticPaths,
      ...posts.filter((post) => !isDemoPost(post)).map((post) => `/news/${thaiTranslation(post).slug}/`),
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>https://acupofzoo.invalid${path}</loc></url>`).join("")}</urlset>`;
    return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
  } catch {
    return new Response("unavailable", { status: 503 });
  }
};
