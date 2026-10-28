import {chromium,expect} from "@playwright/test";
import {readFile,writeFile} from "node:fs/promises";
const file="src/lib/content/fixture-data.ts", original=await readFile(file);
const browser=await chromium.launch(); const page=await browser.newPage();
try {
 await writeFile(file,original.toString().replace('opens: "10:00", closes: "19:00"','opens: "11:15", closes: "18:30"'));
 for(const prefix of ["","/en"]){
  await page.goto("http://127.0.0.1:4321"+prefix+"/");
  await expect(page.locator(".hours")).toContainText("11:15–18:30");
  const home=await page.locator(".opening-hours").innerText();
  await page.goto("http://127.0.0.1:4321"+prefix+"/visit/");
  expect(await page.locator(".opening-hours").innerText()).toBe(home);
 }
 console.log("PASS: changed disposable fixture hours render identically on Home and Visit, TH and EN.");
} finally {await writeFile(file,original); await browser.close(); console.log("Original fixture bytes restored.");}

