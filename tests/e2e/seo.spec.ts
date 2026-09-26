import { expect, test } from "@playwright/test";

test("prototype stays noindex", async ({ page }) => {
  const response = await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("preview keeps crawlers out and its sitemap empty", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("<loc>");
});

test("public pages have distinct metadata and usable social images", async ({ page, request }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of ["/", "/animals/", "/activities/", "/menu/", "/visit/", "/news/"]) {
    await page.goto(`${path}?utm_source=seo-check`);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(title.length).toBeGreaterThan(10);
    expect(description?.length).toBeGreaterThan(20);
    titles.add(title);
    descriptions.add(description!);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "th_TH");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", new URL(path, page.url()).href);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", /^[1-9]\d*$/);
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", /^[1-9]\d*$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toMatch(/^https?:\/\//);
    expect(image).not.toContain(".invalid");
    const imageResponse = await request.get(image!);
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()["content-type"]).toMatch(/^image\//);
  }
  expect(titles.size).toBe(6);
  expect(descriptions.size).toBe(6);
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
