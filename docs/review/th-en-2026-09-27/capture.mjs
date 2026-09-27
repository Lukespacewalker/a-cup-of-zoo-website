// Run from the repository root with an existing fixture server on port 4321.
import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const output = 'docs/review/th-en-2026-09-27';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const only = process.argv[2];
const observations = only ? JSON.parse(await readFile(`${output}/render-observations.json`, 'utf8')).filter(item => `${item.locale}/${item.route}` !== only) : [];
try {
  for (const width of [320, 390, 1440]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light' });
      await context.addInitScript(value => localStorage.setItem('cup-theme', value), theme);
      const page = await context.newPage();
      for (const locale of ['th', 'en']) {
      for (const route of ['home', 'animals', 'activities', 'menu', 'visit']) {
        if (only && `${locale}/${route}` !== only) continue;
        console.log(`Capturing ${locale} ${route} ${width} ${theme}`);
        await page.goto(`http://127.0.0.1:4321/${locale === 'en' ? 'en/' : ''}${route === 'home' ? '' : route + '/'}`);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.race([new Promise((_, reject) => setTimeout(() => reject(new Error('Images did not settle within 15 seconds')), 15000)), Promise.all([...document.images].map(async image => {
            image.loading = 'eager';
            await image.decode().catch(() => {});
          }))]);
        });
        const state = await page.evaluate(() => ({
          width: innerWidth,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          brokenImages: [...document.images].filter(image => !image.naturalWidth).map(image => image.alt),
          background: getComputedStyle(document.body).backgroundColor,
          heading: getComputedStyle(document.querySelector('h1')).fontFamily,
        }));
        observations.push({ locale, route, theme, ...state });
        await page.screenshot({ path: `${output}/${locale}-${route}-${width}-${theme}.png`, fullPage: true });
        if (route === 'home') await page.screenshot({ path: `${output}/${locale}-cover-${width}-${theme}.png` });
        if (route === 'activities') await page.locator('#passes').screenshot({ path: `${output}/${locale}-passes-${width}-${theme}.png` });
        if (route === 'menu') await page.locator('.food-section').first().screenshot({ path: `${output}/${locale}-food-${width}-${theme}.png` });
      }
      }
      await context.close();
    }
  }
  await writeFile(`${output}/render-observations.json`, JSON.stringify(observations, null, 2) + '\n');
  const failed = observations.filter(item => item.overflow || item.brokenImages.length);
  console.log(JSON.stringify({ renders: observations.length, failed }, null, 2));
  if (failed.length) process.exitCode = 1;
} finally {
  await browser.close();
}
