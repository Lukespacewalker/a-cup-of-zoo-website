import { expect, test } from "bun:test";
import { serveHeroVideo } from "../../src/lib/media/hero-video";

const url = "https://acupofzoo.com/videos/homepage-hero-dissolve.mp4?ranges=1";
const fixture = Uint8Array.from({ length: 10 }, (_, i) => i);

function asset(body: Uint8Array | null = fixture) {
  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=604800",
      ...(body === null ? { "Content-Length": "10" } : {}),
      "Content-Type": "video/mp4",
      ETag: '"fixture"',
    },
  });
}

for (const [range, start, end] of [
  ["bytes=0-", 0, 9],
  ["bytes=2-4", 2, 4],
  ["bytes=8-99", 8, 9],
  ["bytes=-3", 7, 9],
  ["bytes=-99", 0, 9],
] as const) {
  test(`serves exact media bytes for ${range} when the asset binding returns 200 without a length`, async () => {
    const request = new Request(url, {
      headers: { Range: range, "If-Range": '"fixture"' },
    });
    const result = await serveHeroVideo(request, async (upstream) => {
      expect(upstream.headers.get("Range")).toBeNull();
      expect(upstream.headers.get("If-Range")).toBeNull();
      expect(upstream.headers.get("Accept-Encoding")).toBe("identity");
      return asset();
    });
    expect(result.status).toBe(206);
    expect(result.headers.get("Accept-Ranges")).toBe("bytes");
    expect(result.headers.get("Content-Range")).toBe(
      `bytes ${start}-${end}/10`,
    );
    expect(result.headers.get("Content-Length")).toBe(String(end - start + 1));
    expect(result.headers.get("Cache-Control")).toBe("public, max-age=604800");
    expect(result.headers.get("ETag")).toBe('"fixture"');
    expect(result.headers.get("Content-Type")).toBe("video/mp4");
    expect(await result.bytes()).toEqual(fixture.slice(start, end + 1));
  });
}

test("declares the full size when the requested video range is unsatisfiable", async () => {
  for (const range of ["bytes=10-", "bytes=-0"]) {
    const result = await serveHeroVideo(
      new Request(url, { headers: { Range: range } }),
      async () => asset(),
    );
    expect(result.status).toBe(416);
    expect(result.headers.get("Content-Range")).toBe("bytes */10");
    expect(await result.text()).toBe("");
  }
});

test("retains full responses for unsupported ranges or stale validators", async () => {
  for (const headers of [
    { Range: "bytes=4-2" },
    { Range: "bytes=0-1,4-5" },
    { Range: "seconds=4-5" },
    { Range: "bytes=2-4", "If-Range": '"old"' },
    { Range: "bytes=2-4", "If-Range": 'W/"fixture"' },
  ]) {
    const result = await serveHeroVideo(
      new Request(url, { headers }),
      async () => asset(),
    );
    expect(result.status).toBe(200);
    expect(result.headers.get("Content-Range")).toBeNull();
    expect(await result.bytes()).toEqual(fixture);
  }
});

test("retains HEAD metadata and conditional asset responses", async () => {
  const head = await serveHeroVideo(
    new Request(url, { method: "HEAD", headers: { Range: "bytes=0-1" } }),
    async (request) => {
      expect(request.method).toBe("HEAD");
      expect(request.headers.get("Range")).toBeNull();
      return asset(null);
    },
  );
  expect(head.status).toBe(200);
  expect(head.headers.get("Content-Length")).toBe("10");
  expect(await head.text()).toBe("");

  const cached = await serveHeroVideo(
    new Request(url, {
      headers: { Range: "bytes=0-1", "If-None-Match": '"fixture"' },
    }),
    async (request) => {
      expect(request.headers.get("If-None-Match")).toBe('"fixture"');
      return new Response(null, { status: 304 });
    },
  );
  expect(cached.status).toBe(304);
});
