import { expect, test } from "@playwright/test";

test("the café shows signature dishes and shop photos before visitors choose a menu", async ({ page }) => {
  for (const [prefix, width] of [["", 390], ["/en", 1440]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${prefix}/`);
    if (!prefix) await page.getByRole("button", { name: "เมนู", exact: true }).click();
    const siteNav = page.locator("#site-nav");
    await siteNav.getByRole("link", { name: prefix ? "Café" : "คาเฟ่", exact: true }).click();
    await expect(page).toHaveURL(`${prefix}/cafe/`);
    const hero = page.locator("#cafe-top");
    await expect(hero.locator("h1")).toHaveText(prefix ? "Café & restaurant" : "คาเฟ่และร้านอาหาร");
    await expect(page.locator("#signature [data-menu-code]")).toHaveCount(3);
    const books = page.locator(".cafe-books");
    await expect(books.locator('a[href*="heyzine"]')).toHaveCount(2);
    const stories = page.locator(".cafe-space");
    await expect(stories).toHaveCount(3);
    await expect(stories.locator("h3")).toHaveCount(3);
    await expect(stories.locator("p")).toHaveCount(3);
    const gallery = page.locator(".cafe-gallery img");
    await expect(gallery).toHaveCount(4);
    const sectionOrder = await page.locator("#signature, .cafe-books, .cafe-spaces, .cafe-gallery").evaluateAll(
      (sections) => sections.map((section) => section.id || section.className),
    );
    expect(sectionOrder).toEqual(["signature", "cafe-books", "cafe-spaces", "cafe-gallery"]);
    for (const image of [hero.locator("img"), ...(await stories.locator("img").all()), ...(await gallery.all())]) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }

    const tabs = page.locator(".cafe-nav");
    await expect(tabs.getByRole("link")).toHaveText(prefix ? ["Café", "Food", "Drinks"] : ["คาเฟ่", "อาหาร", "เครื่องดื่ม"]);
    for (const path of ["/cafe/drinks/", "/cafe/food/", "/cafe/"]) {
      const destination = `${prefix}${path}`;
      const tab = tabs.locator(`a[href="${destination}"]`);
      await tab.click();
      await expect(page).toHaveURL(destination);
      await expect(tab).toHaveAttribute("aria-current", "page");
    }
  }
});

test("all food and prices are server rendered with optional menu-book links", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/cafe/food/");
  await expect(page.getByRole("heading", { name: "เมนูอาหาร", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "เลือกหมวดอาหาร" })).toHaveAttribute("href", "#menu-categories");
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
  await gallery.locator("img").scrollIntoViewIfNeeded();
  await expect.poll(() => gallery.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  expect(requests.some((url) => /heyzine/i.test(url))).toBe(false);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator('a[href*="heyzine"]')).toHaveCount(1);
  await context.close();
});

test("the food book link moves from above the dishes to the right of the heading", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cafe/food/");
  const title = page.locator("#menu-top h1");
  const book = page.locator("#menu-top .menu-book");
  const signature = page.locator("#signature");
  const mobileTitle = (await title.boundingBox())!;
  const mobileBook = (await book.boundingBox())!;
  expect(mobileBook.y).toBeGreaterThan(mobileTitle.y + mobileTitle.height);
  expect(mobileBook.y + mobileBook.height).toBeLessThan((await signature.boundingBox())!.y);
  await page.setViewportSize({ width: 1440, height: 900 });
  const desktopTitle = (await title.boundingBox())!;
  const desktopBook = (await book.boundingBox())!;
  expect(desktopBook.x).toBeGreaterThanOrEqual(desktopTitle.x + desktopTitle.width);
  expect(Math.abs(desktopBook.y - desktopTitle.y)).toBeLessThan(5);
});

test("the drinks catalog and its preparation prices work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  const page = await context.newPage();
  for (const english of [false, true]) {
    await page.goto(english ? "/en/cafe/drinks/" : "/cafe/drinks/");
    await expect(page.locator("[data-drink-item]")).toHaveCount(48);
    await expect(page.locator('a[href*="heyzine"]')).toHaveCount(1);
    const matcha = page.locator("[data-drink-item]").filter({ has: page.getByRole("heading", { name: english ? "Matcha Latte" : "มัทฉะลาเต้", exact: true }) });
    await expect(matcha.locator("dt")).toHaveText(english ? ["Hot", "Iced", "Blended"] : ["ร้อน", "เย็น", "ปั่น"]);
    await expect(matcha.locator("dd")).toHaveText(["95", "135", "155"].map((price) => `${price} ${english ? "THB" : "บาท"}`));
    const categories = page.getByRole("navigation", { name: english ? "Drinks categories" : "หมวดเครื่องดื่ม" });
    await expect(categories.getByRole("link")).toHaveCount(6);
    await categories.getByRole("link", { name: english ? "Fruit & smoothies" : "น้ำผลไม้และสมูทตี้" }).click();
    await expect(page).toHaveURL(/#fruit-smoothies$/);
    const smoothie = page.locator("#fruit-smoothies [data-drink-item]").filter({ hasText: english ? "Passion Fruit Smoothie" : "เสาวรสสมูทตี้" });
    await expect(smoothie.locator("dd")).toHaveText(english ? "145 THB" : "145 บาท");
  }
  await context.close();
});

test("signature dishes have matching photos and prices ahead of the category navigation", async ({ page }) => {
  for (const locale of [
    {
      path: "/cafe/food/",
      names: ["ข้าวแมว", "ข้าวหมา", "ยำนกแก้ว (ยำตะไคร้)"],
      price: "179 บาท",
      browse: "เลือกหมวดอาหาร",
    },
    {
      path: "/en/cafe/food/",
      names: ["Cat Rice", "Dog Rice", "Parrot Salad (Lemongrass Salad)"],
      price: "179 THB",
      browse: "Browse food categories",
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

test("café, menus and activities fit narrow phones and desktop with working category navigation", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/cafe/", "/cafe/food/", "/cafe/drinks/", "/activities/"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
    await page.getByRole("navigation", { name: "หมวดกิจกรรม" }).getByRole("link", { name: "กิจกรรมและราคา" }).click();
    await expect(page).toHaveURL(/#experiences$/);
    await expect(page.getByRole("heading", { name: "กิจกรรมซื้อเพิ่ม" })).toBeInViewport();
  }
});

for (const fallback of [false, true]) {
  test(`photo dialog dismisses only for deliberate backdrop clicks (${fallback ? "fallback" : "native"})`, async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    if (fallback) {
      await page.addInitScript(() => {
        Reflect.deleteProperty(HTMLDialogElement.prototype, "closedBy");
      });
    }
    await page.goto("/en/activities/");
    const photo = page.locator("#one-zone [data-activity-photo]").first();
    const dialog = page.locator(".activity-photo-dialog");
    if (fallback) {
      await dialog.evaluate(element => element.removeAttribute("closedby"));
    }

    await photo.click();
    await dialog.getByRole("button", { name: "Close enlarged photo" }).click();
    await expect(dialog).toBeHidden();
    await expect(photo).toBeFocused();

    await photo.click();
    const box = (await dialog.boundingBox())!;
    const inside = { x: box.x + 4, y: box.y + box.height / 2 };
    const outside = { x: box.x - 8, y: inside.y };
    await page.mouse.click(inside.x, inside.y);
    await expect(dialog).toBeVisible();
    await page.mouse.move(inside.x, inside.y);
    await page.mouse.down();
    await page.mouse.move(outside.x, outside.y);
    await page.mouse.up();
    await expect(dialog).toBeVisible();
    await page.mouse.click(outside.x, outside.y);
    await expect(dialog).toBeHidden();
    await expect(photo).toBeFocused();
  });
}
