import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const b = await chromium.launch();
const results = [];
try {
for (const width of [320,390,1440]) for (const theme of ['light','dark']) {
 const context = await b.newContext({viewport:{width,height:900},colorScheme:'light'});
 await context.addInitScript(v=>localStorage.setItem('cup-theme',v),theme);
 const p=await context.newPage();
 await p.goto('http://127.0.0.1:4321/en/not-a-page/');
 await p.evaluate(()=>document.fonts.ready);
 const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,text:document.querySelector('main').innerText,switchLabel:document.querySelector('.language-switch').getAttribute('aria-label'),switchHref:document.querySelector('.language-switch').getAttribute('href')}));
 results.push({width,theme,...state});
 await p.screenshot({path:'docs/review/th-en-2026-09-27/en-404-'+width+'-'+theme+'.png',fullPage:true});
 await context.close();
}
await fs.writeFile('docs/review/th-en-2026-09-27/404-observations.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results));
if(results.some(row=>row.overflow)) process.exitCode=1;
} finally {await b.close();}
