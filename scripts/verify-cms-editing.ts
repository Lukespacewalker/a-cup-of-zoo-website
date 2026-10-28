import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { fixtureVenue } from "../src/lib/content/fixture-data";
import { createLocalCmsRuntime } from "../../CMS-Platform-acupofzoo/apps/api/src/local/create-local-cms-runtime";
import { acupofzooProject } from "../../CMS-Platform-acupofzoo/packages/contracts/src/project";

// Explicit local integration check. All writes go to a fresh disposable database.
const temporaryRoot = await mkdtemp(join(tmpdir(), "acupofzoo-webtest-"));
let runtime: Awaited<ReturnType<typeof createLocalCmsRuntime>>;
let cmsAvailable = true;
const server = Bun.serve({hostname:"127.0.0.1",port:0,fetch:request=>runtime && cmsAvailable ? runtime.fetch(request) : new Response(null,{status:503})});
const cmsOrigin=server.url.origin;
runtime = await createLocalCmsRuntime({ databasePath:join(temporaryRoot,"cms.sqlite"), storageRoot:join(temporaryRoot,"objects"), mediaPublicUrl:cmsOrigin+"/media", adminApiToken:"test-admin", mcpApiToken:"test-mcp", project:acupofzooProject });
const reservation=Bun.serve({hostname:"127.0.0.1",port:0,fetch:()=>new Response(null)});
const sitePort=reservation.port; await reservation.stop(true);
const origin=`http://127.0.0.1:${sitePort}`;
await mkdir("tmp",{recursive:true});
// Cloudflare bindings, rather than process.env, supply astro:env/server in this adapter.
await writeFile("tmp/cms-integration-wrangler.json",JSON.stringify({name:"acupofzoo-local-verification",compatibility_date:"2026-09-25",compatibility_flags:["nodejs_compat"],workers_dev:false,vars:{SITE_ENV:"local",CONTENT_MODE:"cms",CMS_BASE_URL:cmsOrigin}}));
await writeFile("tmp/cms-integration.config.mjs",`import base from '../astro.config.mjs';\nimport cloudflare from '@astrojs/cloudflare';\nexport default {...base, root:process.cwd(), cacheDir:'./tmp/cms-integration-cache', adapter:cloudflare({configPath:'./tmp/cms-integration-wrangler.json',persistState:false,remoteBindings:false})};\n`);
const child = Bun.spawn(["node","node_modules/astro/bin/astro.mjs","dev","--ignore-lock","--config","tmp/cms-integration.config.mjs","--host","127.0.0.1","--port",String(sitePort)], {cwd:resolve(import.meta.dir,".."), env:{...process.env,SITE_ENV:"local",CONTENT_MODE:"cms",CMS_BASE_URL:cmsOrigin},stdout:"ignore",stderr:"inherit"});
const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
async function tool(name: string, args: Record<string,unknown>) {
  const response=await runtime.fetch(new Request("http://localhost/mcp",{method:"POST",headers:{host:"localhost",authorization:"Bearer test-mcp","content-type":"application/json","mcp-protocol-version":"2026-07-28","mcp-method":"tools/call","mcp-name":name},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/call",params:{name,arguments:args,_meta:{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{},"io.modelcontextprotocol/clientInfo":{name:"website-integration",version:"1"}}}})}));
  const body=await response.json() as {result?:{isError?:boolean;content:Array<{text:string}>}};
  assert(response.ok && body.result && !body.result.isError, `Tool failed: ${name}`);
  return JSON.parse(body.result!.content[0].text);
}
try {
  const image=await tool("upload_cafe_image",{fileName:"animal.png",mimeType:"image/png",width:1,height:1,base64Data:"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2ioAAAAASUVORK5CYII=",altTh:"สัตว์ทดสอบ",altEn:"Test animal",sourceKey:"integration:animal"});
  const content=structuredClone(fixtureVenue.content);
  content.animals=[{id:"cms-animal",title:"สัตว์จากซีเอ็มเอส",titleEn:"CMS animal",description:"ข้อมูลทดสอบ",descriptionEn:"Test content",mediaAssetId:image.id,featured:false,visible:true,sortOrder:0}];
  const created=await runtime.fetch(new Request("http://localhost/api/venue",{method:"POST",headers:{authorization:"Bearer test-admin","content-type":"application/json"},body:JSON.stringify({content})}));
  assert(created.status===201,"Create disposable venue");
  let venue=await tool("publish_venue",{expectedVersion:1});
  const deadline=Date.now()+45_000;
  while (true) {
    if (child.exitCode !== null) throw new Error(`CMS-mode website exited (${child.exitCode})`);
    try { const response=await fetch(origin+"/animals/",{signal:AbortSignal.timeout(3000)}); if(response.ok) break; } catch {}
    if(Date.now()>deadline) throw new Error("CMS-mode website did not start");
    await Bun.sleep(200);
  }
  const html = async (path:string) => {const response=await fetch(origin+path,{signal:AbortSignal.timeout(10000)});assert(response.ok,`Page ${path}`);return response.text();};
  let animalsHtml=await html("/en/animals/");
  const residents=(body:string)=>(body.match(/data-resident=/g)??[]).length;
  assert(residents(animalsHtml)===1 && animalsHtml.includes("CMS animal"),`CMS English roster replaces fixture (resident count ${residents(animalsHtml)})`);
  assert(animalsHtml.includes(image.url),"Uploaded image is referenced by the public page");
  const imageResponse=await fetch(image.url);
  assert(imageResponse.ok && (await imageResponse.arrayBuffer()).byteLength>0,"Uploaded image publicly loads");
  const next={...venue.draft,phoneE164:"+66911111111",additionalPhoneE164s:[],animals:[],hoursExceptions:[{date:"2026-12-31",closed:true,opens:null,closes:null,note:"วันหยุดทดสอบ"}],regularHours:venue.draft.regularHours.map((day:{isoWeekday:number})=>day.isoWeekday===1?{...day,closed:false,opens:"11:15",closes:"17:45"}:day)};
  venue=await tool("save_venue_draft",{content:next,expectedVersion:venue.version});
  assert(residents(await html("/en/animals/"))===1,"Draft removal stays private");
  venue=await tool("publish_venue",{expectedVersion:venue.version});
  assert(residents(await html("/en/animals/"))===0,"Published removal appears without changing the page structure");
  venue=await tool("save_venue_draft",{content:{...venue.draft,animals:[{...content.animals[0],id:"new-animal",title:"เพื่อนใหม่",titleEn:"New CMS friend"}]},expectedVersion:venue.version});
  await tool("publish_venue",{expectedVersion:venue.version});
  assert((await html("/en/animals/")).includes("New CMS friend"),"Published addition appears");
  const visitHtml=await html("/visit/");
  assert((visitHtml.match(/href="tel:\+66911111111"/g)??[]).length===2,"CMS phone used in contact action and footer");
  assert(!visitHtml.includes('href="tel:+66989838037"')&&!visitHtml.includes('href="tel:+66922791890"'),"Removed phone links absent");
  assert(visitHtml.includes("11:15–17:45"),"CMS regular hours rendered");
  assert(visitHtml.includes("2026-12-31"),"CMS special hours rendered");
  const translation={locale:"th",slug:"integration-news",title:"ข่าวทดสอบก่อนแก้",excerpt:"ทดสอบ",bodyMarkdown:"เนื้อหาข่าวทดสอบ",seoTitle:"",seoDescription:""};
  let post=await tool("create_post_draft",{translations:[translation]});
  post=await tool("publish_post",{id:post.id,expectedVersion:post.version});
  post=await tool("update_post_draft",{id:post.id,expectedVersion:post.version,translations:[{...translation,title:"ข่าวทดสอบหลังแก้"}]});
  assert((await html("/news/integration-news/")).includes("ก่อนแก้"),"Article draft stays private");
  await tool("publish_post",{id:post.id,expectedVersion:post.version});
  assert((await html("/news/integration-news/")).includes("หลังแก้"),"Published article edit appears");
  cmsAvailable = false;
  const outageHtml = await html("/events/");
  assert(!outageHtml.includes('href="tel:'), "CMS outage does not restore obsolete phones in event actions or footer");
  await mkdir("tmp/owner-ready-review",{recursive:true});
  await writeFile("tmp/owner-ready-review/cms-integration.json",JSON.stringify({passed:true,checks:["uploaded image renders","CMS animal roster replaces fixture","draft removal private","publish removes animal","publish adds animal","phone edits and removals in page/footer","regular hours","special hours","article draft private","published article edit","CMS outage does not restore obsolete phones"],testedAt:new Date().toISOString()},null,2));
  console.log("PASS: actual CMS/MCP → published API → Astro page, 11 integration checks");
} finally {
  if (child.exitCode === null) {
    // Windows Node version managers can add wrappers; stop the owned process tree too.
    if (process.platform === "win32") {
      const stop = Bun.spawn(["taskkill.exe", "/PID", String(child.pid), "/T", "/F"], { stdout: "ignore", stderr: "ignore" });
      await stop.exited;
    } else child.kill();
  }
  await child.exited; await server.stop(true); runtime.close();
  const resolved=resolve(temporaryRoot);
  if(!resolved.startsWith(resolve(tmpdir())+sep)||!resolved.includes("acupofzoo-webtest-")) throw new Error("Unexpected cleanup path");
  try {await rm(resolved,{recursive:true,force:true,maxRetries:3,retryDelay:50});} catch(error) {if(!(error instanceof Error&&"code" in error&&error.code==="EBUSY")) throw error; console.warn("Disposable SQLite directory remains locked until process exit.");}
}
