import type { PostDto, PublicVenueDto } from "@lukespace-cms/client";
import { ContentNotFoundError, ContentUnavailableError } from "./errors";
import { gatewayFromRuntime, runtimeConfig } from "./runtime-config";
import { isDemoPost, postsForEnvironment, thaiTranslation } from "./posts";

export type PageData = {
  mode: "fixture" | "cms";
  environment: "local" | "staging" | "production";
  venue: PublicVenueDto | null;
  venueProblem: "missing" | "unavailable" | null;
  posts: PostDto[];
  postsProblem: "unavailable" | null;
};

export async function loadPage(): Promise<PageData> {
  const config = runtimeConfig();
  const gateway = gatewayFromRuntime();
  let venue: PublicVenueDto | null = null;
  let venueProblem: PageData["venueProblem"] = null;
  try {
    venue = await gateway.getVenue();
  } catch (error) {
    venueProblem = error instanceof ContentNotFoundError ? "missing" : "unavailable";
  }
  let posts: PostDto[] = [];
  let postsProblem: PageData["postsProblem"] = null;
  try {
    posts = postsForEnvironment(await gateway.listPosts(), config.environment);
  } catch (error) {
    if (!(error instanceof ContentNotFoundError)) postsProblem = "unavailable";
  }
  return { mode: config.mode, environment: config.environment, venue, venueProblem, posts, postsProblem };
}

export async function loadPost(slug: string) {
  const config = runtimeConfig();
  const gateway = gatewayFromRuntime();
  try {
    const post = await gateway.getPost(slug);
    if (!post || (config.environment === "production" && isDemoPost(post))) return { post: null, problem: "missing" as const, config };
    return { post, problem: null, config };
  } catch (error) {
    if (error instanceof ContentUnavailableError) return { post: null, problem: "unavailable" as const, config };
    return { post: null, problem: "missing" as const, config };
  }
}

export { thaiTranslation, isDemoPost };
