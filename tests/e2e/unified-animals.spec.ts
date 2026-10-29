import { expect, test } from "@playwright/test";

// This suite writes votes only to the explicitly launched disposable preview.
test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== "disposable-animal-voting", "Use the isolated voting test configuration");
  expect(info.project.use.baseURL).toBe("http://127.0.0.1:4341");
  await page.goto("/animals/");
  await expect(page.locator('[data-animal-directory]')).toHaveAttribute("data-ready", "true");
});

test("one directory replaces the vote routes while retaining every animal", async ({ page, request }) => {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("[data-resident]")).toHaveCount(23);
  await expect(page.locator('[data-resident="nama"] [data-vote-balls] i')).toHaveCount(0);
  for (const prefix of ["", "/en"]) {
    const response = await request.get(prefix + "/vote/", { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe(prefix + "/animals/#animal-family");
  }
});

test("jar sticker, miniature full jars and top tools follow the paper theme", async ({ page }) => {
  const card = page.locator('[data-resident="dorayaki"]');
  await card.locator('[data-jar-toggle]').click();
  const jar = await card.locator('.vote-jar').boundingBox();
  const portrait = await card.locator('.jar-sticker').boundingBox();
  expect(portrait).not.toBeNull();
  expect(portrait!.x).toBeGreaterThan(jar!.x);
  expect(portrait!.y).toBeGreaterThan(jar!.y);
  expect(portrait!.y + portrait!.height).toBeLessThan(jar!.y + jar!.height);
  await expect(card.locator('.vote-jar-heart')).toHaveCount(0);
  await expect(card.locator('[data-full-jars]')).toBeVisible();
  await expect(card.locator('[data-full-jar-count]')).toHaveText('× 2');
  const refresh = await page.getByRole('link', { name: 'โหลดคะแนนล่าสุด', exact: true }).boundingBox();
  const cards = await page.locator('.animal-cards').boundingBox();
  expect(refresh!.y).toBeLessThan(cards!.y);
  await expect(page.locator('.directory-tools .total-heart')).toBeVisible();
  for (const selector of ['.animal-card', '.vote-button', '#animal-search']) {
    expect(await page.locator(selector).first().evaluate(e => parseFloat(getComputedStyle(e).borderTopLeftRadius))).toBeLessThanOrEqual(6);
  }
});

test("all animal portraits retain CMS focus in square cards and circular stickers", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const card of await page.locator('[data-resident]').all()) {
      const portrait = card.locator('.directory-photo [data-animal-portrait]');
      const square = await portrait.boundingBox();
      expect(Math.abs(square!.width - square!.height)).toBeLessThan(1);
      const style = await portrait.getAttribute('style');
      expect(await card.locator('.jar-sticker [data-animal-portrait]').getAttribute('style')).toBe(style);
      const image = portrait.locator('img');
      await expect(image).toBeVisible();
      await image.evaluate(img => img.decode());
      const geometry = await image.evaluate(img => {
        const box = img.getBoundingClientRect(), frame = img.parentElement!.getBoundingClientRect();
        return { w: box.width, h: box.height, ratio: img.naturalWidth / img.naturalHeight,
          covers: box.left <= frame.left + 1 && box.top <= frame.top + 1 && box.right >= frame.right - 1 && box.bottom >= frame.bottom - 1 };
      });
      expect(geometry.covers).toBe(true);
      expect(Math.abs(geometry.w / geometry.h - geometry.ratio)).toBeLessThan(0.01);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const nama = page.locator('[data-resident="nama"] .directory-photo [data-animal-portrait]');
  expect(await nama.evaluate(e => e.style.getPropertyValue('--portrait-left'))).toBe('-28%');
  expect(await nama.evaluate(e => e.style.getPropertyValue('--portrait-top'))).toBe('-47.5%');
});

test("Three.js podium appears on both pages with accessible CMS portraits and scores", async ({ page }) => {
  for (const path of ['/animals/', '/']) {
    await page.goto(path);
    const podium = page.locator('[data-animal-podium]');
    await podium.scrollIntoViewIfNeeded();
    await expect(podium).toHaveAttribute('data-renderer', 'three');
    await expect(podium.locator('canvas')).toHaveCount(1);
    await expect(podium.locator('[data-podium-place]')).toHaveCount(3);
    await expect(podium.locator('[data-podium-place]').first()).toHaveAttribute('data-animal-id', 'dorayaki');
    await expect(podium.locator('[data-podium-place]').first().locator('[data-podium-score]')).toHaveText('100');
    await expect(podium.locator('[data-podium-place]').first()).toHaveAttribute('href', '/animals/#animal-dorayaki');
  }
});

