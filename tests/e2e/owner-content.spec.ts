import { expect, test } from "@playwright/test";

test("owner content is bilingual, discoverable, and fits phones", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const prefix of ["", "/en"]) {
      for (const route of ["/events/", "/club/"]) {
        const response = await page.goto(prefix + route);
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
        const alternate = (prefix ? "" : "/en") + route;
        expect(await page.locator(".language-switch").evaluate((link: HTMLAnchorElement) => new URL(link.href).pathname)).toBe(alternate);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
        await page.locator(".language-switch").click();
        expect(new URL(page.url()).pathname).toBe(alternate);
        await page.locator(".language-switch").click();
      }
      await expect(page.locator("[data-member-tier]")).toHaveCount(5);
      await expect(page.locator(".club-rewards li")).toHaveCount(7);
      await expect(page.locator(".partner-list li")).toHaveCount(6);
      await expect(page.locator("#membership-terms")).toContainText("500");
      await page.locator(`.footer-nav a[href="${prefix}/events/"]`).click();
      await expect(page.locator("#collaborations")).toBeVisible();
    }
  }
});

test("map and every place link remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/activities/#garden");
  const map = page.locator("[data-shop-map]");
  await expect(map.locator(".shop-map-illustration")).toBeVisible();
  await expect(map.locator(".map-static-stops a")).toHaveCount(19);
  await expect(map.locator(".map-detail")).toHaveCount(0);
  await expect(page.locator("#free-zone")).toContainText("1 ออร์เดอร์ต่อคน");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await map.locator('.map-static-stops a[href="/activities/#wishing-corner"]').focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/activities\/#wishing-corner$/);
  await page.goto("/animals/");
  await expect(page.locator("[data-resident]")).toHaveCount(23);
  await expect(page.locator("#animal-family")).toContainText("มีตังค์");
  await context.close();
});

test("menu books use the exact owner links and never embed the viewer", async ({ page }) => {
  await page.goto("/en/menu/");
  await expect(page.locator(".menu-books a")).toHaveCount(2);
  await expect(page.locator(".menu-books a").nth(0)).toHaveAttribute("href", "https://heyzine.com/flip-book/72a5470ad6.html");
  await expect(page.locator(".menu-books a").nth(1)).toHaveAttribute("href", "https://heyzine.com/flip-book/587e5387cd.html");
  await expect(page.locator("[data-menu-code]")).toHaveCount(47);
  await expect(page.locator("iframe")).toHaveCount(0);
});
