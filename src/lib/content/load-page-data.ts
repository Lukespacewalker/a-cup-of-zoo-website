import type { PostDto, PublicVenueDto } from "@lukespace-cms/client";
import type { ContentConfig, SiteContentGateway } from "./create-gateway";
import { ContentNotFoundError } from "./errors";
import { postsForEnvironment } from "./posts";

export type PageData = {
  mode: ContentConfig["mode"];
  environment: ContentConfig["environment"];
  venue: PublicVenueDto | null;
  venueProblem: "missing" | "unavailable" | null;
  posts: PostDto[];
  postsProblem: "unavailable" | null;
};

export type LoadPageOptions = { includePosts?: boolean };

export async function loadPageData(
  config: ContentConfig,
  gateway: SiteContentGateway,
  { includePosts = false }: LoadPageOptions = {},
): Promise<PageData> {
  const [venueResult, postsResult] = await Promise.allSettled([
    gateway.getVenue(),
    includePosts ? gateway.listPosts() : Promise.resolve([] as PostDto[]),
  ]);
  return {
    mode: config.mode,
    environment: config.environment,
    venue: venueResult.status === "fulfilled" ? venueResult.value : null,
    venueProblem:
      venueResult.status === "fulfilled"
        ? null
        : venueResult.reason instanceof ContentNotFoundError
          ? "missing"
          : "unavailable",
    posts:
      postsResult.status === "fulfilled"
        ? postsForEnvironment(postsResult.value, config.environment)
        : [],
    postsProblem:
      postsResult.status === "rejected" &&
      !(postsResult.reason instanceof ContentNotFoundError)
        ? "unavailable"
        : null,
  };
}
