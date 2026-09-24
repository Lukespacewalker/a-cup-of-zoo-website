import { expect, test } from "@playwright/test";

test("visit CTA keeps the supplied Maps destination", async ({ page }) => {
  await page.goto("/visit/");
  await expect(page.getByRole("link", { name: "ดูเส้นทาง", exact: true }).first()).toHaveAttribute("href", "https://maps.app.goo.gl/A6AVc2ScgEJwSrbVA");
  await expect(page.locator('a[href="tel:+66989838037"]').first()).toBeVisible();
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
