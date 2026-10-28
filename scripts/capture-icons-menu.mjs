import { chromium } from "@playwright/test";
const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
for(const theme of ["light","dark"]){await p.goto("http://127.0.0.1:4321/");await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:"docs/review/garden-experience-2026-09-28/logo-"+theme+".png"});}
await p.goto("http://127.0.0.1:4321/menu/#plant-based");await p.evaluate(()=>document.fonts.ready);
await p.locator("#plant-based").scrollIntoViewIfNeeded();await p.locator("#plant-based img").evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
await p.locator("#plant-based .food-section__photos").screenshot({path:"docs/review/garden-experience-2026-09-28/menu-both-photos.png"});
console.log(await p.locator("#plant-based .food-section__photos img").count());await b.close();

