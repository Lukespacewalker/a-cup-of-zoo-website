import { expect, test } from "@playwright/test";

test("home actions and mobile navigation reach the menu and visit pages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const actions = page.locator("[data-hero-actions]");
  await expect(actions.getByRole("link", { name: "สำรวจประสบการณ์" })).toBeInViewport();
  await expect(actions.getByRole("link", { name: "วางแผนมาเที่ยว" })).toBeInViewport();
  await actions.getByRole("link", { name: "สำรวจประสบการณ์" }).click();
  await page.locator('.experience-paths a[href="/menu/"]').click();
  await expect(page.locator("[data-menu-code]")).toHaveCount(47);
  const toggle = page.getByRole("button", { name: "เมนู", exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-nav a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("navigation", { name: "มือถือ" }).getByRole("link", { name: "มาเที่ยว" }).click();
  await expect(page).toHaveURL(/\/visit\/$/);
});

test("color control persists and auto follows the system preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "โหมดสีตามเครื่อง" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "โหมดสว่าง" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const darkBackground = await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor);
  await page.reload();
  await expect(page.getByRole("button", { name: "โหมดมืด" })).toBeVisible();
  await page.getByRole("button", { name: "โหมดมืด" }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  expect(await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor)).toBe(darkBackground);
  await page.emulateMedia({ colorScheme: "light" });
  expect(await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(darkBackground);
});

test("all primary pages fit supported widths in light, dark and automatic themes", async ({ page }) => {
  test.setTimeout(120000);
  for (const theme of ["light", "dark", "auto"] as const) {
    await page.emulateMedia({ colorScheme: theme === "auto" ? "dark" : "light" });
    await page.addInitScript(value => localStorage.setItem("cup-theme", value), theme);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/animals/", "/activities/", "/menu/", "/visit/", "/news/"]) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${path} ${theme} ${width}`).toBe(true);
      }
    }
  }
});
