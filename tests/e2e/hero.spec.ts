import { expect, test } from "@playwright/test";

const wideVideoPath = "/videos/homepage-hero-dissolve.mp4";
const portraitVideoPath = "/videos/homepage-hero-mobile-dissolve.mp4";

test("only the home pages preload the poster selected for the viewport", async ({ page }) => {
  const preload = page.locator('head link[rel="preload"][as="image"][fetchpriority="high"]');
  const posterPaths = [
    [390, "/videos/homepage-hero-mobile-poster.webp"],
    [1440, "/videos/homepage-hero-poster.webp"],
  ] as const;

  for (const [width, path] of posterPaths) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/", "/en/"]) {
      await page.goto(route);
      const poster = page.locator("[data-hero-poster]");
      await expect.poll(() => poster.evaluate(
        (img: HTMLImageElement) => new URL(img.currentSrc).pathname,
      )).toBe(path);
      const activePreloads = await preload.evaluateAll((links) => links
        .filter((link) => matchMedia((link as HTMLLinkElement).media).matches)
        .map((link) => new URL((link as HTMLLinkElement).href).pathname));
      expect(activePreloads).toEqual([path]);
    }
  }

  await page.goto("/en/visit/");
  await expect(preload).toHaveCount(0);
});

test("mobile plays the portrait edit and tries the wide edit if it cannot load", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const video = page.locator("[data-hero-video]");
  const control = page.getByRole("button", { name: "Play video", exact: true });

  await page.goto("/en/");
  await control.click();
  await expect(video).toHaveJSProperty("videoWidth", 608);
  await expect.poll(() => video.evaluate(
    (element: HTMLVideoElement) => new URL(element.currentSrc).pathname,
  )).toBe(portraitVideoPath);

  await page.route(url => url.pathname === portraitVideoPath, route => route.abort("failed"));
  await page.reload();
  await control.click();
  await expect(video).toHaveJSProperty("videoWidth", 1920);
  await expect.poll(() => video.evaluate(
    (element: HTMLVideoElement) => new URL(element.currentSrc).pathname,
  )).toBe(wideVideoPath);
  await expect(page.getByRole("button", { name: "Pause video", exact: true })).toBeVisible();
});

test("resizing keeps the hero playback position and pause state", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const mediaRequests: string[] = [];
  page.on("request", request => {
    if (request.resourceType() === "media") mediaRequests.push(request.url());
  });
  await page.goto("/en/");
  const origin = await page.evaluate(() => performance.timeOrigin);
  const video = page.locator("[data-hero-video]");
  const hero = page.locator("[data-hero-media]");
  const currentPath = () => video.evaluate(
    (element: HTMLVideoElement) => element.currentSrc && new URL(element.currentSrc).pathname,
  );
  const currentTime = () => video.evaluate((element: HTMLVideoElement) => element.currentTime);
  const play = page.getByRole("button", { name: "Play video", exact: true });
  const pause = page.getByRole("button", { name: "Pause video", exact: true });

  await page.setViewportSize({ width: 701, height: 844 });
  const poster = page.locator("[data-hero-poster]");
  await expect.poll(() => poster.evaluate(
    (image: HTMLImageElement) => image.currentSrc && new URL(image.currentSrc).pathname,
  )).toBe("/videos/homepage-hero-poster.webp");
  await expect(video).toHaveJSProperty("paused", true);
  expect(mediaRequests).toEqual([]);

  await play.click();
  await expect.poll(currentPath).toBe(wideVideoPath);
  await expect(video).toHaveJSProperty("videoWidth", 1920);
  await video.evaluate((element: HTMLVideoElement) => { element.currentTime = 7; });
  await expect.poll(currentTime).toBeGreaterThanOrEqual(7);

  await page.setViewportSize({ width: 700, height: 844 });
  await expect.poll(currentPath).toBe(portraitVideoPath);
  await expect(video).toHaveJSProperty("videoWidth", 608);
  await expect(hero).toHaveAttribute("data-ready", "true");
  await expect(video).toHaveJSProperty("paused", false);
  await expect.poll(currentTime).toBeGreaterThan(7);

  await pause.click();
  const pausedAt = await currentTime();
  await page.setViewportSize({ width: 701, height: 844 });
  await expect.poll(currentPath).toBe(wideVideoPath);
  await expect(video).toHaveJSProperty("videoWidth", 1920);
  await expect(hero).toHaveAttribute("data-ready", "true");
  await expect(video).toHaveJSProperty("paused", true);
  await expect.poll(currentTime).toBeCloseTo(pausedAt, 1);
  await expect(play).toBeVisible();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(origin);
});

