import { expect, test } from "bun:test";
import { ballCount, rankAnimals } from "../../src/lib/voting/model";
import { loadVoteTotals, forwardVote } from "../../src/lib/voting/gateway";

test("every visible ball is one vote and full jars hold exactly fifty", () => {
  for (const [votes, balls] of [
    [0, 0],
    [1, 1],
    [2, 2],
    [49, 49],
    [50, 0],
    [51, 1],
    [100, 0],
    [103, 3],
    [50003, 3],
  ]) {
    expect(ballCount(votes)).toBe(balls);
    expect(Math.floor(votes / 50) * 50 + ballCount(votes)).toBe(votes);
  }
});
test("ties share a rank without inventing winners at zero", () => {
  expect(
    rankAnimals([
      { id: "a", count: 10, sortOrder: 2 },
      { id: "b", count: 10, sortOrder: 1 },
      { id: "c", count: 0, sortOrder: 0 },
    ]).map((item) => [item.id, item.rank]),
  ).toEqual([
    ["b", 1],
    ["a", 1],
    ["c", null],
  ]);
});
test("fixture mode never fabricates totals or sends a vote upstream", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls++;
    throw new Error("must not fetch");
  };
  const config = { mode: "fixture" as const, environment: "local" as const };
  expect((await loadVoteTotals(config, fetcher)).state).toBe("disabled");
  const request = new Request("https://cafe.test/api/votes/a", {
    method: "POST",
    headers: {
      origin: "https://cafe.test",
      "content-type": "application/json",
    },
  });
  expect((await forwardVote(config, "a", request, fetcher)).status).toBe(503);
  expect(calls).toBe(0);
});
test("vote proxy rejects cross-origin submission and accepts only validated CMS results", async () => {
  const config = {
    mode: "cms" as const,
    environment: "local" as const,
    cmsBaseUrl: "https://cms.test",
  };
  const foreign = new Request("https://cafe.test/api/votes/a", {
    method: "POST",
    headers: {
      origin: "https://other.test",
      "content-type": "application/json",
    },
  });
  expect((await forwardVote(config, "a", foreign)).status).toBe(403);
  const local = new Request("https://cafe.test/api/votes/a", {
    method: "POST",
    headers: {
      origin: "https://cafe.test",
      "content-type": "application/json",
    },
  });
  let called = "";
  const response = await forwardVote(config, "a", local, async (url, init) => {
    called = String(url);
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ "content-type": "application/json" });
    return Response.json({ animalId: "a", count: 12 });
  });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ animalId: "a", count: 12 });
  expect(called).toBe("https://cms.test/api/public/animal-votes/a");
  expect(
    (
      await loadVoteTotals(config, async () =>
        Response.json({ items: [{ animalId: "a", count: -1 }], total: -1 }),
      )
    ).state,
  ).toBe("unavailable");
});
test("Cloudflare-compatible manual redirects prevent following CMS redirects", async () => {
  const config = {
    mode: "cms" as const,
    environment: "local" as const,
    cmsBaseUrl: "https://cms.test",
  };
  const totals = await loadVoteTotals(config, async (_url, init) => {
    expect(init?.redirect).toBe("manual");
    return Response.json({ items: [], total: 0 });
  });
  expect(totals.state).toBe("ready");
});
