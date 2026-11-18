import { expect, test } from "@playwright/test";
import { partyIds, type PartyId } from "../../src/lib/voting/party-ids";

test.use({ hasTouch: true });

const snapshot = (counts: Partial<Record<PartyId, number>>) => ({
  items: partyIds.map((partyId) => ({ partyId, count: counts[partyId] ?? 0 })),
  total: Object.values(counts).reduce((total, count) => total + count, 0),
});

test("both languages and home use the same 14-party ballot and keep old links working", async ({
  page,
  request,
}) => {
  for (const prefix of ["", "/en"]) {
    const redirect = await request.get(`${prefix}/vote/`, { maxRedirects: 0 });
    expect(redirect.status()).toBe(301);
    expect(redirect.headers().location).toBe(
      `${prefix}/animals/#animal-family`,
    );

    for (const path of ["/animals/", "/"]) {
      await page.goto(prefix + path);
      const board = page.locator("[data-party-board]");
      await expect(board).toHaveAttribute("data-party-enhanced", "true");
      await expect(board.locator("#animal-parties-title")).toHaveText(
        prefix ? "Who lives here?" : "สมาชิกที่นี่มีใครกันบ้าง?",
      );
      await expect(board.locator(".party-intro p")).toHaveText(
        prefix
          ? "Meet our animal friends and give your favourite party a heart."
          : "รู้จักเพื่อนสัตว์ แล้วโหวดใจให้พรรคโปรด",
      );
      const siteFont = await page
        .locator("main")
        .evaluate((main) => getComputedStyle(main).fontFamily);
      await expect(board.locator("#animal-parties-title")).toHaveCSS(
        "font-family",
        siteFont,
      );
      await expect(board.locator("[data-party-pin]")).toHaveCount(14);
      const fullSize = board.getByRole("link", {
        name: prefix ? "View full-size illustration" : "ดูภาพขนาดเต็ม",
      });
      const imageHref = await fullSize.getAttribute("href");
      expect(imageHref).toContain("animal-friends-gouache");
      const illustration = await request.get(
        new URL(imageHref!, page.url()).href,
      );
      expect(illustration.ok()).toBe(true);
      expect(illustration.headers()["content-type"]).toContain("image/webp");
      await expect(board.locator("[data-party-sheet]:visible")).toHaveCount(0);
      await expect(board.locator("dialog")).toHaveCount(0);
      await board.locator('[data-party-pin="prairie-dog"]').click();
      const party = board.locator('[data-party-sheet="prairie-dog"]');
      await expect(party).toBeVisible();
      await expect(party.locator("h3")).toHaveCSS("font-family", siteFont);
      await expect(party).toContainText(prefix ? "Thung Ngern" : "ถุงเงิน");
      await expect(party.locator("[data-party-member] img")).toHaveCount(2);
      await expect(party.locator("[data-party-vote]")).toBeEnabled();
      expect(
        await party.locator("img").evaluateAll(async (images) => {
          await Promise.all(images.map((image) => image.decode()));
          return images.every((image) => image.naturalWidth > 0);
        }),
      ).toBe(true);
    }
  }
  await page.goto("/en/animals/#animal-nama");
  await expect(page.locator('[data-party-sheet="fox"]')).toBeVisible();
  await expect(page.locator('[data-resident="nama"]')).toBeInViewport();
});

test("map targets and party picker work in keyboard order and on a small viewport", async ({
  page,
}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/en/animals/");
    if (width === 320) {
      for (const partyId of partyIds) {
        await page.locator(`[data-party-pin="${partyId}"]`).tap();
        const party = page.locator(`[data-party-sheet="${partyId}"]`);
        await expect(party).toBeVisible();
        await expect(party.locator(".party-members img").first()).toBeVisible();
        await expect(
          party.locator(".party-members strong").first(),
        ).not.toBeEmpty();
        if (partyId === "fish") {
          await expect(party.locator("[data-party-member] strong")).toHaveText([
            "Koi",
            "Snakehead fish",
            "Alligator gar",
            "Redtail catfish",
          ]);
        }
        if (partyId === "rabbit") {
          await expect(
            party.locator('[data-party-member="rabbit-family"]'),
          ).toContainText("Kao-Sa-Lee and Kao-Fang");
        }
      }
    }
    const pin = page.locator('[data-party-pin="dog"]');
    await pin.focus();
    await page.keyboard.press("Enter");
    const dog = page.locator('[data-party-sheet="dog"]');
    await expect(dog.locator("h3")).toBeFocused();
    await expect(dog.locator("[data-resident]")).toHaveCount(11);
    await expect(
      dog.locator("[data-party-member]").locator("strong"),
    ).toHaveText(["Mali", "Gamo", "Barbie", "Love"]);
    await expect(pin).toHaveAttribute("aria-current", "location");
    await expect(page).toHaveURL(/#party-dog$/);
    await page.keyboard.press("Tab");
    await expect(dog.locator("[data-party-vote]")).toBeFocused();

    const picker = page.getByRole("combobox", {
      name: "Choose an animal party",
    });
    await picker.selectOption("poultry");
    await page.getByRole("button", { name: "View party", exact: true }).click();
    const poultry = page.locator('[data-party-sheet="poultry"]');
    await expect(poultry).toBeVisible();
    await expect(poultry).toBeInViewport();
    await expect(poultry.locator("[data-party-member] strong")).toHaveText([
      "Call duck",
      "Local duck",
      "Geese",
      "Chicken breeds",
    ]);
    await expect(dog).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const pinBox = await pin.boundingBox();
    expect(pinBox?.width).toBeGreaterThanOrEqual(44);
    expect(pinBox?.height).toBeGreaterThanOrEqual(44);
    await page.reload();
    await expect(poultry).toBeVisible();
  }
});