for (const state of ["playing", "paused"] as const) {
  test(`a rapid resize keeps the hero ${state} as the portrait request is abandoned`, async ({ page }) => {
    await page.setViewportSize({ width: 701, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    if (state === "paused") {
      await page.addInitScript(() => {
        const frameEvents = ["loadeddata", "playing", "seeked"];
        const delayFrame = (event: Event) => {
          if (event.target instanceof HTMLVideoElement && event.target.matches("[data-hero-video]")) {
            event.stopPropagation();
          }
        };
        for (const event of frameEvents) document.addEventListener(event, delayFrame, true);
        document.addEventListener("release-hero-frame", () => {
          for (const event of frameEvents) document.removeEventListener(event, delayFrame, true);
        }, { once: true });
      });
    }
    let releasePortrait!: () => void;
    const portraitReady = new Promise<void>(resolve => { releasePortrait = resolve; });
    await page.route(url => url.pathname === portraitVideoPath, async route => {
      await portraitReady;
      await route.abort("aborted");
    });
    const video = page.locator("[data-hero-video]");
    const currentTime = () => video.evaluate((element: HTMLVideoElement) => element.currentTime);
    const play = page.getByRole("button", { name: "Play video", exact: true });
    const pause = page.getByRole("button", { name: "Pause video", exact: true });
    try {
      await page.goto("/en/");
      await play.click();
      await expect(video).toHaveJSProperty("videoWidth", 1920);
      await video.evaluate((element: HTMLVideoElement) => { element.currentTime = 6; });

      await Promise.all([
        page.waitForRequest(request => new URL(request.url()).pathname === portraitVideoPath),
        page.setViewportSize({ width: 700, height: 844 }),
      ]);
      if (state === "paused") {
        await pause.click();
        await expect(page.locator("[data-hero-media]")).toHaveAttribute("data-ready", "false");
        await page.evaluate(() => document.dispatchEvent(new Event("release-hero-frame")));
      }
      await page.setViewportSize({ width: 701, height: 844 });
      await expect(video).toHaveJSProperty("videoWidth", 1920);
      releasePortrait();

      await expect(state === "paused" ? play : pause).toBeVisible();
      await expect(video).toHaveJSProperty("paused", state === "paused");
      await expect.poll(currentTime).toBeGreaterThanOrEqual(6);
      if (state === "playing") {
        const before = await currentTime();
        await expect.poll(currentTime).toBeGreaterThan(before);
      }
    } finally {
      releasePortrait();
    }
  });
}

test("home header receives clicks above the media on desktop and mobile", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("วันนี้กินอะไรดี… มีเพื่อนรออยู่");
    await expect(page.locator(".hero-hashtags")).toContainText("#คาเฟ่สัตว์คลองหก");
    if (width === 390) {
      const toggle = page.getByRole("button", { name: "เมนู", exact: true });
      await expect(toggle).toHaveText("");
      const openNav = page.locator("#site-nav:popover-open");
      await expect(openNav).toHaveCount(0);
      await toggle.click({ timeout: 3000 });
      await expect(openNav).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(openNav).toHaveCount(0);
      await expect(toggle).toBeFocused();
    } else {
      await page.locator("#site-nav").getByRole("link", { name: "เพื่อนสัตว์", exact: true }).click({ timeout: 3000 });
      await expect(page).toHaveURL(/\/animals\/$/);
    }
  }
});

test("hero autoplay waits for the poster while manual playback is available", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let releasePoster!: () => void;
  const posterReady = new Promise<void>(resolve => { releasePoster = resolve; });
  await page.route("**/videos/homepage-hero-mobile-poster.webp", async route => {
    await posterReady;
    await route.continue();
  });
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () {
      this.setAttribute("data-play-attempted", "true");
      return Promise.reject(new DOMException("Blocked", "NotAllowedError"));
    };
  });

  try {
    await page.goto("/en/", { waitUntil: "domcontentloaded" });
    const control = page.getByRole("button", { name: "Play video", exact: true });
    await expect(control).toBeVisible();
    const video = page.locator("[data-hero-video]");
    await expect(video).not.toHaveAttribute("data-play-attempted", "true");
    await control.click();
    await expect(video).toHaveAttribute("data-play-attempted", "true");
  } finally {
    releasePoster();
  }
});

test("video plays, pauses and respects changes to reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/");
  const video = page.locator("[data-hero-video]");
  const control = page.getByRole("button", { name: "Play video", exact: true });
  await expect(control).toBeVisible();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await control.click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.1);
  await page.getByRole("button", { name: "Pause video", exact: true }).click();
  const stopped = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await expect(video).toHaveJSProperty("paused", true);
  // Verify across several frames, not only immediately after the event.
  await page.evaluate(() => new Promise<void>(resolve => {
    let frames = 0;
    const next = () => ++frames === 12 ? resolve() : requestAnimationFrame(next);
    requestAnimationFrame(next);
  }));
  expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(stopped);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Play video", exact: true }).click();
  await expect(video).toHaveJSProperty("paused", false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(video).toHaveJSProperty("paused", true);
});

