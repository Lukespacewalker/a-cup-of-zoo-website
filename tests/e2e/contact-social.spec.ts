import { expect, test } from "@playwright/test";

test("contact details and owner social profiles stay usable in both languages and on phones", async ({ page }) => {
  const profiles = ["https://www.facebook.com/Acupofzoocafe/", "https://www.instagram.com/acupofzoo/", "https://www.tiktok.com/@acupofzoo"];
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/en/"]) {
      await page.goto(path);
      const footer = page.locator("footer");
      await footer.scrollIntoViewIfNeeded();
      await expect(footer.locator("address")).toContainText("27/8");
      await expect(footer.locator("address")).toContainText("12120");
      for (const number of ["+66989838037", "+66922791890"]) await expect(footer.locator(`a[href="tel:${number}"]`)).toBeVisible();
      for (const href of profiles) {
        const link = footer.locator(`a[href="${href}"]`);
        await expect(link).toBeVisible();
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        await link.focus();
        await expect(link).toBeFocused();
        await expect(page.locator(`.home-follow a[href="${href}"]`)).toHaveCount(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    }
  }
});