test("reduced-motion podium portraits stay over the plinths on the first render", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.reload();
  const podium = page.locator('[data-animal-podium]');
  await expect(podium).toHaveAttribute('data-renderer', 'three');
  const stage = await podium.locator('[data-podium-stage]').boundingBox();
  for (const place of await podium.locator('[data-podium-place]').all()) {
    const box = await place.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(stage!.y);
    expect(box!.y + box!.height).toBeLessThan(stage!.y + stage!.height);
  }
});

test("podium remains readable and navigable without WebGL and after context loss", async ({ page, browser }) => {
  const podium = page.locator('[data-animal-podium]');
  await expect(podium).toHaveAttribute('data-renderer', 'three');
  await podium.locator('canvas').evaluate(canvas => {
    const extension = canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context');
    if (!extension) throw new Error('Test browser must support simulated native context loss');
    extension.loseContext();
  });
  await expect(podium).toHaveAttribute('data-renderer', 'fallback');
  await expect(podium.locator('canvas')).toHaveCount(0);
  await expect(podium.locator('.podium-fallback')).toBeVisible();
  await expect(podium.locator('[data-podium-place]')).toHaveCount(3);
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: string, ...args: any[]) {
      return type.startsWith('webgl') ? null : original.call(this, type as any, ...args);
    } as typeof original;
  });
  const fallback = await context.newPage();
  await fallback.goto('http://127.0.0.1:4341/animals/');
  await expect(fallback.locator('[data-animal-podium]')).toHaveAttribute('data-renderer', 'fallback');
  await expect(fallback.locator('[data-podium-place]')).toHaveCount(3);
  await fallback.locator('[data-podium-place]').first().click();
  await expect(fallback).toHaveURL(/#animal-dorayaki$/);
  await expect(fallback.locator('[data-resident="dorayaki"]')).toBeInViewport();
  await context.close();
});

test("podium can change leaders and clear a filter before opening an animal", async ({ page }) => {
  await page.getByRole('searchbox').fill('Mine');
  await page.route('**/api/votes/mine/', route => route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({animalId:'mine',count:101}) }));
  await page.locator('[data-resident="mine"] [data-vote-button]').click();
  const first = page.locator('[data-podium-place]').first();
  await expect(first).toHaveAttribute('data-animal-id', 'mine');
  await expect(first.locator('[data-podium-score]')).toHaveText('101');
  expect(await first.locator('[data-animal-portrait]').getAttribute('style')).toBe(
    await page.locator('[data-resident="mine"] .directory-photo [data-animal-portrait]').getAttribute('style'),
  );
  await page.getByRole('searchbox').fill('Nama');
  await first.click();
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await expect(page.locator('[data-resident="mine"]')).toBeInViewport();
});

test("equal scores receive equal ranks and plinth heights", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.route('**/api/votes/mine/', route => route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({animalId:'mine',count:100}) }));
  await page.locator('[data-resident="mine"] [data-vote-button]').click();
  const leaders = page.locator('[data-podium-place][data-rank="1"]');
  await expect(leaders).toHaveCount(2);
  await expect.poll(async () => {
    const a = await leaders.nth(0).boundingBox(), b = await leaders.nth(1).boundingBox();
    return Math.abs(a!.y + a!.height - b!.y - b!.height);
  }).toBeLessThan(1);
});

test("podium scores retain readable contrast in dark mode and WebGL fallback", async ({ page }) => {
  await page.setViewportSize({width:320,height:900});
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  const podium = page.locator('[data-animal-podium]');
  await expect(podium).toHaveAttribute('data-renderer', 'three');
  for (const state of ['three','fallback']) {
    if (state === 'fallback') await podium.locator('canvas').evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost')));
    await expect(podium).toHaveAttribute('data-renderer', state);
    const ratios = await podium.locator('.podium-score').evaluateAll(labels => labels.flatMap(label => {
      const luminance = (color: string) => {
        const rgb = color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(value => { const v=value/255; return v<=.04045 ? v/12.92 : ((v+.055)/1.055)**2.4; });
        return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
      };
      const background = getComputedStyle(label).backgroundColor;
      if (background === 'rgba(0, 0, 0, 0)') return [0];
      const bg = luminance(background);
      return [...label.children].map(child => { const fg=luminance(getComputedStyle(child).color); return (Math.max(bg,fg)+.05)/(Math.min(bg,fg)+.05); });
    }));
    expect(Math.min(...ratios)).toBeGreaterThanOrEqual(4.5);
  }
});

