import { chromium } from "@playwright/test";
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
await p.goto("http://127.0.0.1:4321/activities/");await p.evaluate(()=>document.fonts.ready);
await p.evaluate(async()=>{await Promise.all(Array.from(document.images).map(i=>{i.loading="eager";return i.decode().catch(()=>{})}))});
for(const [width,height] of [[1440,1000],[390,844]]) {await p.setViewportSize({width,height});
for(const id of ["animal-zones","experiences"]){await p.locator("#"+id).screenshot({path:"docs/review/garden-experience-2026-09-28/"+id+"-"+width+".png"});}
}await b.close();

