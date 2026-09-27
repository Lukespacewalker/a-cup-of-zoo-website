// Visual evidence against the existing local fixture server. No CMS writes.
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const output = new URL('./', import.meta.url);
const browser = await chromium.launch();
const observations = [];
try {
  for (const locale of ['th', 'en']) for (const theme of ['light', 'dark']) for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 960 } });
    await context.addInitScript(value => localStorage.setItem('cup-theme', value), theme);
    const page = await context.newPage();
    for (const route of ['', 'activities/']) {
      await page.goto(`http://127.0.0.1:4321/${locale === 'en' ? 'en/' : ''}${route}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        // Load the offscreen photographs for full-page evidence without changing their presentation.
        for (const img of document.images) img.loading = 'eager';
      });
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth), {}, { timeout: 20000 });
      // Chromium can defer painting masks on offscreen lazy photographs. Warm
      // their real viewports before the full-page capture; no CSS overrides.
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(async image => { await image.decode(); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForLoadState('networkidle');
      const label = `${route ? 'activities' : 'home'}-${locale}-${width}-${theme}`;
      await page.screenshot({ path: new URL(`${label}.png`, output).pathname.slice(1), fullPage: true });
      if (!route) await page.screenshot({ path: new URL(`hero-${locale}-${width}-${theme}.png`, output).pathname.slice(1) });
      for (const [part, selector] of [['wishes', '.wishing-story'], ...(!route ? [['friends', '.friends-story']] : [])]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.screenshot({ path: new URL(`${label}-${part}.png`, output).pathname.slice(1) });
      }
      observations.push(await page.evaluate(() => ({
        route: location.pathname, width: innerWidth, theme: document.documentElement.dataset.theme,
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
        maskApplied: getComputedStyle(document.querySelector('.paper-photo')).maskImage !== 'none',
        robots: document.querySelector('meta[name="robots"]').content,
      })));
    }
    await context.close();
    console.log(`Rendered ${locale} ${theme} ${width}`);
  }
} finally { await browser.close(); }
writeFileSync(new URL('render-observations.json', output), JSON.stringify(observations, null, 2));
if (observations.some(item => item.overflow || item.brokenImages.length || !item.maskApplied || !item.robots.includes('noindex'))) throw new Error('Render checks failed');
console.log(`${observations.length} page states passed; screenshots still require visual inspection.`);
