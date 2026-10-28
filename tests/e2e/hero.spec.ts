import { expect, test } from "@playwright/test";

test("home header receives clicks above the media on desktop and mobile", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    if (width === 390) {
      const toggle = page.getByRole("button", { name: "เมนู", exact: true });
      await toggle.click({ timeout: 3000 });
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
    } else {
      await page.locator(".desktop-nav").getByRole("link", { name: "สัตว์", exact: true }).click({ timeout: 3000 });
      await expect(page).toHaveURL(/\/animals\/$/);
    }
  }
});

test("video plays, pauses and respects changes to reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/");
  const video = page.locator("[data-hero-video]");
  const control = page.getByRole("button", { name: "Play video", exact: true });
  await expect(control).toBeVisible();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await control.click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.1);
  await page.getByRole("button", { name: "Pause video", exact: true }).click();
  const stopped = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await expect(video).toHaveJSProperty("paused", true);
  // Verify across several frames, not only immediately after the event.
  await page.evaluate(() => new Promise<void>(resolve => {
    let frames = 0;
    const next = () => ++frames === 12 ? resolve() : requestAnimationFrame(next);
    requestAnimationFrame(next);
  }));
  expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(stopped);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Play video", exact: true }).click();
  await expect(video).toHaveJSProperty("paused", false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(video).toHaveJSProperty("paused", true);
});

test("blocked autoplay preserves a usable play action and media failure preserves the poster", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException("Blocked", "NotAllowedError")); };
  });
  await page.goto("/en/");
  await expect(page.getByRole("button", { name: "Play video", exact: true })).toBeVisible();
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
  await page.getByRole("button", { name: "Play video", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play video", exact: true })).toBeVisible();
  await page.locator("[data-hero-video]").dispatchEvent("error");
  await expect(page.locator("[data-hero-toggle]")).toBeHidden();
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
  await page.locator("[data-hero-actions]").getByRole("link", { name: "Plan your visit" }).click();
  await expect(page).toHaveURL(/\/en\/visit\/$/);
});

test("home remains usable without JavaScript and does not autoplay an uncontrollable loop", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/en/");
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
  await expect(page.locator("video[autoplay]")).toHaveCount(0);
  await expect(page.locator("[data-hero-toggle]")).toBeHidden();
  await page.locator("[data-hero-actions]").getByRole("link", { name: "Plan your visit" }).click();
  await expect(page).toHaveURL(/\/en\/visit\/$/);
  await context.close();
});

test("a failed video request returns to the poster without a misleading pause button", async ({ page }) => {
  await page.route("**/videos/hero-animal.mp4", route => route.abort("failed"));
  await page.goto("/en/");
  await expect(page.locator("[data-hero-toggle]")).toBeHidden();
  await expect(page.locator("[data-hero-media]")).toHaveAttribute("data-ready", "false");
  await expect(page.locator("[data-hero-video]")).toHaveJSProperty("paused", true);
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
});
