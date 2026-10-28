import { expect, test } from "@playwright/test";

test("every numbered map stop and each facility can be explored, including places without photos", async ({ page }) => {
  const numberedStops = [
    "cafe", "indoor", "kurama", "oracle", "alligator-gar", "little-farm", "garden", "lotus",
    "koi", "fox", "rabbit", "sweet-garden", "goat", "bridge", "boats", "desert",
  ];
  for (const prefix of ["", "/en"]) {
    for (const route of ["/", "/activities/"]) {
      await page.goto(`${prefix}${route}#garden`);
      const map = page.locator("[data-shop-map]");
      await expect(map.locator("[data-map-pin]")).toHaveCount(19);
      await expect(map.locator(".map-detail")).toHaveCount(0);
      await expect(map.locator("[data-map-zoom]")).toBeVisible();
      for (const [index, id] of numberedStops.entries()) {
        const pin = map.locator(`[data-map-pin="${id}"]`);
        await expect(pin).toHaveAttribute("data-map-number", String(index + 1));
        await map.locator("[data-map-select]").selectOption(id);
        const panel = map.locator(`[data-map-panel="${id}"]`);
        await expect(panel).toBeVisible();
        await expect(panel.locator("h3")).not.toBeEmpty();
        await expect(panel.locator("a")).toHaveAttribute("href", new RegExp(`^${prefix || ""}/(activities|animals|menu|visit)/`));
      }
      for (const id of ["restroom", "parking", "parking-rear"]) {
        await map.locator("[data-map-select]").selectOption(id);
        await expect(map.locator(`[data-map-panel="${id}"]`)).toBeVisible();
      }
      await map.locator("[data-map-select]").selectOption("desert");
      await expect(map.locator('[data-map-panel="desert"] img')).toHaveCount(0);
      await expect(map.locator('[data-map-panel="desert"]')).toContainText(prefix ? "Desert garden" : "สวนทะเลทราย");
    }
  }
});

test("map is the third home section and directly follows activities passes in both languages", async ({ page }) => {
  for (const prefix of ["", "/en"]) {
    await page.goto(`${prefix}/`);
    const sections = page.locator("main > .shell > section");
    await expect(sections.nth(2)).toHaveAttribute("id", "garden");
    await expect(page.locator("[data-shop-map]")).toHaveCount(1);
    await page.locator("[data-map-activities]").click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/activities/#garden$`));
    await expect(page.locator("#passes + #garden [data-shop-map]")).toHaveCount(1);
    await expect(page.locator("[data-shop-map]")).toHaveCount(1);
  }
});

