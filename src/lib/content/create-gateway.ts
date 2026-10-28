import type { PostDto, PublicVenueDto } from "@lukespace-cms/client";
import { createCmsGateway } from "./cms-gateway";
import { createFixtureGateway } from "./fixture-gateway";
import { fetchWithTimeout } from "./fetch-with-timeout";

export type SiteEnvironment = "local" | "staging" | "production";
export type ContentMode = "fixture" | "cms";

export type ContentConfig = {
  environment: SiteEnvironment;
  mode: ContentMode;
  cmsBaseUrl?: string;
};

export interface SiteContentGateway {
  getVenue(): Promise<PublicVenueDto>;
  listPosts(): Promise<PostDto[]>;
  getPost(slug: string): Promise<PostDto | null>;
}

export function assertContentConfig(config: ContentConfig) {
  if (config.environment === "production" && config.mode === "fixture") {
    throw new Error("production cannot use fixture content");
  }
  if (config.mode === "cms") {
    if (!config.cmsBaseUrl)
      throw new Error("CMS mode requires an explicit origin");
    let url: URL;
    try {
      url = new URL(config.cmsBaseUrl);
    } catch {
      throw new Error("CMS mode requires an explicit origin");
    }
    if (url.protocol !== "http:" && url.protocol !== "https:")
      throw new Error("CMS mode requires an explicit origin");
    if (!url.hostname) throw new Error("CMS mode requires an explicit origin");
  }
}

export function createGateway(
  config: ContentConfig,
  fetchImpl: typeof fetch = fetchWithTimeout(),
): SiteContentGateway {
  assertContentConfig(config);
  if (config.mode === "fixture") return createFixtureGateway();
  return createCmsGateway(config.cmsBaseUrl!, fetchImpl);
}
