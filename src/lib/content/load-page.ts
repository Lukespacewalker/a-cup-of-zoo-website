import { ContentUnavailableError } from "./errors";
import { gatewayFromRuntime, runtimeConfig } from "./runtime-config";
import { isDemoPost, thaiTranslation } from "./posts";
import { loadPageData, type LoadPageOptions } from "./load-page-data";

export type { PageData } from "./load-page-data";

export function loadPage(options: LoadPageOptions = {}) {
  const config = runtimeConfig();
  const gateway = gatewayFromRuntime();
  return loadPageData(config, gateway, options);
}

export async function loadPost(slug: string) {
  const config = runtimeConfig();
  const gateway = gatewayFromRuntime();
  try {
    const post = await gateway.getPost(slug);
    if (!post || (config.environment === "production" && isDemoPost(post)))
      return { post: null, problem: "missing" as const, config };
    return { post, problem: null, config };
  } catch (error) {
    if (error instanceof ContentUnavailableError)
      return { post: null, problem: "unavailable" as const, config };
    return { post: null, problem: "missing" as const, config };
  }
}

export { thaiTranslation, isDemoPost };
