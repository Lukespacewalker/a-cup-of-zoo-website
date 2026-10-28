import { expect, test } from "bun:test";
import { loadPageData } from "../../src/lib/content/load-page-data";
import { fixtureVenue } from "../../src/lib/content/fixture-data";
import {
  ContentNotFoundError,
  ContentUnavailableError,
} from "../../src/lib/content/errors";
import type { SiteContentGateway } from "../../src/lib/content/create-gateway";
import type { PostDto, PublicVenueDto } from "@lukespace-cms/client";

const config = { mode: "cms" as const, environment: "production" as const };
const post = {
  translations: [
    { locale: "th", slug: "garden", title: "Garden news", excerpt: "News" },
  ],
} as PostDto;

function gateway(
  overrides: Partial<SiteContentGateway> = {},
): SiteContentGateway {
  return {
    getVenue: async () => fixtureVenue,
    listPosts: async () => [post],
    getPost: async () => null,
    ...overrides,
  };
}

test("pages that do not show news never request posts", async () => {
  let postRequests = 0;
  const result = await loadPageData(
    config,
    gateway({
      listPosts: async () => {
        postRequests++;
        throw new Error("must not request news");
      },
    }),
  );
  expect(postRequests).toBe(0);
  expect(result).toMatchObject({
    venue: fixtureVenue,
    venueProblem: null,
    posts: [],
    postsProblem: null,
  });
});

test("news and venue requests start together while keeping production filtering", async () => {
  const started: string[] = [];
  let releaseVenue!: (venue: PublicVenueDto) => void;
  let releasePosts!: (posts: PostDto[]) => void;
  const venueRequest = new Promise<PublicVenueDto>((resolve) => {
    releaseVenue = resolve;
  });
  const postsRequest = new Promise<PostDto[]>((resolve) => {
    releasePosts = resolve;
  });
  const result = loadPageData(
    config,
    gateway({
      getVenue: () => {
        started.push("venue");
        return venueRequest;
      },
      listPosts: () => {
        started.push("posts");
        return postsRequest;
      },
    }),
    { includePosts: true },
  );
  expect(started).toEqual(["venue", "posts"]);
  releaseVenue(fixtureVenue);
  releasePosts([
    post,
    {
      ...post,
      translations: [{ ...post.translations[0], slug: "demo-garden" }],
    },
  ]);
  expect((await result).posts).toEqual([post]);
});

test("venue and news failures retain independent unavailable and missing states", async () => {
  const unavailable = await loadPageData(
    config,
    gateway({
      getVenue: async () => {
        throw new ContentNotFoundError();
      },
      listPosts: async () => {
        throw new ContentUnavailableError();
      },
    }),
    { includePosts: true },
  );
  expect(unavailable).toMatchObject({
    venue: null,
    venueProblem: "missing",
    posts: [],
    postsProblem: "unavailable",
  });
  const missingNews = await loadPageData(
    config,
    gateway({
      getVenue: async () => {
        throw new Error("CMS offline");
      },
      listPosts: async () => {
        throw new ContentNotFoundError();
      },
    }),
    { includePosts: true },
  );
  expect(missingNews).toMatchObject({
    venue: null,
    venueProblem: "unavailable",
    posts: [],
    postsProblem: null,
  });
});