test("photo frame stays inside its card and does not cover the name or voting controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const frame = await page.locator('.animal-visual').first().boundingBox();
  const image = await page.locator('.animal-visual [data-animal-portrait]').first().boundingBox();
  expect(image!.y + image!.height).toBeLessThanOrEqual(frame!.y + frame!.height + 1);
  const name = await page.locator('[data-animal-name]').first().boundingBox();
  expect(name!.y).toBeGreaterThanOrEqual(frame!.y + frame!.height);
  // The new podium provides the first animal links above the directory grid.
  const action = await page.locator('[data-podium-place]').first().boundingBox();
  expect(action!.y + action!.height).toBeLessThan(1000);
});

test("repeat votes add exactly one ball, preserve focus/layout and restore the photo", async ({ page }) => {
  const card = page.locator('[data-resident="nama"]');
  const button = card.locator('[data-vote-button]');
  const before = await card.boundingBox();
  await button.focus();
  const settledColors: string[] = [];
  for (const count of [1, 2]) {
    await page.keyboard.press("Enter");
    await expect(card).toHaveAttribute("data-count", String(count));
    await expect(card).toHaveClass(/vote-just-sent/);
    const fallingColor = await card.locator('.vote-droplet').evaluate(e => getComputedStyle(e).backgroundColor);
    await expect(card).not.toHaveClass(/vote-just-sent/);
    await expect(card.locator('[data-vote-balls] i')).toHaveCount(count);
    settledColors.push(fallingColor);
    expect(await card.locator('[data-vote-balls] i').evaluateAll(balls => balls.map(e => getComputedStyle(e).backgroundColor))).toEqual(settledColors);
    await expect(card).toHaveAttribute("data-show-jar", "true");
    await expect(button).toBeFocused();
    expect((await card.boundingBox())!.height).toBe(before!.height);
    await expect(page.locator('[data-podium-place][data-animal-id="nama"] [data-podium-score]')).toHaveText(String(count));
  }
  await expect(card).toHaveAttribute("data-show-jar", "false", { timeout: 6000 });
  await card.locator('[data-jar-toggle]').click();
  await expect(card).toHaveAttribute("data-show-jar", "true");
  await expect(card.locator('[data-vote-balls] i')).toHaveCount(2);
  await page.reload();
  await expect(card).toHaveAttribute("data-count", "2");
  expect(await card.locator('[data-vote-balls] i').evaluateAll(balls => balls.map(e => getComputedStyle(e).backgroundColor))).toEqual(settledColors);
});

test("49 to 50 to 51 stores one full jar without scaling other animals", async ({ page }) => {
  const card = page.locator('[data-resident="daifuku"]');
  await card.locator('[data-jar-toggle]').click();
  await expect(card.locator('[data-vote-balls] i')).toHaveCount(49);
  expect(await card.locator('.vote-jar').evaluate(jar => {
    const bounds = jar.getBoundingClientRect();
    return [...jar.querySelectorAll('[data-vote-balls] i')].every(ball => {
      const rect = ball.getBoundingClientRect();
      return rect.left >= bounds.left && rect.right <= bounds.right && rect.top >= bounds.top && rect.bottom <= bounds.bottom;
    });
  })).toBe(true);
  for (const [count, balls] of [[50, 0], [51, 1]]) {
    await card.locator('[data-vote-button]').click();
    await expect(card).toHaveAttribute("data-count", String(count));
    await expect(card).toHaveClass(/vote-just-sent/);
    const fallingColor = await card.locator('.vote-droplet').evaluate(e => getComputedStyle(e).backgroundColor);
    // Absolute vote 50 is blue and 51 is terracotta; the palette does not reset with the jar.
    expect(fallingColor).toBe(count === 50 ? 'rgb(168, 185, 195)' : 'rgb(211, 148, 121)');
    await expect(card).not.toHaveClass(/vote-just-sent/);
    await expect(card.locator('[data-vote-balls] i')).toHaveCount(balls);
    if (balls) await expect(card.locator('[data-vote-balls] i').last()).toHaveCSS('background-color', fallingColor);
    await expect(card.locator('[data-full-jars]')).toBeVisible();
    await expect(card.locator('[data-full-jar-count]')).toHaveText('× 1');
    await expect(card.locator('[data-jar-summary]')).toContainText(`1 โหลเต็ม และ ${balls} ลูก`);
  }
  await expect(page.locator('[data-resident="nama"] [data-vote-balls] i')).toHaveCount(2);
  await expect(page.locator('[data-resident="dorayaki"] [data-full-jar-count]')).toHaveText('× 2');
  await page.reload();
  await expect(card.locator('[data-vote-balls] i')).toHaveCSS('background-color', 'rgb(211, 148, 121)');
});

