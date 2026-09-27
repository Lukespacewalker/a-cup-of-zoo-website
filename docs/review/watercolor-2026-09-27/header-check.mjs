import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const output = new URL('./', import.meta.url);
const browser = await chromium.launch();
const results = [];
try {
  for (const locale of ['th', 'en']) for (const theme of ['light', 'dark']) for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 960 } });
    await context.addInitScript(value => localStorage.setItem('cup-theme', value), theme);
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4321/${locale === 'en' ? 'en/' : ''}`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.site-header').screenshot({ path: new URL(`header-v2-${locale}-${width}-${theme}.png`, output).pathname.slice(1) });
    results.push(await page.evaluate(() => ({
      locale: document.documentElement.lang, theme: document.documentElement.dataset.theme, width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      controls: ['.language-switch', '.theme-button'].map(selector => {
        const el = document.querySelector(selector), rect = el.getBoundingClientRect(), css = getComputedStyle(el);
        return { selector, label: el.getAttribute('aria-label'), href: el.getAttribute('href'), x: rect.x, width: rect.width, height: rect.height, border: css.borderWidth, radius: css.borderRadius, background: css.backgroundColor, color: css.color };
      }),
    })));
    if (width === 390 && theme === 'light') {
      await page.locator('.hero-art img').evaluate(img => img.decode());
      await page.screenshot({ path: new URL(`hero-v2-${locale}-${width}-${theme}.png`, output).pathname.slice(1) });
    }
    await context.close();
  }
} finally { await browser.close(); }
writeFileSync(new URL('header-observations.json', output), JSON.stringify(results, null, 2));
if (results.some(r => r.overflow || r.controls.some(c => c.width < 44 || c.height < 44) || r.controls[0].x + r.controls[0].width > r.controls[1].x)) throw new Error('Header geometry check failed');
console.log(`Captured ${results.length} language/theme header states without overflow or overlapping controls.`);
