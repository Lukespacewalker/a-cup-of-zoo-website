import { expect, test } from "@playwright/test";

test("visit CTA keeps the supplied Maps destination", async ({ page }) => {
  await page.goto("/visit/");
  await expect(page.getByRole("link", { name: "ดูเส้นทาง", exact: true }).first()).toHaveAttribute("href", /!1s0x311d832435d52fff:0xbc56f5d0ec0344ad/);
  await expect(page.locator('a[href="tel:+66989838037"]').first()).toBeVisible();
  await expect(page.locator('a[href="tel:+66922791890"]').first()).toBeVisible();
  await expect(page.locator('footer a[href="tel:+66989838037"]')).toBeVisible();
  await expect(page.locator('footer a[href="tel:+66922791890"]')).toBeVisible();
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("mobile menu opens and Escape closes it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "เมนู" }).click();
  await expect(page.getByRole("navigation", { name: "มือถือ" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "มือถือ" })).toBeHidden();
});

test("theme control responds to keyboard activation and persists after navigation", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("cup-theme", "light"));
  await page.reload();
  const theme = page.getByRole("button", { name: "โหมดสว่าง", exact: true });
  await theme.focus();
  const lightBackground = await page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "โหมดมืด", exact: true })).toBeVisible();
  expect(await page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor)).not.toBe(lightBackground);
  await page.goto("/animals/");
  await expect(page.getByRole("button", { name: "โหมดมืด", exact: true })).toBeVisible();
});

test("photo journal supports visible keyboard focus and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "พบเจ้าเหมียวและเพื่อนสัตว์", exact: true }).focus();
  await page.keyboard.press("Tab");
  const friends = page.getByRole("link", { name: "พบเพื่อนริมบ่อและสัตว์อื่น ๆ", exact: true });
  await expect(friends).toBeFocused();
  expect(await friends.evaluate((link) => link.matches(":focus-visible") && getComputedStyle(link).outlineStyle !== "none")).toBe(true);
  expect(await friends.evaluate((link) => getComputedStyle(link).transitionDuration)).toBe("0s");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/animals\/$/);
});
