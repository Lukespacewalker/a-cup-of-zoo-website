import { defineMiddleware } from "astro:middleware";
import { runtimeConfig } from "./lib/content/runtime-config";

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const config = runtimeConfig();
  if (config.environment !== "production") response.headers.set("x-robots-tag", "noindex, nofollow");
  response.headers.set("cache-control", "no-store");
  return response;
});
