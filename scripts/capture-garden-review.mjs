import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({reducedMotion:"reduce"});
await page.addInitScript(()=>localStorage.setItem("cup-theme","light"));
for (const [name,width,height,path] of [
 ["home-desktop",1440,1000,"/"],["home-mobile",390,844,"/"],["animals-mobile",390,844,"/animals/"],["activities-desktop",1440,1000,"/activities/"],["menu-mobile",390,844,"/menu/"],["visit-mobile",390,844,"/visit/"]]) {
 await page.setViewportSize({width,height}); await page.goto("http://127.0.0.1:4321"+path); await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(async()=>{ await Promise.all(Array.from(document.images).map(img=>{img.loading="eager";return img.decode().catch(()=>{});})); });
 await page.screenshot({path:"docs/review/garden-experience-2026-09-28/"+name+".png",fullPage:true});
 await page.screenshot({path:"docs/review/garden-experience-2026-09-28/"+name+"-fold.png"});
}
await browser.close();