test("home aligns both maps and both pages show the illustrated podium", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 850 });
  let counts: Partial<Record<PartyId, number>> = { fish: 12, dog: 8, civet: 3 };
  await page.route("**/api/party-votes/", (route) =>
    route.fulfill({ json: snapshot(counts) }),
  );
  await page.goto("/");
  const heading = page.getByRole("heading", {
    name: "สมาชิกที่นี่มีใครกันบ้าง?",
  });
  await expect(heading).toBeVisible();
  const map = page.locator("[data-shop-map]");
  await expect(map.locator(".shop-map-footnote")).toHaveCount(0);
  const mapBounds = await map.boundingBox();
  const headingBounds = await heading.boundingBox();
  expect(mapBounds?.x).toBe(headingBounds?.x);
  expect(mapBounds?.width).toBe(headingBounds?.width);

  await page.goto("/en/");
  const refresh = page.getByRole("link", { name: "Refresh scores" });
  await refresh.click();
  const podium = page.locator("[data-party-leaders]");
  await expect(podium.locator("[data-place]")).toHaveText(["1", "2", "3"]);
  const portraits = () =>
    podium.locator(".party-podium-portrait:visible").evaluateAll((images) =>
      images.map((image) => {
        const { x, y, width, height } = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        return {
          partyId: image.closest("a")?.dataset.partyLink,
          x,
          y,
          width,
          height,
          radius: style.borderRadius,
          source: style.backgroundImage,
          crop: style.backgroundPosition,
          zoom: style.backgroundSize,
        };
      }),
    );
  const [first, second, third] = await portraits();
  expect(first.x).toBeGreaterThan(second.x);
  expect(first.x).toBeLessThan(third.x);
  expect(first.y).toBeLessThan(second.y);
  expect(second.y).toBeLessThan(third.y);
  for (const portrait of [first, second, third]) {
    expect(portrait.width).toBe(portrait.height);
    expect(portrait.radius).toBe("50%");
    expect(portrait.source).toBe(first.source);
  }
  expect(new Set([first.crop, second.crop, third.crop]).size).toBe(3);
  const artwork = /^url\("(.+)"\)$/.exec(first.source)?.[1] ?? "";
  expect(artwork).toContain("animal-friends-gouache");
  const mapVariants = await page.locator(".party-map-art img").evaluate((img) =>
    (img as HTMLImageElement).srcset.split(",").map((variant) => {
      const [src] = variant.trim().split(" ");
      return new URL(src, location.href).href;
    }),
  );
  expect(mapVariants).toContain(artwork);
  expect((await page.request.get(artwork)).ok()).toBe(true);

  counts = { fish: 12, dog: 12, civet: 3 };
  await refresh.click();
  const places = podium.locator("[data-party-leader]");
  await expect(places.nth(1)).toHaveAttribute("data-rank", "1");
  const [tiedFirst, tiedSecond] = await portraits();
  expect(tiedFirst.y).toBe(tiedSecond.y);
  expect(tiedFirst.crop).toBe(second.crop);
  expect(tiedSecond.crop).toBe(first.crop);
  const steps = podium.locator(".party-podium-rank");
  await expect(steps.locator("[data-place]")).toHaveText(["1", "1", "3"]);
  const heights = await steps.evaluateAll((blocks) =>
    blocks.map((block) => block.getBoundingClientRect().height),
  );
  expect(heights[0]).toBe(heights[1]);
  expect(heights[0]).toBeGreaterThan(heights[2]);
  await podium.locator('[data-party-link="fish"]').click();
  const fish = page.locator('[data-party-sheet="fish"]');
  await expect(fish.locator("h3")).toBeFocused();
  await expect(
    fish.getByText("Species illustrations and labels from Canva"),
  ).toHaveCount(0);

  const crops = new Set<string>();
  for (let start = 0; start < partyIds.length; start += 3) {
    const batch = partyIds.slice(start, start + 3);
    counts = Object.fromEntries(batch.map((id, index) => [id, 3 - index]));
    await refresh.click();
    await expect
      .poll(async () => (await portraits()).map(({ partyId }) => partyId))
      .toEqual(batch);
    for (const { crop, source, zoom } of await portraits()) {
      expect(source).toBe(first.source);
      expect(Number.parseFloat(zoom)).toBeGreaterThan(100);
      crops.add(crop);
    }
  }
  expect(crops.size).toBe(partyIds.length);

  counts = { fish: 12, dog: 8, civet: 3 };
  await page.goto("/en/animals/");
  await refresh.click();
  await expect(podium.locator("[data-place]")).toHaveText(["1", "2", "3"]);
  const directoryPortraits = await portraits();
  expect(
    directoryPortraits.map(({ partyId, source }) => ({ partyId, source })),
  ).toEqual(
    [first, second, third].map(({ partyId, source }) => ({ partyId, source })),
  );
  await podium.locator('[data-party-link="fish"]').click();
  await expect(fish.locator("h3")).toBeFocused();
});

