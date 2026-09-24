import { createCmsClient, type PostDto, type PublicVenueDto } from "@lukespace-cms/client";
import type { SiteContentGateway } from "./create-gateway";
import { ContentNotFoundError, ContentUnavailableError } from "./errors";
import { fetchWithTimeout, readCmsJson } from "./fetch-with-timeout";

export function createCmsGateway(cmsBaseUrl: string, fetchImpl: typeof fetch = fetchWithTimeout(3000)): SiteContentGateway {
  const client = createCmsClient({ baseUrl: cmsBaseUrl, fetch: fetchImpl });
  return {
    async getVenue() {
      try {
        const venue = await client.request<PublicVenueDto>("/api/public/venue");
        if (!venue?.content?.displayName || !Array.isArray(venue.content.regularHours)) {
          throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
        }
        return venue;
      } catch (error) {
        throw mapCmsError(error);
      }
    },
    async listPosts() {
      const posts = await collectPosts(client);
      return posts;
    },
    async getPost(slug: string) {
      try {
        return await client.request<PostDto>(`/api/public/posts/${encodeURIComponent(slug)}?locale=th`);
      } catch (error) {
        const mapped = mapCmsError(error);
        if (mapped instanceof ContentNotFoundError) return null;
        throw mapped;
      }
    },
  };
}

async function collectPosts(client: ReturnType<typeof createCmsClient>) {
  const posts: PostDto[] = [];
  const pageSize = 100;
  for (let offset = 0; offset < 1000; offset += pageSize) {
    let payload: { items?: PostDto[] };
    try {
      payload = await client.request<{ items: PostDto[] }>(`/api/public/posts?locale=th&limit=${pageSize}&offset=${offset}`);
    } catch (error) {
      throw mapCmsError(error);
    }
    if (!payload || !Array.isArray(payload.items)) throw new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
    posts.push(...payload.items);
    if (payload.items.length < pageSize) break;
  }
  return posts;
}

function mapCmsError(error: unknown) {
  if (error instanceof ContentNotFoundError || error instanceof ContentUnavailableError) return error;
  const status = error && typeof error === "object" && "status" in error ? Number(error.status) : 0;
  if (status === 404) return new ContentNotFoundError("ไม่พบข้อมูล");
  return new ContentUnavailableError("ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้");
}

export { readCmsJson };
