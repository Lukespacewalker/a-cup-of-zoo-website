import { expect, test } from "@playwright/test";

test("English unknown routes return localized404 with an English home link", async ({ page }) => {
  for (const route of ['/en/not-a-page/', '/en/news/']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    const text = await page.locator('main, title, meta[content], [aria-label], [alt]').evaluateAll(elements => elements.map(element => element.getAttribute('content') ?? element.getAttribute('aria-label') ?? element.getAttribute('alt') ?? element.textContent).join(' '));
    expect(text).not.toMatch(/[\u0E00-\u0E7F]/);
    await expect(page.locator('main').getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/en/');
    await expect(page.getByRole('link', { name: 'Thai home', exact: true })).toHaveAttribute('href', '/');
  }
  await page.locator('main').getByRole('link', { name: 'Back to home' }).click();
  await expect(page).toHaveURL(/\/en\/$/);
});

test("English primary paths render complete English content and matching metadata", async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  for (const route of ["/en/", "/en/animals/", "/en/cafe/", "/en/cafe/food/", "/en/cafe/drinks/", "/en/activities/", "/en/visit/"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag']).toContain('noindex');
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    if (route.startsWith("/en/cafe/")) {
      await expect(page.locator('#site-nav a[href="/en/cafe/"]')).toHaveAttribute(
        "aria-current",
        route === "/en/cafe/" ? "page" : "true",
      );
    }
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await page.locator("body").innerText()).not.toMatch(/[\u0E00-\u0E7F]/);
    const labels = await page.locator('[alt], [aria-label]').evaluateAll(elements => elements.flatMap(element => [element.getAttribute('alt'), element.getAttribute('aria-label')]).join(' '));
    expect(labels).not.toMatch(/[\u0E00-\u0E7F]/);
    const metadata = await page.locator('title, meta[content]').evaluateAll(elements => elements.map(element => element.getAttribute('content') ?? element.textContent).join(' '));
    expect(metadata).not.toMatch(/[\u0E00-\u0E7F]/);
    await expect(page.locator('link[hreflang="th"]')).toHaveAttribute("href", `${origin}${route.slice(3)}`);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", `${origin}${route}`);
    expect(await page.getByRole('link', { name: 'Thai', exact: true }).evaluate((link: HTMLAnchorElement) => link.href))
      .toBe(`${origin}${route.slice(3)}`);
  }
  await page.goto("/en/cafe/food/");
  await expect(page.locator('[data-menu-code]')).toHaveCount(47);
  await expect(page.locator('[data-menu-code="SIG1"]')).toContainText("179");
  await expect(page.locator('[data-menu-code="R9"]')).toContainText("159");
  await expect(page.locator('.sandwich-extras')).toContainText("10 g");
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema.inLanguage).toBe("en");
  expect(schema.hasMenuSection.flatMap((section: {hasMenuItem: unknown[]}) => section.hasMenuItem)).toHaveLength(47);
  await page.goto("/en/activities/");
  await expect(page.locator('#one-zone')).toContainText("249");
  await expect(page.locator('#all-zone')).toContainText("349");
  await expect(page.locator('.activity-terms')).toContainText("100 cm");
  await expect(page.locator('.activity-terms')).toContainText("49");
  await expect(page.locator('.activity-terms')).toContainText("18:00");
});

test("untranslated news explicitly returns to English home without false alternates", async ({ page }) => {
  await page.goto('/news/');
  await expect(page.locator('link[hreflang]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'English home', exact: true })).toHaveAttribute('href', '/en/');
  await page.getByRole('link', { name: 'English home', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  const response = await page.goto('/en/news/');
  expect(response?.status()).toBe(404);
});

test("English menu and child planning work without JavaScript and match Thai numeric content", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  for (const [route, selectors] of [
    ['cafe/food', ['[data-menu-code]', '.sandwich-extras']],
    ['activities', ['#passes', '.experience-list', '.animal-food-list']],
    ['visit', ['.hours', '.band']]
  ] as const) {
    const digits: string[][] = [];
    for (const prefix of ['', '/en']) {
      await page.goto(`${prefix}/${route}/`);
      digits.push(await page.locator(selectors.join(',')).evaluateAll(elements => elements.flatMap(element => (element.textContent ?? '').match(/\d+/g) ?? [])));
    }
    expect(digits[1]).toEqual(digits[0]);
  }
  await page.goto('/en/cafe/food/');
  await page.getByRole('navigation', { name: 'Menu categories' }).getByRole('link', { name: 'Plant-based dishes' }).click();
  await expect(page.getByRole('heading', { name: 'Plant-based dishes', exact: true })).toBeInViewport();
  await expect(page.locator('#plant-based .food-section__photos img')).toHaveCount(2);
  await expect(page.locator('#plant-based .food-gallery')).toBeVisible();
  await page.getByRole('navigation', { name: 'Visit shortcuts' }).getByRole('link', { name: 'Plan your visit' }).click();
  await page.getByRole('link', { name: 'Pass benefits and child admission' }).click();
  await expect(page.locator('.activity-terms')).toContainText('Every child must be accompanied by at least 1 adult');
  await context.close();
});

test("legacy menu URLs permanently redirect to the matching café page", async ({ request }) => {
  for (const prefix of ["", "/en"]) {
    for (const [legacy, section] of [["menu", "food"], ["drinks", "drinks"]]) {
      const query = "?utm_source=old-menu";
      const response = await request.get(`${prefix}/${legacy}/${query}`, {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(`${prefix}/cafe/${section}/${query}`);
    }
  }
});

test("switching locale retains matching page and category hash on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/menu/?utm_source=old-menu#plant-based");
  await expect(page).toHaveURL("/cafe/food/?utm_source=old-menu#plant-based");
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/cafe\/food\/#plant-based$/);
  await page.getByRole('heading', { name: 'Plant-based dishes', exact: true }).scrollIntoViewIfNeeded();
  const gallery = page.locator('#plant-based .food-gallery');
  await expect(gallery).toBeVisible();
  await page.getByRole('link', { name: 'Thai', exact: true }).click();
  await expect(page).toHaveURL(/\/cafe\/food\/#plant-based$/);
  await page.goto('/en/');
  await page.locator('.experience-paths a[href="/en/cafe/"]').click();
  await page.getByRole("navigation", { name: "Café and menus" }).getByRole("link", { name: "Food", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/cafe\/food\/$/);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Hours & directions' }).click();
  await expect(page).toHaveURL(/\/en\/visit\/$/);
  await page.getByRole('link', { name: 'Pass benefits and child admission' }).click();
  await expect(page).toHaveURL(/\/en\/activities\/#passes$/);
  await expect(page.getByRole('link', { name: 'News (Thai)', exact: true }).first()).toHaveAttribute('href', '/news/');
});
