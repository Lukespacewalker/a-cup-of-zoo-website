import type { SiteContentGateway } from "./create-gateway";
import { fixturePosts, fixtureVenue } from "./fixture-data";

export function createFixtureGateway(): SiteContentGateway {
  return {
    async getVenue() {
      return structuredClone(fixtureVenue);
    },
    async listPosts() {
      return structuredClone(fixturePosts);
    },
    async getPost(slug: string) {
      return (
        structuredClone(fixturePosts).find((post) =>
          post.translations.some((translation) => translation.slug === slug),
        ) ?? null
      );
    },
  };
}
