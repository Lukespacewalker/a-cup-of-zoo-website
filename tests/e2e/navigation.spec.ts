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
