import { chromium, expect } from "@playwright/test";
const browser=await chromium.launch(); const page=await browser.newPage({reducedMotion:"reduce"});
const folder="docs/review/garden-experience-2026-09-28";
const ratio=(a,b)=>{const lum=c=>{let x=c.match(/\d+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*x[0]+.7152*x[1]+.0722*x[2]};const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const results=[];
for(const [name,width,height,path,theme] of [
 ["home-en-desktop",1440,1000,"/en/","light"],["home-en-mobile",390,844,"/en/","light"],
 ["home-wide",1920,1080,"/","light"],["home-dark",1440,1000,"/","dark"],["home-small",320,900,"/","light"],
 ["home-tablet-en",768,1000,"/en/","light"],["home-zoom-reflow",720,500,"/en/","light"]
]){
 await page.setViewportSize({width,height});await page.goto("http://127.0.0.1:4321"+path);
 await page.evaluate(t=>{localStorage.setItem("cup-theme",t);document.documentElement.dataset.theme=t},theme);
 await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
 await page.screenshot({path:folder+"/"+name+"-fold.png"});
 results.push({name,width,height,path,theme,overflow:false});
}
await page.setViewportSize({width:1440,height:1000});await page.goto("http://127.0.0.1:4321/");
await page.evaluate(()=>document.fonts.ready);
await page.locator(".cat-story").scrollIntoViewIfNeeded();
await page.locator(".cat-story img").evaluateAll(async imgs=>Promise.all(imgs.map(img=>img.decode())));
await page.screenshot({path:folder+"/cat-story-desktop.png"});
for(const selector of [".cat-story h2",".cat-story-copy>p",".cat-story .cafe-link",".cat-story-small figcaption"]){
 const colors=await page.locator(selector).first().evaluate(el=>({color:getComputedStyle(el).color,bg:getComputedStyle(document.querySelector(".cat-story")).backgroundColor}));
 const contrast=ratio(colors.color,colors.bg);expect(contrast).toBeGreaterThanOrEqual(4.5);
 results.push({selector,...colors,contrast});
}
await page.locator(".cat-story .cafe-link").hover();
const hover=await page.locator(".cat-story .cafe-link").evaluate(el=>({color:getComputedStyle(el).color,bg:getComputedStyle(document.querySelector(".cat-story")).backgroundColor}));
results.push({hover,contrast:ratio(hover.color,hover.bg)});
await page.setViewportSize({width:390,height:844});await page.locator(".cat-story").scrollIntoViewIfNeeded();
await page.screenshot({path:folder+"/cat-story-mobile.png"});
console.log(JSON.stringify(results,null,2));await browser.close();

