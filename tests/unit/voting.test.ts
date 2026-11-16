import { expect, test } from "bun:test";
import { rankByVotes } from "../../src/lib/voting/model";

test("ties share a rank without inventing winners at zero", () => {
  expect(
    rankByVotes([
      { id: "a", count: 10, sortOrder: 2 },
      { id: "b", count: 10, sortOrder: 1 },
      { id: "c", count: 2, sortOrder: 0 },
      { id: "d", count: 0, sortOrder: 3 },
    ]).map((item) => [item.id, item.rank]),
  ).toEqual([
    ["b", 1],
    ["a", 1],
    ["c", 3],
    ["d", null],
  ]);
});
