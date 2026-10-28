import { expect, test } from "@playwright/test";

test("all food and prices are server rendered with optional menu-book links", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/menu/");
  await expect(page.locator("[data-menu-code]")).toHaveCount(47);
  await expect(page.locator('[data-menu-code="B3"]')).toContainText("189 บาท");
  await expect(page.locator('[data-menu-code="R9"]')).toContainText("129 บาท");
  await expect(page.locator('[data-menu-code="R9"]')).toContainText("159 บาท");
  await expect(page.locator('[data-menu-code="R3"]')).toContainText("ไข่ดาว");
  await expect(page.getByText("ไข่กุ้ง 10 กรัม")).toBeVisible();
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema["@type"]).toBe("Menu");
  expect(schema.hasMenuSection.flatMap((section: { hasMenuItem: unknown[] }) => section.hasMenuItem)).toHaveLength(47);
  await page.getByRole("navigation", { name: "หมวดเมนู" }).getByRole("link", { name: "เมนูจากพืช" }).click();
  await expect(page).toHaveURL(/#plant-based$/);
  await expect(page.getByRole("heading", { name: "เมนูจากพืช", exact: true })).toBeInViewport();
  const gallery = page.locator("#plant-based .food-gallery");
  await expect(page.locator("#plant-based .food-section__photos img")).toHaveCount(2);
  await expect(gallery).toBeVisible();
  await expect(page.locator(".food-gallery summary")).toHaveCount(0);
  expect(await gallery.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(requests.some((url) => /heyzine/i.test(url))).toBe(false);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator('a[href*="heyzine"]')).toHaveCount(2);
  await context.close();
});

test("activities explain separate admission, benefits, children and all feeding choices", async ({ page }) => {
  await page.goto("/activities/");
  await expect(page.locator("#passes")).toContainText("ขั้นต่ำ 1 ออร์เดอร์ต่อคน");
  await expect(page.locator("#one-zone")).toContainText("249");
  await expect(page.locator("#all-zone")).toContainText("349");
  await expect(page.locator("#one-zone")).toContainText("95 บาท");
  await expect(page.locator("#all-zone")).toContainText("มูลค่า 120 บาท");
  await expect(page.locator(".activity-terms")).toContainText("ต่ำกว่า 100 ซม.");
  await expect(page.locator(".activity-terms")).toContainText("49 บาท");
  await expect(page.locator(".activity-terms")).toContainText("18:00");
  await expect(page.locator("#animal-zones li")).toHaveCount(6);
  await expect(page.locator(".experience-list > li")).toHaveCount(5);
  await expect(page.locator("#basket")).toContainText("80 บาท");
  await expect(page.locator("#basket")).toContainText("โปรโมชัน");
  await expect(page.locator(".animal-food-list > div")).toHaveCount(7);
  await expect(page.locator(".garden-spots > li")).toHaveCount(15);
  await expect(page.locator('iframe, a[href*="heyzine"]')).toHaveCount(0);
});

test("menu and activities fit narrow phones and desktop with working category navigation", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/menu/", "/activities/"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
    await page.getByRole("navigation", { name: "หมวดกิจกรรม" }).getByRole("link", { name: "กิจกรรมและราคา" }).click();
    await expect(page).toHaveURL(/#experiences$/);
    await expect(page.getByRole("heading", { name: "กิจกรรมที่ชวนทำด้วยกัน" })).toBeInViewport();
  }
});