test("search uses both CMS languages and keeps an explicit empty/clear path", async ({ page }) => {
  const input = page.getByRole("searchbox");
  await input.fill("หยินหยาง");
  await expect(page.locator('[data-resident]:not([hidden])')).toHaveCount(1);
  await input.fill("Maine Coon");
  await expect(page.locator('[data-resident]:not([hidden])')).toHaveCount(1);
  await input.fill("no such animal");
  await expect(page.locator('[data-search-empty]')).toBeVisible();
  await page.locator('[data-search-clear]').click();
  await expect(page.locator('[data-resident]:not([hidden])')).toHaveCount(23);
});

test("refresh reads scores changed by another visitor instead of only scrolling", async ({ page, request }) => {
  const card = page.locator('[data-resident="senbei"]');
  const previous = Number(await card.getAttribute('data-count'));
  const vote = await request.post('/api/votes/senbei/', { headers: { origin: 'http://127.0.0.1:4341' }, data: {} });
  expect(vote.ok()).toBe(true);
  const result = await vote.json();
  expect(result.count).toBe(previous + 1);
  await expect(card).toHaveAttribute('data-count', String(previous));
  await page.getByRole('link', { name: 'โหลดคะแนนล่าสุด', exact: true }).click();
  await expect(card).toHaveAttribute('data-count', String(result.count));
});

test("a failed vote keeps the photo and count unchanged and offers recovery", async ({ page }) => {
  const card = page.locator('[data-resident="mine"]');
  await page.route("**/api/votes/mine/", route => route.fulfill({ status: 503, body: '{}' }));
  await card.locator('[data-vote-button]').click();
  await expect(card.locator('[data-vote-notice]')).toContainText("ยังยืนยันคะแนนไม่ได้");
  await expect(card).toHaveAttribute("data-count", "0");
  await expect(card.locator('[data-vote-button]')).toBeEnabled();
  await expect(card.locator('[data-jar-toggle]')).toHaveAttribute("aria-expanded", "false");
});

test("English repeat label preserves the card and button geometry at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/en/animals/');
  const card = page.locator('[data-resident="senbei"]');
  const button = card.locator('[data-vote-button]');
  await button.scrollIntoViewIfNeeded();
  const before = await card.boundingBox();
  const action = await button.boundingBox();
  const previous = Number(await card.getAttribute('data-count'));
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('data-count', String(previous + 1));
  await expect(button).toBeFocused();
  expect((await card.boundingBox())!.height).toBe(before!.height);
  expect((await button.boundingBox())!.height).toBe(action!.height);
});

test("mobile, bilingual, reduced motion and no-JavaScript discovery stay usable", async ({ page, browser }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const prefix of ["", "/en"]) {
      await page.goto(prefix + "/animals/");
      await expect(page.locator('[data-resident]')).toHaveCount(23);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  const card = page.locator('[data-resident="candy"]');
  await card.locator('[data-vote-button]').click();
  await expect(card).toHaveAttribute("data-count", "1");
  await expect(card.locator('[data-vote-balls] i')).toHaveCount(1);
  expect(await card.locator('.vote-droplet').evaluate(e => getComputedStyle(e).animationName)).toBe("none");
  await expect(card.locator('[data-vote-unit]')).toHaveText("vote");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto("http://127.0.0.1:4341/animals/");
  await expect(plain.locator('[data-resident]')).toHaveCount(23);
  await expect(plain.locator('[data-resident="nama"] [data-vote-count]')).toHaveText("2");
  await expect(plain.locator('[data-animal-search]')).toBeHidden();
  await context.close();
});

