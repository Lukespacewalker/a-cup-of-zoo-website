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
  const panel = page.locator("#mobile-nav");
  const middleStroke = toggle.locator("path").nth(1);
  const transitions = await page.evaluateHandle(() => {
    const properties: string[] = [];
    document.addEventListener("transitionrun", (event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.matches("#mobile-nav, .menu-button path")
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
  await expect(panel).toHaveJSProperty("inert", true);
  await expect(toggle).toBeFocused();
  await expect(panel).toBeHidden();
  await expect(middleStroke).toHaveCSS("opacity", "1");
  expect((await transitions.jsonValue()).slice(opening.length)).toEqual(
    animatedProperties,
  );

  await toggle.click();
  await page.setViewportSize({ width: 1051, height: 768 });
  await expect(panel).toBeHidden();
  await expect(page.locator(".desktop-nav")).toBeVisible();
  await expect(page.locator("body")).not.toHaveClass(/menu-open/);
  await page.setViewportSize({ width: 1050, height: 768 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
});

test("mobile menu opens and closes immediately with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "เมนู", exact: true });
  const panel = page.locator("#mobile-nav");
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
