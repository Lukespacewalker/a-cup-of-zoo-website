import { expect, test } from "@playwright/test";

test("all food and prices are server rendered with optional menu-book links", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/menu/");
  await expect(page.locator(".menu-books")).toContainText("เลือกชมเมนูพร้อมราคาด้านล่าง");
  await expect(page.locator(".menu-mast")).not.toContainText("ราคาต่อจานเป็นบาท");
  await expect(page.locator("[data-menu-code]")).toHaveCount(47);
  await expect(page.locator('[data-menu-code="B3"]')).toContainText("189 บาท");
  await expect(page.locator('[data-menu-code="R9"]')).toContainText("129 บาท");
  await expect(page.locator('[data-menu-code="R9"]')).toContainText("159 บาท");
  await expect(page.locator('[data-menu-code="R3"]')).toContainText("ไข่ดาว");
  await expect(page.getByText("ไข่กุ้ง 10 กรัม")).toBeVisible();
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema["@type"]).toBe("Menu");
  expect(schema.hasMenuSection.flatMap((section: { hasMenuItem: unknown[] }) => section.hasMenuItem)).toHaveLength(47);
  await page.getByRole("navigation", { name: "หมวดเมนู" }).getByRole("link", { name: "เมนูจากพืช" }).click();
  await expect(page).toHaveURL(/#plant-based$/);
  await expect(page.getByRole("heading", { name: "เมนูจากพืช", exact: true })).toBeInViewport();
  const gallery = page.locator("#plant-based .food-gallery");
  await expect(page.locator("#plant-based .food-section__photos img")).toHaveCount(2);
  await expect(gallery).toBeVisible();
  await expect(page.locator(".food-gallery summary")).toHaveCount(0);
  expect(await gallery.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(requests.some((url) => /heyzine/i.test(url))).toBe(false);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator('a[href*="heyzine"]')).toHaveCount(2);
  await context.close();
});

