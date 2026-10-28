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

test("club tiers keep their artwork, coupon separators and added benefits in both languages", async ({ page }) => {
  const tiers = ["Friend", "Buddy", "Besties", "Soulmate", "Family"];
  const highlightedRows = [0, 2, 3, 3, 2];
  const copy = {
    th: [
      { guest: "—", coupons: ["—"], additions: [] },
      { guest: "1 ครั้ง", coupons: ["อาหารสัตว์"], additions: ["1 ครั้ง", "อาหารสัตว์"] },
      { guest: "1 ครั้ง", coupons: ["อาหารสัตว์", "+ ตะกร้าอาหารสัตว์"], additions: ["5%", "ตะกร้าอาหารสัตว์", "+ ของที่ระลึก"] },
      { guest: "เดือนละ 1 ครั้ง", coupons: ["อาหารสัตว์", "+ ตะกร้าอาหารสัตว์", "+ เครื่องดื่ม 1 ฟรี 1"], additions: ["10%", "เดือนละ 1 ครั้ง", "เครื่องดื่ม 1 ฟรี 1"] },
      { guest: "เดือนละ 1 ครั้ง", coupons: ["อาหารสัตว์", "+ ตะกร้าอาหารสัตว์", "+ เครื่องดื่ม 1 ฟรี 1", "+ ของที่ระลึกปีใหม่"], additions: ["15%", "ของที่ระลึกปีใหม่"] },
    ],
    en: [
      { guest: "—", coupons: ["—"], additions: [] },
      { guest: "Once", coupons: ["Animal food"], additions: ["Once", "Animal food"] },
      { guest: "Once", coupons: ["Animal food", "+ food basket"], additions: ["5%", "food basket", "+ souvenir"] },
      { guest: "Once a month", coupons: ["Animal food", "+ food basket", "+ buy-one-get-one drink"], additions: ["10%", "Once a month", "buy-one-get-one drink"] },
      { guest: "Once a month", coupons: ["Animal food", "+ food basket", "+ buy-one-get-one drink", "+ New Year souvenir"], additions: ["15%", "New Year souvenir"] },
    ],
  };
  for (const locale of ["th", "en"] as const) {
    await page.goto(locale === "th" ? "/club/" : "/en/club/");
    await expect(page.locator(".tier-heading h3")).toHaveText(tiers);
    for (const [index, name] of tiers.entries()) {
      const tier = page.locator(`[data-member-tier="${name}"]`);
      const benefits = tier.locator(".tier-benefits > div");
      await expect(tier.locator(".tier-artwork")).toHaveAttribute("src", new RegExp(`${name.toLowerCase()}\\.`));
      await expect(tier.locator(".tier-benefit--new")).toHaveCount(highlightedRows[index]);
      await expect(benefits.nth(1).locator("dd")).toHaveText(copy[locale][index].guest);
      await expect(benefits.nth(2).locator(".tier-coupon")).toHaveText(copy[locale][index].coupons);
      await expect(tier.locator(".tier-benefit__addition")).toHaveText(copy[locale][index].additions);
      await expect(benefits.nth(3).locator(".tier-coupon")).toHaveCount(index >= 2 ? 1 : 0);
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
