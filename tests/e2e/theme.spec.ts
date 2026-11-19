import { expect, test } from "@playwright/test";

test("home actions and mobile navigation reach the menu and visit pages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const actions = page.locator("[data-hero-actions]");
  await expect(actions.getByRole("link", { name: "สำรวจประสบการณ์" })).toBeInViewport();
  await expect(actions.getByRole("link", { name: "วางแผนมาเที่ยว" })).toBeInViewport();
  await actions.getByRole("link", { name: "สำรวจประสบการณ์" }).click();
  await page.locator('.experience-paths a[href="/cafe/"]').click();
  await page.getByRole("navigation", { name: "หน้าคาเฟ่และเมนู" }).getByRole("link", { name: "อาหาร", exact: true }).click();
  await expect(page.locator("[data-menu-code]")).toHaveCount(47);
  const toggle = page.getByRole("button", { name: "เมนู", exact: true });
  await toggle.click();
  await expect(page.locator("#site-nav:popover-open a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#site-nav:popover-open")).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("navigation", { name: "หลัก" }).getByRole("link", { name: "เวลาทำการ/แผนที่" }).click();
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
      for (const path of ["/", "/animals/", "/activities/", "/cafe/food/", "/visit/", "/news/"]) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), `${path} ${theme} ${width}`).toBe(true);
      }
    }
  }
});

test("theme follows the system without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: "dark" });
  try {
    const page = await context.newPage();
    await page.goto("/en/cafe/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "auto");
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(245, 241, 232)");
  } finally {
    await context.close();
  }
});

test("live tabs share the selected theme and return to their system preference", async ({ context, page }) => {
  const other = await context.newPage();
  await page.emulateMedia({ colorScheme: "light" });
  await other.emulateMedia({ colorScheme: "dark" });
  await Promise.all([page.goto("/cafe/"), other.goto("/en/cafe/")]);

  await page.getByRole("button", { name: "โหมดสีตามเครื่อง" }).click();
  await expect(other.getByRole("button", { name: "Light colour theme" })).toBeVisible();
  await expect(other.locator("html")).toHaveCSS("color-scheme", "light");
  await other.getByRole("button", { name: "Light colour theme" }).click();
  await expect(page.getByRole("button", { name: "โหมดมืด" })).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await other.reload();
  await expect(other.getByRole("button", { name: "Dark colour theme" })).toBeVisible();
  await other.getByRole("button", { name: "Dark colour theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "auto");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light dark");
  await expect(other.locator("html")).toHaveCSS("color-scheme", "dark");
});
