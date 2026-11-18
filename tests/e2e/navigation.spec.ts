import { expect, test } from "@playwright/test";

const routes = ["/", "/animals/", "/activities/", "/menu/", "/visit/", "/news/"];

test("main routes render server HTML", async ({ request }) => {
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("A Cup of Zoo");
    expect(html).toContain("<h1");
  }
});

test("tablet menu animates in both directions and resets at the desktop breakpoint", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/");
  const toggle = page.locator(".menu-button");
  const panel = page.locator("#site-nav");
  const middleStroke = toggle.locator("path").nth(1);
  const transitions = await page.evaluateHandle(() => {
    const properties: string[] = [];
    document.addEventListener("transitionrun", (event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.matches("#site-nav, .menu-button path")
      ) {
        properties.push(`${target.localName}:${event.propertyName}`);
      }
    });
    return properties;
  });
  const animatedProperties = expect.arrayContaining([
    "nav:opacity",
    "nav:transform",
    "path:opacity",
    "path:transform",
  ]);
  const supportsOverlayTransition = await page.evaluate(() => CSS.supports("overlay", "auto"));

  await expect(toggle).toHaveCSS("border-top-left-radius", "3px");
  await expect(toggle).toHaveAccessibleName("Open navigation");
  await expect(panel).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAccessibleName("Close navigation");
  await expect(panel.getByRole("link").first()).toBeFocused();
  await expect(panel).toHaveCSS("opacity", "1");
  await expect(middleStroke).toHaveCSS("opacity", "0");
  const opening = await transitions.jsonValue();
  expect(opening).toEqual(animatedProperties);

  await page.keyboard.press("Escape");
  await expect(page.locator("#site-nav:popover-open")).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await expect(panel).toBeHidden();
  await expect(middleStroke).toHaveCSS("opacity", "1");
  expect((await transitions.jsonValue()).slice(opening.length)).toEqual(
    supportsOverlayTransition ? animatedProperties : expect.arrayContaining(["path:opacity", "path:transform"]),
  );

  await toggle.click();
  await page.setViewportSize({ width: 1051, height: 768 });
  await expect(panel).toBeVisible();
  await expect(panel).not.toHaveAttribute("popover");
  await expect(toggle).toBeHidden();
  await page.setViewportSize({ width: 1050, height: 768 });
  await expect(toggle).toHaveAccessibleName("Open navigation");
  await expect(panel).toBeHidden();
});

test("mobile menu opens and closes immediately with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "เมนู", exact: true });
  const panel = page.locator("#site-nav");
  await expect(panel).toHaveCSS("transition-duration", "0s");
  await expect(toggle.locator("path").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(panel.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("mobile menu releases focus in both directions on short screens", async ({ page }) => {
  for (const viewport of [{ width: 390, height: 500 }, { width: 700, height: 320 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/en/cafe/");
    const toggle = page.getByRole("button", { name: "Open navigation" });
    const panel = page.locator("#site-nav");
    await toggle.focus();
    await page.keyboard.press("Enter");
    const links = await panel.getByRole("link").all();
    expect(links).toHaveLength(8);
    for (const link of links) {
      await expect(link).toBeFocused();
      await expect(link).toBeInViewport({ ratio: 1 });
      await page.keyboard.press("Tab");
    }
    await expect(page.getByRole("link", { name: "See the signature dishes" })).toBeFocused();
    await expect(panel).toBeHidden();

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(links[0]).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator(".menu-button")).toBeFocused();
    await expect(panel).toBeHidden();
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "System colour theme" })).toBeFocused();
  }
});

test("mobile header fits both languages at 200% default text size", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 650 });
    for (const path of ["/cafe/", "/en/cafe/", "/news/"]) {
      await page.goto(path);
      await page.addStyleTag({ content: ":root { font-size: 32px; }" });
      await page.evaluate(() => document.fonts.ready);
      const controls = page.locator(".header-tools").locator("a, button");
      await expect(controls).toHaveCount(3);
      for (const control of await controls.all()) {
        await expect(control).toBeInViewport({ ratio: 1 });
      }
      await controls.last().click();
      await expect(page.locator("#site-nav a").first()).toBeFocused();
    }
  }
});

test("header navigation opens and follows links without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 500 },
  });
  try {
    const page = await context.newPage();
    await page.route("**/maps?**", route => route.abort());
    for (const prefix of ["", "/en"]) {
      for (const destination of ["animals", "activities", "visit"]) {
        await page.goto(`${prefix}/cafe/`, { waitUntil: "domcontentloaded" });
        const nav = page.locator("#site-nav");
        await expect(nav).toBeHidden();
        await page.locator(".menu-button").click();
        await expect(nav.getByRole("link")).toHaveCount(8);
        await nav.locator(`a[href="${prefix}/${destination}/"]`).click();
        await expect(page).toHaveURL(`${prefix}/${destination}/`);
      }
    }
    await page.setViewportSize({ width: 1051, height: 768 });
    const nav = page.locator("#site-nav");
    await expect(nav).toBeVisible();
    await expect(nav).toHaveCSS("position", "static");
    await expect(page.locator(".menu-button")).toBeHidden();
  } finally {
    await context.close();
  }
});

test("header and page width are continuous around the shortcut bar breakpoint", async ({ page }) => {
  await page.goto("/en/cafe/");
  let previous: number | undefined;
  for (let width = 840; width <= 880; width++) {
    await page.setViewportSize({ width, height: 800 });
    const widths = await page.evaluate(() =>
      [".site-header", ".shell"].map(selector => document.querySelector(selector)!.getBoundingClientRect().width)
    );
    expect(widths[0]).toBeCloseTo(widths[1], 1);
    if (previous !== undefined) {
      expect(widths[0] - previous).toBeGreaterThanOrEqual(0);
      expect(widths[0] - previous).toBeLessThanOrEqual(1.1);
    }
    previous = widths[0];
    if (width === 860) await expect(page.locator(".sticky-cta")).toBeVisible();
    if (width === 861) await expect(page.locator(".sticky-cta")).toBeHidden();
  }
});

test.describe("touch navigation", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test("tapping a menu link follows it after focus leaves the first link", async ({ page }) => {
    await page.goto("/en/cafe/");
    await page.locator(".menu-button").tap();
    const nav = page.locator("#site-nav");
    await expect(nav.getByRole("link").first()).toBeFocused();
    await nav.getByRole("link", { name: "Animal friends" }).tap();
    await expect(page).toHaveURL("/en/animals/");
  });
});
