import { expect, test } from "bun:test";
import {
  assertContentConfig,
  createGateway,
} from "../../src/lib/content/create-gateway";
import { ContentUnavailableError } from "../../src/lib/content/errors";
import { fetchWithTimeout } from "../../src/lib/content/fetch-with-timeout";
import { isDemoPost, postsForEnvironment } from "../../src/lib/content/posts";
import type { PostDto } from "@lukespace-cms/client";

test("production cannot silently use fixtures", () => {
  expect(() =>
    assertContentConfig({ environment: "production", mode: "fixture" }),
  ).toThrow();
});

test("CMS mode requires an explicit origin", () => {
  expect(() =>
    assertContentConfig({ environment: "local", mode: "cms" }),
  ).toThrow();
});

test("the CMS factory retains the default request timeout", async () => {
  const originalFetch = globalThis.fetch;
  let signal: AbortSignal | null | undefined;
  globalThis.fetch = (async (_input, init) => {
    signal = init?.signal;
    return Response.json({
      content: { displayName: "Test café", regularHours: [] },
    });
  }) as typeof fetch;
  try {
    await createGateway({
      environment: "local",
      mode: "cms",
      cmsBaseUrl: "https://cms.test",
    }).getVenue();
    expect(signal).toBeInstanceOf(AbortSignal);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("timeout is not treated as an empty list", async () => {
  const timed = fetchWithTimeout(20);
  await expect(timed("http://127.0.0.1:9/missing")).rejects.toBeInstanceOf(
    ContentUnavailableError,
  );
  const gateway = createGateway(
    { environment: "local", mode: "cms", cmsBaseUrl: "http://127.0.0.1:9" },
    timed,
  );
  await expect(gateway.listPosts()).rejects.toBeInstanceOf(
    ContentUnavailableError,
  );
});

test("the timeout also bounds a response body that stops arriving", async () => {
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{"items":['));
          },
        }),
        { headers: { "content-type": "application/json" } },
      ),
  });
  try {
    const response = await fetchWithTimeout(100)(server.url);
    const aborted = response.json().then(
      () => false,
      () => true,
    );
    expect(
      await Promise.race([aborted, Bun.sleep(500).then(() => false)]),
    ).toBe(true);
  } finally {
    await server.stop(true);
  }
});

test("a parent request that is already aborted remains cancelled", async () => {
  const controller = new AbortController();
  controller.abort();
  let requests = 0;
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    fetch: () => {
      requests++;
      return Response.json({ ok: true });
    },
  });
  try {
    await expect(
      fetchWithTimeout()(server.url, { signal: controller.signal }),
    ).rejects.toBeInstanceOf(ContentUnavailableError);
    expect(requests).toBe(0);
  } finally {
    await server.stop(true);
  }
});

test("production hides demo posts", () => {
  const post = {
    translations: [
      {
        slug: "demo-system-news",
        title: "ข่าวตัวอย่างสำหรับทดสอบระบบ",
        excerpt: "[[demo]]",
        locale: "th",
      },
    ],
  } as PostDto;
  expect(isDemoPost(post)).toBe(true);
  expect(postsForEnvironment([post], "production")).toEqual([]);
  expect(postsForEnvironment([post], "local")).toHaveLength(1);
});
