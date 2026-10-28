import {chromium,expect} from "@playwright/test";
const b=await chromium.launch();const p=await b.newPage();
for(const width of [320,390,1440]){
 await p.setViewportSize({width,height:900});await p.goto("http://127.0.0.1:4321/animals/");
 await p.evaluate(()=>document.fonts.ready);
 expect(await p.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
 await expect(p.locator(".animal-zone-columns")).toContainText("เมนคูน");
 await expect(p.locator(".animal-zone-columns")).toContainText("เฟนเน็กฟอกซ์");
 await expect(p.locator(".animal-directory")).toHaveCount(0);
 await p.locator(".animal-zone-columns").screenshot({path:"docs/review/garden-experience-2026-09-28/animal-list-"+width+".png"});
}
await b.close(); console.log("Animal list visible with no overflow at320/390/1440; obsolete disclosure removed.");