test("hover previews, click pins the selected stop, and keyboard close restores the overview", async ({ page }) => {
  await page.goto("/#garden");
  const map = page.locator("[data-shop-map]");
  const fox = map.locator('[data-map-pin="fox"]');
  const goat = map.locator('[data-map-pin="goat"]');
  await fox.hover();
  await expect(map.locator('[data-map-panel="fox"]')).toBeVisible();
  await fox.click();
  await goat.hover();
  await expect(map.locator('[data-map-panel="goat"]')).toBeVisible();
  await map.locator('[data-map-panel="goat"]').hover();
  await expect(map.locator('[data-map-panel="goat"]')).toBeVisible();
  await map.locator("[data-map-heading]").hover();
  await expect(map.locator('[data-map-panel="fox"]')).toBeVisible();
  await expect(fox).toHaveAttribute("aria-pressed", "true");
  await map.locator("[data-map-close]").focus();
  await page.keyboard.press("Enter");
  await expect(map.locator("[data-map-overview]")).toBeVisible();
  await expect(fox).toHaveAttribute("aria-pressed", "false");
  await goat.focus();
  await page.keyboard.press("Enter");
  await expect(map.locator('[data-map-panel="goat"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(map.locator("[data-map-overview]")).toBeVisible();
});

test("a hovered stop link navigates even when another pin still has keyboard focus", async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/#garden");
    const map = page.locator("[data-shop-map]");
    await map.locator('[data-map-pin="fox"]').click();
    await map.locator('[data-map-pin="goat"]').hover();
    await map.locator('[data-map-panel="goat"] a').click();
    await expect(page).toHaveURL(/\/activities\/#experiences$/);
  }
});

test("mobile selection and zoom work without overflowing the page", async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const prefix of ["", "/en"]) {
      await page.goto(`${prefix}/#garden`);
      const map = page.locator("[data-shop-map]");
      await map.locator("[data-map-select]").selectOption("indoor");
      await expect(map.locator('[data-map-panel="indoor"]')).toBeVisible();
      await expect(map.locator('[data-map-panel="indoor"] a')).toHaveAttribute("href", `${prefix}/activities/#animal-zones`);
      if (width < 760) {
        // Measure together: smooth anchor scrolling can move the page between calls.
        const gap = await map.evaluate(el => {
          const image = el.querySelector("[data-map-viewport]")!.getBoundingClientRect();
          const panel = el.querySelector("[data-map-details]")!.getBoundingClientRect();
          return panel.top - image.bottom;
        });
        expect(gap).toBeGreaterThanOrEqual(0);
      }
      await map.locator("[data-map-zoom]").click();
      await expect(map.locator("[data-map-zoom]")).toHaveAttribute("aria-pressed", "true");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await map.locator("[data-map-zoom]").click();
      await expect(map.locator('[data-map-panel="indoor"]')).toBeVisible();
    }
  }
});

test("touch users can select a pin, close it, and select another inside the enlarged map", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/#garden");
  const map = page.locator("[data-shop-map]");
  await map.locator('[data-map-pin="fox"]').tap();
  await expect(map.locator('[data-map-panel="fox"]')).toBeVisible();
  await expect(map.locator('[data-map-pin="fox"]')).toHaveAttribute("aria-pressed", "true");
  await map.locator("[data-map-close]").tap();
  await expect(map.locator("[data-map-overview]")).toBeVisible();
  await map.locator("[data-map-zoom]").tap();
  await map.locator('[data-map-pin="rabbit"]').tap();
  await expect(map.locator('[data-map-panel="rabbit"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("every pin can be tapped directly on narrow phones", async ({ browser }) => {
  for (const width of [320, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto("/#garden");
    const map = page.locator("[data-shop-map]");
    // Reverse order also checks that an active neighbouring pin does not block the next one.
    const ids = ["parking-rear", "parking", "restroom", "desert", "boats", "bridge", "goat", "sweet-garden", "rabbit", "fox", "koi", "lotus", "garden", "little-farm", "alligator-gar", "oracle", "kurama", "indoor", "cafe"];
    const clippedNumbers = await map.locator(".map-pin-number").evaluateAll(numbers => numbers.filter(number => {
      const badge = number.getBoundingClientRect();
      const board = number.closest("[data-map-board]")!.getBoundingClientRect();
      return badge.bottom > board.bottom + .5 || badge.top < board.top - .5;
    }).map(number => number.textContent));
    expect(clippedNumbers).toEqual([]);
    for (const id of ids) {
      await map.locator(`[data-map-pin="${id}"]`).tap({ timeout: 5000 });
      await expect(map.locator(`[data-map-pin="${id}"]`)).toHaveAttribute("aria-pressed", "true");
      await expect(map.locator(`[data-map-panel="${id}"]`)).toBeVisible();
      const numberIsInside = await map.locator(`[data-map-pin="${id}"]`).evaluate(el => {
        const number = el.querySelector(".map-pin-number");
        if (!number) return true;
        const badge = number.getBoundingClientRect();
        const board = el.closest("[data-map-board]")!.getBoundingClientRect();
        return badge.bottom <= board.bottom + .5 && badge.top >= board.top - .5;
      });
      expect(numberIsInside, `${id}: number must not be clipped by the map`).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await context.close();
  }
});
