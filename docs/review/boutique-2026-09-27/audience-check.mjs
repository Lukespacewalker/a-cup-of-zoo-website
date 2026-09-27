// Read-only audience probe against the existing local fixture preview.
import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
try {
  const context = await browser.newContext({ locale: 'en-US', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const pages = [];
  for (const route of ['/', '/animals/', '/menu/', '/activities/', '/visit/']) {
    await page.goto(`http://127.0.0.1:4321${route}`);
    pages.push(await page.evaluate(() => ({
      route: location.pathname,
      browserLanguage: navigator.language,
      htmlLanguage: document.documentElement.lang,
      heading: document.querySelector('h1').textContent,
      languageLinks: [...document.querySelectorAll('a[hreflang]')].map(link => link.hreflang),
      navigation: [...document.querySelectorAll('.desktop-nav a')].map(link => link.textContent),
    })));
  }
  await page.goto('http://127.0.0.1:4321/');
  await page.locator('.cover-actions').getByRole('link', { name: 'ดูเมนูอาหาร' }).click();
  await expect(page.locator('[data-menu-code]')).toHaveCount(47);
  const menuSchema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  const dishes = menuSchema.hasMenuSection.flatMap(section => section.hasMenuItem);
  const mismatches = await page.evaluate(items => items.flatMap(item => {
    const row = [...document.querySelectorAll('[data-menu-code]')].find(row => {
      const heading = row.querySelector('h3').cloneNode(true);
      heading.querySelector('.dish-code').remove();
      return heading.textContent.trim() === item.name;
    });
    const offers = Array.isArray(item.offers) ? item.offers : [item.offers];
    return row && offers.every(offer => row.textContent.includes(`${offer.price} บาท`)) ? [] : [{ name: item.name, matched: row?.querySelector('h3').textContent, offers }];
  }), dishes);
  console.log(JSON.stringify({ mismatches }, null, 2));
  const renderedPricesMatch = mismatches.length === 0;
  if (!renderedPricesMatch || dishes.length !== 47) throw new Error('Menu price/schema mismatch');
  await page.getByRole('navigation', { name: 'หมวดเมนู' }).getByRole('link', { name: 'เมนูจากพืช' }).click();
  await expect(page.getByRole('heading', { name: 'เมนูจากพืช', exact: true })).toBeInViewport();
  await page.locator('#plant-based summary').click();
  await expect(page.locator('#plant-based details')).toHaveAttribute('open', '');
  await page.goto('http://127.0.0.1:4321/');
  await page.locator('.cover-actions').getByRole('link', { name: 'วางแผนมาเที่ยว' }).click();
  await expect(page).toHaveURL(/\/visit\/$/);
  await page.getByRole('link', { name: 'ดูสิทธิประโยชน์แพ็กเกจและเงื่อนไขเด็ก' }).click();
  await expect(page).toHaveURL(/\/activities\/#passes$/);
  await expect(page.locator('.activity-terms')).toContainText('เด็กสูงต่ำกว่า 100 ซม. เข้าฟรี');
  await expect(page.locator('.activity-terms')).toContainText('49 บาท');
  await expect(page.locator('.activity-terms')).toContainText('18:00');
  const result = {
    pages,
    interactions: ['home → menu', 'menu category jump', 'additional food image opens', 'home → visit → passes and child conditions'],
    menuItems: dishes.length,
    renderedPricesMatchSchema: renderedPricesMatch,
    englishReadiness: 'Main customer paths remain Thai with browser locale en-US; no English version or language selector was found in source/DOM.',
  };
  await writeFile('docs/review/boutique-2026-09-27/audience-observations.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  await context.close();
} finally {
  await browser.close();
}