test("both animal maps leave room for the details beside them only on wide screens", async ({
  page,
}) => {
  for (const path of ["/", "/animals/"]) {
    await page.goto(path);
    const pin = page.locator('[data-party-pin="dog"]');
    const map = page.locator(".party-map");
    const layout = page.locator(".party-map-layout");
    const details = page.locator('[data-party-sheet="dog"]');
    for (const width of [390, 1440, 1920, 2560]) {
      const height = width === 390 ? 844 : 1000;
      await page.setViewportSize({ width, height });
      await pin.click();
      await expect(details.locator("h3")).toBeFocused();
      const mapBox = (await map.boundingBox())!;
      const layoutBox = (await layout.boundingBox())!;
      const detailsBox = (await details.boundingBox())!;
      const voteBox = (await details
        .locator("[data-party-vote]")
        .boundingBox())!;
      const shortcutsBox = await page.locator(".sticky-cta").boundingBox();
      expect(voteBox.y).toBeGreaterThanOrEqual(0);
      expect(voteBox.y + voteBox.height).toBeLessThanOrEqual(
        shortcutsBox?.y ?? height,
      );
      if (width < 2400) {
        expect(mapBox.width).toBeCloseTo(layoutBox.width);
        expect(detailsBox.y).toBeGreaterThan(mapBox.y + mapBox.height);
      } else {
        expect(mapBox.width).toBeGreaterThan(1200);
        expect(detailsBox.x).toBeGreaterThan(mapBox.x + mapBox.width);
        expect(detailsBox.y).toBeCloseTo(mapBox.y);
      }
      expect(mapBox.x).toBeGreaterThanOrEqual(0);
      expect(detailsBox.x + detailsBox.width).toBeLessThanOrEqual(width);
    }
  }
});

test("a vote updates the party and three leading slots, with a shared rank for ties", async ({
  page,
}) => {
  let releaseVote!: () => void;
  const pendingVote = new Promise<void>((resolve) => {
    releaseVote = resolve;
  });
  let requests = 0;
  await page.route("**/api/party-votes/fox/", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toEqual({});
    requests++;
    await pendingVote;
    await route.fulfill({
      json: snapshot({ dog: 12, cat: 7, fox: 12, fish: 1 }),
    });
  });
  await page.goto("/en/animals/#party-fox");
  const vote = page.getByRole("button", {
    name: "Vote for this party",
    exact: true,
  });
  await vote.focus();
  await page.keyboard.press("Enter");
  try {
    await expect(vote).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("Enter");
  } finally {
    releaseVote();
  }
  await expect(
    page.locator('[data-party-sheet="fox"] [data-party-score]'),
  ).toHaveText("12");
  await expect(vote).toBeFocused();
  await expect(vote).toBeEnabled();
  expect(requests).toBe(1);
  await expect(page.locator("[data-party-total]")).toHaveText("32");
  await expect(page.locator("[data-leader-name]")).toHaveText([
    "The Wagging Tails",
    "The Fluffy Tails",
    "The Nap First Party",
  ]);
  await expect(page.locator("[data-place]")).toHaveText(["1", "1", "3"]);
  await page
    .locator("[data-party-leaders]")
    .getByRole("link", { name: /The Nap First Party/ })
    .click();
  const cats = page.locator('[data-party-sheet="cat"]');
  await expect(cats).toBeVisible();
  await expect(cats.locator('[data-party-member="o-rin-gi"]')).toHaveText(
    "O-Rin-Gi",
  );
  await expect(cats.locator('[data-party-member="cemol"]')).toHaveText("Cemol");
});

test("an unconfirmed vote leaves the score intact and refresh restores totals", async ({
  page,
}) => {
  await page.route("**/api/party-votes/dog/", (route) =>
    route.fulfill({ status: 503, json: {} }),
  );
  await page.route("**/api/party-votes/", (route) =>
    route.fulfill({ json: snapshot({ dog: 3 }) }),
  );
  await page.goto("/animals/#party-dog");
  const party = page.locator('[data-party-sheet="dog"]');
  const score = party.locator("[data-party-score]");
  const before = await score.textContent();
  await party.locator("[data-party-vote]").click();
  await expect(party.locator("[data-party-feedback]")).toContainText(
    "ยืนยันคะแนนไม่ได้",
  );
  await expect(score).toHaveText(before!.trim());
  await page.getByRole("link", { name: "โหลดคะแนนใหม่" }).click();
  await expect(score).toHaveText("3");
  await expect(party.locator("[data-party-vote]")).toBeEnabled();
});
