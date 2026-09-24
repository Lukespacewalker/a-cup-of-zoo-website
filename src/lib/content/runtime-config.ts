import { CMS_BASE_URL, CONTENT_MODE, SITE_ENV } from "astro:env/server";
import { createGateway, type ContentConfig, type ContentMode, type SiteEnvironment } from "./create-gateway";

export function runtimeConfig(): ContentConfig {
  return {
    environment: parseEnvironment(SITE_ENV),
    mode: parseMode(CONTENT_MODE),
    cmsBaseUrl: CMS_BASE_URL || undefined,
  };
}

export function gatewayFromRuntime() {
  return createGateway(runtimeConfig());
}

function parseEnvironment(value: string | undefined): SiteEnvironment {
  if (value === "staging" || value === "production") return value;
  return "local";
}

function parseMode(value: string | undefined): ContentMode {
  return value === "cms" ? "cms" : "fixture";
}
