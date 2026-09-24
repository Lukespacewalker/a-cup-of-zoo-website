import { expect, test } from "bun:test";
import { assertContentConfig, createGateway } from "../../src/lib/content/create-gateway";
import { ContentUnavailableError } from "../../src/lib/content/errors";
import { fetchWithTimeout } from "../../src/lib/content/fetch-with-timeout";
import { isDemoPost, postsForEnvironment } from "../../src/lib/content/posts";
import type { PostDto } from "@lukespace-cms/client";

test("production cannot silently use fixtures", () => {
  expect(() => assertContentConfig({ environment: "production", mode: "fixture" })).toThrow();
});

test("CMS mode requires an explicit origin", () => {
  expect(() => assertContentConfig({ environment: "local", mode: "cms" })).toThrow();
});

test("timeout is not treated as an empty list", async () => {
  const timed = fetchWithTimeout(20);
  await expect(timed("http://127.0.0.1:9/missing")).rejects.toBeInstanceOf(ContentUnavailableError);
  const gateway = createGateway({ environment: "local", mode: "cms", cmsBaseUrl: "http://127.0.0.1:9" }, timed);
  await expect(gateway.listPosts()).rejects.toBeInstanceOf(ContentUnavailableError);
});

test("production hides demo posts", () => {
  const post = { translations: [{ slug: "demo-system-news", title: "ข่าวตัวอย่างสำหรับทดสอบระบบ", excerpt: "[[demo]]", locale: "th" }] } as PostDto;
  expect(isDemoPost(post)).toBe(true);
  expect(postsForEnvironment([post], "production")).toEqual([]);
  expect(postsForEnvironment([post], "local")).toHaveLength(1);
});
