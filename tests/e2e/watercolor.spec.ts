import { expect, test } from "@playwright/test";

test("the home wishing corner and ema details keep their section when switching languages", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/#wishes");
  await expect(page.locator("#wishes")).toContainText("Nine-Tailed Fox");
  await page.getByRole("link", { name: "TH (Thai)", exact: true }).click();
  await expect(page).toHaveURL(/\/#wishes$/);
  await expect(page.locator("#wishes")).toContainText("น้องจิ้งจอกเก้าหาง");
  await page.getByRole("link", { name: "ดูราคาและสิทธิรับป้ายเอมะ" }).click();
  await expect(page).toHaveURL(/\/activities\/#ema$/);
  await expect(page.locator("#ema")).toContainText("รับป้ายเอมะฟรี 1 แผ่น");
  await expect(page.locator("#wishing-corner")).toHaveCount(0);
  await page.getByRole("navigation", { name: "หมวดกิจกรรม" }).getByRole("link", { name: "แพ็กเกจและเงื่อนไข" }).click();
  await expect(page.locator("#passes-title")).toBeInViewport();
  await expect(page.locator(".activity-terms")).toContainText("100 ซม.");
});