test("blocked autoplay preserves a usable play action and media failure preserves the poster", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException("Blocked", "NotAllowedError")); };
  });
  await page.goto("/en/");
  await expect(page.getByRole("button", { name: "Play video", exact: true })).toBeVisible();
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
  await page.getByRole("button", { name: "Play video", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play video", exact: true })).toBeVisible();
  await page.locator("[data-hero-video]").dispatchEvent("error");
  await expect(page.locator("[data-hero-toggle]")).toBeHidden();
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
  await page.locator("[data-hero-actions]").getByRole("link", { name: "Plan your visit" }).click();
  await expect(page).toHaveURL(/\/en\/visit\/$/);
});

test("home remains usable without JavaScript and does not autoplay an uncontrollable loop", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/en/");
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
  await expect(page.locator("video[autoplay]")).toHaveCount(0);
  await expect(page.locator("[data-hero-toggle]")).toBeHidden();
  await page.locator("[data-hero-actions]").getByRole("link", { name: "Plan your visit" }).click();
  await expect(page).toHaveURL(/\/en\/visit\/$/);
  await context.close();
});

test("a failed video request returns to the poster without a misleading pause button", async ({ page }) => {
  await page.route(url => url.pathname === wideVideoPath, route => route.abort("failed"));
  await page.goto("/en/");
  await expect(page.locator("[data-hero-toggle]")).toBeHidden();
  await expect(page.locator("[data-hero-media]")).toHaveAttribute("data-ready", "false");
  await expect(page.locator("[data-hero-video]")).toHaveJSProperty("paused", true);
  await expect(page.locator("[data-hero-poster]")).toBeVisible();
});

test("hero headings and actions fit inside the hero at large text sizes", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 650 });
    for (const route of ["/", "/en/", "/cafe/", "/en/cafe/", "/events/", "/en/events/", "/farm/", "/en/farm/"]) {
      await page.goto(route);
      await page.addStyleTag({ content: ":root { font-size: 32px; }" });
      await page.evaluate(() => document.fonts.ready);
      const fits = await page.locator(".garden-hero, .page-hero").evaluate(hero => {
        const { top, bottom } = hero.getBoundingClientRect();
        return Array.from(hero.querySelectorAll("h1, h1 span, .hero-actions a, .page-hero__actions a")).every(element => {
          const text = document.createRange();
          text.selectNodeContents(element);
          return Array.from(text.getClientRects()).every(rect =>
            rect.left >= 0 && rect.right <= document.documentElement.clientWidth &&
            rect.top >= top && rect.bottom <= bottom
          );
        });
      });
      expect(fits, `${route} at ${width}px`).toBe(true);
    }
  }
});

test("the bilingual Farm hero uses the site font, illustration and content gutters", async ({ page }) => {
  for (const width of [320, 768, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path, title] of [
      ["/farm/", "เพื่อนตัวใหม่กำลังรอคุณอยู่"],
      ["/en/farm/", "Meet your next little friend"],
    ]) {
      await page.goto(path);
      const hero = page.locator("#farm-top");
      const heading = hero.getByRole("heading", { level: 1 });
      await expect(heading).toHaveText(title);
      await expect(heading).toHaveCSS("font-family", /^"Noto Sans Thai Looped"/);
      expect(await hero.locator("img").evaluate(async (image) => {
        await image.decode();
        return image.naturalWidth;
      })).toBeGreaterThan(0);
      const { left, width: innerWidth } = await hero.locator(".page-hero__inner").evaluate((el) => el.getBoundingClientRect().toJSON());
      const shell = (await page.locator("main > .shell").boundingBox())!;
      expect(Math.abs(left - shell.x)).toBeLessThan(1);
      expect(Math.abs(innerWidth - shell.width)).toBeLessThan(1);
      await expect(page.locator(".farm-empty a")).toHaveAttribute("href", /line\.me/);
    }
  }
});

test("café and club switch layouts at the same 700px boundary", async ({ page }) => {
  for (const width of [700, 701]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/cafe/");
    const cafe = page.locator(".page-hero");
    await expect.poll(() => cafe.evaluate(hero =>
      getComputedStyle(hero, "::before").display === "none" ? "stacked" :
        getComputedStyle(hero, "::before").backgroundImage.includes("0.35") ? "overlay" : "other"
    )).toBe(width <= 700 ? "stacked" : "overlay");
    await page.goto("/en/club/");
    const club = page.locator(".tier-list > li").first();
    await expect(club).toHaveCSS("grid-template-rows", width <= 700 ? /^(?!subgrid)/ : /^subgrid/);
  }
});