test("signature dishes have matching photos and prices ahead of the category navigation", async ({ page }) => {
  for (const locale of [
    {
      path: "/menu/",
      names: ["ข้าวแมว", "ข้าวหมา", "ยำนกแก้ว (ยำตะไคร้)"],
      price: "179 บาท",
      browse: "เลือกชมเมนูพร้อมราคาด้านล่าง",
    },
    {
      path: "/en/menu/",
      names: ["Cat Rice", "Dog Rice", "Parrot Salad (Lemongrass Salad)"],
      price: "179 THB",
      browse: "browse the food menu and prices below",
    },
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(locale.path);
    const signature = page.locator("#signature");
    const pictures = signature.getByRole("img");
    await expect(signature.getByRole("heading", { level: 3 })).toHaveText(locale.names);
    await expect(signature.locator(".signature-menu__price")).toHaveText(Array(3).fill(locale.price));
    await expect(signature).not.toContainText(/อาหารสำหรับคน|for people/i);
    await expect(pictures).toHaveCount(3);
    for (const picture of await pictures.all()) {
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(() => picture.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    }
    const positions = () => pictures.evaluateAll((images) =>
      images.map((image) => {
        const { left, top } = image.getBoundingClientRect();
        return { left, top };
      }),
    );
    const stacked = await positions();
    expect(stacked[0].left).toBe(stacked[2].left);
    expect(stacked[2].top).toBeGreaterThan(stacked[0].top);

    const categories = page.locator("#signature + nav#menu-categories");
    await page.getByRole("link", { name: locale.browse }).click();
    await expect(page).toHaveURL(/#menu-categories$/);
    await expect(categories).toBeInViewport();
    await categories.locator('a[href="#signature"]').click();
    await expect(page).toHaveURL(/#signature$/);
    await expect(signature.getByRole("heading", { level: 2 })).toBeInViewport();

    await page.setViewportSize({ width: 1440, height: 900 });
    const sideBySide = await positions();
    expect(sideBySide[0].top).toBe(sideBySide[2].top);
    expect(sideBySide[2].left).toBeGreaterThan(sideBySide[0].left);
  }
});

test("activities explain separate admission, benefits, children and all feeding choices", async ({ page }) => {
  await page.goto("/activities/");
  await expect(page.locator("#passes")).toContainText("ขั้นต่ำ 1 ออร์เดอร์ต่อท่าน");
  await expect(page.locator("#one-zone")).toContainText("249");
  await expect(page.locator("#all-zone")).toContainText("349");
  await expect(page.locator("#one-zone")).toContainText("95 บาท");
  await expect(page.locator("#all-zone")).toContainText("มูลค่า 120 บาท");
  await expect(page.locator(".activity-terms")).toContainText("ต่ำกว่า 100 ซม.");
  await expect(page.locator(".activity-terms")).toContainText("49 บาท");
  await expect(page.locator(".activity-terms")).toContainText("18:00");
  await expect(page.locator("#all-zone [data-activity-gallery] li")).toHaveCount(6);
  await expect(page.locator(".experience-list > li")).toHaveCount(5);
  await expect(page.locator("#basket")).toContainText("80 บาท");
  await expect(page.locator("#basket")).toContainText("โปรโมชัน");
  await expect(page.locator("#basket")).toContainText("ซื้อ All Zone Pass รับตะกร้าอาหารสัตว์ฟรี 1 ชุด");
  await expect(page.locator("#ema")).toContainText("ซื้อ Outdoor หรือ All Zone Pass รับป้ายเอมะฟรี 1 แผ่น");
  await expect(page.locator("#basket")).toContainText("ราคาซื้อแยก");
  await expect(page.locator(".animal-food-list > div")).toHaveCount(7);
  await expect(page.locator("main > .shell > section").last()).toHaveAttribute("id", "experiences");
  await expect(page.locator("#wishing-corner, #garden-spots, .spaces, .arrival")).toHaveCount(0);
  await expect(page.locator('iframe, a[href*="heyzine"]')).toHaveCount(0);
});

test("home and activities show the same four passes with larger photos", async ({ page, request }) => {
  for (const path of ["/", "/en/", "/activities/", "/en/activities/"]) {
    const home = !path.includes("activities");
    const english = path.startsWith("/en/");
    await page.goto(path + "#animal-zones");
    await expect(page.locator("#animal-zones")).toHaveText("Indoor");
    await expect(page.locator("#animal-zones")).toBeInViewport();
    await expect(page.locator(`.activity-pass ${home ? "h3" : "h2"}`)).toHaveText(["Free Zone", "Indoor", "Outdoor", "All Zone Pass"]);
    for (const [id, count] of [["free-zone", 6], ["one-zone", 3], ["outdoor-pass", 3], ["all-zone", 6]] as const) {
      await expect(page.locator(`#${id} [data-activity-photo] img`)).toHaveCount(count);
    }
    const passes = page.locator("#passes");
    await expect(passes.locator("#free-zone")).toContainText(english ? "Free rowing" : "พายเรือฟรี");
    await expect(passes).not.toContainText(english ? "any charges" : "ค่าใช้จ่าย (ถ้ามี)");
    await expect(passes.getByRole("link", { name: "Free Zone", exact: true })).toHaveCount(2);
    await expect(passes.locator(".activity-pass").first()).toHaveCSS("border-top-left-radius", "0px");
    const image = passes.locator(".activity-pass img").first();
    expect((await image.boundingBox())!.width).toBeGreaterThan(75);
    if (home) {
      await expect(passes.locator(".activity-passes-note a")).toHaveAttribute("href", `${english ? "/en" : ""}/activities/#experiences`);
    }
    await expect(page.locator("#outdoor-pass")).toContainText("249");
    const photos = page.locator("#one-zone [data-activity-photo]");
    const first = photos.first();
    const second = photos.nth(1);
    const href = await first.getAttribute("href");
    expect(href).toBeTruthy();
    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");

    await first.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading")).toHaveText((await first.getAttribute("data-caption"))!);
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("heading")).toHaveText((await second.getAttribute("data-caption"))!);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
  }
});

test("menu and activities fit narrow phones and desktop with working category navigation", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/menu/", "/activities/"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
    await page.getByRole("navigation", { name: "หมวดกิจกรรม" }).getByRole("link", { name: "กิจกรรมและราคา" }).click();
    await expect(page).toHaveURL(/#experiences$/);
    await expect(page.getByRole("heading", { name: "กิจกรรมซื้อเพิ่ม" })).toBeInViewport();
  }
});
