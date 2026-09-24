import { expect, test } from "@playwright/test";

test("prototype stays noindex", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("unknown route is a real 404", async ({ request }) => {
  const response = await request.get("/this-route-does-not-exist/");
  expect(response.status()).toBe(404);
});

test("unverified review score is not invented", async ({ page }) => {
  await page.goto("/visit/");
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  const text = jsonLd.join("\n");
  expect(text).not.toContain("aggregateRating");
  expect(text).not.toContain("priceRange");
});

test("news empty state is not an error", async ({ page }) => {
  await page.goto("/news/");
  await expect(page.getByText("ยังไม่มีข่าวที่เผยแพร่")).toBeVisible();
});
