import { expect, test } from "@playwright/test";

test("home experiences preserve locale and mobile shortcuts do not duplicate the hero", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const prefix of ["", "/en"]) {
    await page.goto(`${prefix}/`);
    const actions = page.locator("[data-hero-actions]");
    await actions.scrollIntoViewIfNeeded();
    await expect(page.locator(".sticky-cta")).toBeHidden();
    await actions.locator('a[href="#experiences"]').click();
    await expect(page.locator("#experiences")).toBeInViewport();
    await expect(page.locator(".sticky-cta")).toBeVisible();
    const experiences = page.locator(".experience-paths");
    await expect(experiences.locator(`a[href="${prefix}/menu/"]`)).toHaveCount(1);
    await expect(experiences.locator(`a[href="${prefix}/animals/"]`)).toHaveCount(1);
    await expect(experiences.locator(`a[href="${prefix}/activities/"]`)).toHaveCount(1);
    await page.locator("[data-cat-room-link]").click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/animals/#cat-room$`));
    await page.locator("#cat-room").getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/activities/#animal-zones$`));
    await page.goto(`${prefix}/`);
    await actions.scrollIntoViewIfNeeded();
    await expect(page.locator(".sticky-cta")).toBeHidden();
  }
});
