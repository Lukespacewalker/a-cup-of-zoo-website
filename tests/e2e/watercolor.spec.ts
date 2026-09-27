import { expect, test } from "@playwright/test";

test("wishing corner is discoverable and keeps its section when switching languages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/");
  await page.getByRole("link", { name: "Discover the wishing corner" }).click({ timeout: 2500 });
  await expect(page).toHaveURL(/\/en\/activities\/#wishing-corner$/);
  await expect(page.locator("#wishing-corner")).toContainText("Nine-Tailed Fox");
  await page.getByRole("link", { name: "Thai", exact: true }).click();
  await expect(page).toHaveURL(/\/activities\/#wishing-corner$/);
  await expect(page.locator("#wishing-corner")).toContainText("น้องจิ้งจอกเก้าหาง");
  await page.getByRole("navigation", { name: "หมวดกิจกรรม" }).getByRole("link", { name: "แพ็กเกจและเงื่อนไข" }).click();
  await expect(page.locator("#passes h2")).toBeInViewport();
  await expect(page.locator(".activity-terms")).toContainText("100 ซม.");
});
