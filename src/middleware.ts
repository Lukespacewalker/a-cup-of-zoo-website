import { defineMiddleware } from "astro:middleware";
import { runtimeConfig } from "./lib/content/runtime-config";
import { canIndex } from "./lib/seo/indexing";

export const onRequest = defineMiddleware(async (context, next) => {
  const upstream = await next();
  const response = new Response(upstream.body, upstream);
  const config = runtimeConfig();
  if (
    !canIndex(context.url, context.site, config.searchIndexing, response.status)
  )
    response.headers.set("x-robots-tag", "noindex, nofollow");
  if (new URL(context.request.url).pathname !== "/_image/")
    response.headers.set("cache-control", "no-store");
  return response;
});
