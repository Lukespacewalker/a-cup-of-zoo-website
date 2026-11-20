import { expect, test, type Locator } from "@playwright/test";

async function expectTextToFit(regions: Locator) {
  expect(await regions.count()).toBeGreaterThan(0);
  const overflowing = await regions.evaluateAll((elements) => {
    const viewportWidth = document.documentElement.clientWidth;
    return elements.flatMap((element) => {
      const { left, right } = element.getBoundingClientRect();
      const bounds = {
        left: Math.max(0, left),
        right: Math.min(right, viewportWidth),
      };
      const textNodes = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
      );
      const range = document.createRange();
      const outside: string[] = [];
      while (textNodes.nextNode()) {
        const node = textNodes.currentNode;
        const text = node.textContent?.trim();
        if (!text) continue;
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        if (
          rect.width &&
          (rect.left < bounds.left - 1 || rect.right > bounds.right + 1)
        ) {
          outside.push(text);
        }
      }
      return outside;
    });
  });
  expect(overflowing).toEqual([]);
}

test.describe("enlarged text", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://www.google.com/maps?**", (route) =>
      route.abort(),
    );
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        document.documentElement.style.fontSize = "200%";
      });
    });
  });

  for (const prefix of ["", "/en"]) {
    test(`visit details and footer fit at 320px and 390px (${prefix ? "EN" : "TH"})`, async ({
      page,
    }) => {
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 540 });
        await page.goto(`${prefix}/visit/`);
        await page.evaluate(() => document.fonts.ready);
        await expectTextToFit(
          page.locator(
            ".visit-schedule, .visit-card, .visit-address, .footer-grid",
          ),
        );
      }
    });
  }

  test("café books, menu prices, activities and club details reflow", async ({
    page,
  }) => {
    const checks = [
      { width: 320, path: "/en/cafe/", regions: ".menu-book" },
      {
        width: 320,
        path: "/en/cafe/food/",
        regions: ".price-options, .menu-book",
      },
      {
        width: 320,
        path: "/en/activities/",
        regions:
          ".activity-terms, .shop-map-toolbar, .experience-list li, .animal-food-list",
      },
      { width: 320, path: "/en/", regions: ".garden-story, .club-invitation" },
      {
        width: 768,
        path: "/en/club/",
        regions: ".club-welcome, .tier-list > li",
      },
    ];
    for (const { width, path, regions } of checks) {
      await page.setViewportSize({ width, height: 640 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      await expectTextToFit(page.locator(regions));
    }
  });

  test("keyboard focus clears the visit shortcuts and short screens keep them in flow", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 540 });
    await page.goto("/en/visit/");
    await page.evaluate(() => document.fonts.ready);
    const shortcuts = page.getByRole("navigation", { name: "Visit shortcuts" });
    const footer = page.getByRole("navigation", { name: "Footer navigation" });
    const visit = footer.getByRole("link", { name: "Plan your visit" });
    await expect(shortcuts).toHaveCSS("position", "fixed");
    await footer.getByRole("link", { name: "News (Thai)" }).focus();
    await page.keyboard.press("Tab");
    await expect(visit).toBeFocused();
    await expect
      .poll(() =>
        visit.evaluate((link) => {
          const { left, right, top, bottom } = link.getBoundingClientRect();
          const center = document.elementFromPoint(
            (left + right) / 2,
            (top + bottom) / 2,
          );
          return link.contains(center);
        }),
      )
      .toBe(true);

    await page.setViewportSize({ width: 700, height: 320 });
    await expect(shortcuts).toHaveCSS("position", "static");
    await page.keyboard.press("Tab");
    await expect(
      shortcuts.getByRole("link", { name: "Food menu" }),
    ).toBeFocused();
    await expect(
      shortcuts.getByRole("link", { name: "Food menu" }),
    ).toBeInViewport({ ratio: 1 });
  });

  test("enlarged photo captions have room without losing the gallery controls", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 500 });
    await page.goto("/en/activities/#one-zone");
    await page.evaluate(() => document.fonts.ready);
    const photos = page.locator("#one-zone [data-activity-photo]");
    await photos.first().focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("heading")).toHaveText(
      (await photos.nth(1).getAttribute("data-caption"))!,
    );
    const caption = dialog.locator(".activity-photo-dialog__caption");
    await expectTextToFit(caption);
    expect((await caption.boundingBox())!.width).toBeGreaterThan(170);
    await page.keyboard.press("Escape");
    await expect(photos.first()).toBeFocused();
  });

  test("animal party details and the vote button fit the narrow viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 500 });
    await page.goto("/en/animals/#animal-family");
    await page.evaluate(() => document.fonts.ready);
    const dog = page.locator('[data-party-pin="dog"]');
    await dog.focus();
    await page.keyboard.press("Enter");
    const party = page.locator('[data-party-sheet="dog"]');
    await expectTextToFit(party.locator(".party-sheet-header"));
    const vote = party.getByRole("button", { name: "Vote for this party" });
    await page.keyboard.press("Tab");
    await expect(vote).toBeFocused();
    await expect(vote).toBeInViewport({ ratio: 1 });
  });
});
