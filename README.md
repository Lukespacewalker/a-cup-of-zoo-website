# A Cup of Zoo

> สถานะปัจจุบัน 28 ตุลาคม 2026: CMS จริงพร้อมใช้ เผยแพร่สัตว์ Canva ครบ 23 ตัว ระบบโหวตซ้ำ/โหลคะแนนและแท่นหน้าแรก พร้อมภาพ ZooClub แล้ว เวอร์ชัน `4b18293c-4c0b-486a-860e-dfec07ca78c7` บน apex/www ใช้ production/CMS และ sitemap 17 หน้า ดู [ผลตรวจหลัง deploy](docs/review/animal-voting-2026-10-28/deployment.md) สถานะ fixture/CMS รอเชื่อมต่อในบันทึกเก่าด้านล่างเป็นประวัติที่ถูกแทนแล้ว

> อัปเดตล่าสุด 27 ตุลาคม 2026: เผยแพร่ Footer ที่อยู่/เบอร์โทร/Facebook/Instagram/TikTok และส่วนชวนติดตามหน้าแรกแล้ว เปิด indexing บนโดเมนร้านพร้อม sitemap15หน้า เวอร์ชัน `8556b10b-60bf-4578-9093-efc3477eae35` ดู [ผลตรวจและหลักฐาน](docs/review/footer-social-2026-10-27/README.md) ข้อนี้แทนสถานะ noindex ของรอบก่อน; CMS จริงยังรอเชื่อมต่อ

> บรีฟเจ้าของร้านล่าสุด — 27 ตุลาคม 2026: อ่าน Canva ครบ 11 หน้า เก็บภาพประกอบและเล่มเครื่องดื่มแล้ว ดู [รายการที่ต้องปรับก่อนเปิดเว็บไซต์จริง](docs/owner-feedback-2026-10-27.md) แก้และเผยแพร่หน้าเว็บส่วนที่ข้อมูลพร้อมตามคำอนุมัติแล้ว รวมแผนผัง โปรไฟล์สัตว์ events, Zoo Clubs และลิงก์เมนู ดู [ผลการแก้ไขและขอบเขต CMS/MCP](docs/owner-ready-changes-2026-10-27.md) และ [หลักฐานหลัง deploy](docs/review/owner-ready-2026-10-27/deployment.json) CMS/MCP จริงยังต้องเชื่อมต่อแยก

> ดีไซน์รอบปัจจุบัน: [Garden & Animal Experience — 28 กันยายน 2026](docs/superpowers/plans/2026-09-28-garden-animal-experience.md) รวม hero video สัตว์ สีน้ำ กระดาษ และข้อมูลบริการตามโบรชัวร์ล่าสุดที่ผู้ใช้ส่ง Deploy ขึ้น Cloudflare preview แล้วเมื่อ 28 กันยายน 2026 — ดู [ผลตรวจและภาพล่าสุด](docs/review/garden-experience-2026-09-28/README.md)

> ภาษาไทยใช้เส้นทางเดิม ภาษาอังกฤษอยู่ที่ /en/ รวมหน้าแรก สัตว์ เมนู กิจกรรม และข้อมูลการเดินทาง ข่าวยังเป็นภาษาไทย ดู [ขอบเขต TH/EN และหลักฐานล่าสุด](docs/review/th-en-2026-09-27/README.md)

เว็บคาเฟ่ A Cup of Zoo ใช้ Astro และมีทางอ่านข้อมูลจาก CMS โปรไฟล์ `acupofzoo` เมื่อเปิดโหมด CMS

## Cloudflare preview

> Deploy รอบใหม่ — 27 ตุลาคม 2026: ใช้บัญชี Cloudflare `Nawaratthinsook@gmail.com` ยืนยันด้วย Wrangler แล้ว และกำหนด `account_id=033dbd2d33d8bb93fcc2930c22752d8a` ใน `wrangler.jsonc` สถานะนี้แทนที่เป้าหมายเตรียมงานก่อนหน้า

ปลายทางบัญชีใหม่: https://a-cup-of-zoo-preview.a-cup-of-zoo-website.workers.dev/ — deploy ล่าสุดจากบรีฟเจ้าของร้านเป็น version `063e6f63-2955-484d-aedd-094ba6194851` เมื่อ 27 ตุลาคม 2026 แทนรอบผูกโดเมน `b79c0298-a47e-40dc-a645-1daa665b7469` โดยคง staging/fixture และ noindex ไว้ ประวัติรอบแรกใช้ version `f4b8abee-cae7-429a-a3d3-adccaf04dbc1`; เคยพบ TLS handshake error ชั่วคราว ก่อนกลับมาใช้งานได้โดยไม่เปลี่ยนการตั้งค่า TLS

โดเมนร้านใช้งานได้ทั้ง https://acupofzoo.com/ และ https://www.acupofzoo.com/ โดยผูก Custom Domain ทั้งสองชื่อกับ Worker นี้โดยตรง ไม่มี redirect ระหว่างสองชื่อ `wrangler.jsonc` เก็บสอง route และ `workers_dev=true` เพื่อคง URL preview ไว้ Cloudflare สร้าง DNS แบบ proxied AAAA `100::` ที่จัดการโดย Worker ให้ทั้งสองชื่อ; แก้ปลายทางผ่าน Custom Domains แทนการเปลี่ยน record ที่ระบบจัดการ

รอบย้ายโดเมน 27 ตุลาคม: CNAME สองรายการเดิมชี้ไป Worker บัญชีเก่าและตอบ 403 จึงสำรองค่าไว้ก่อนนำเฉพาะสองรายการออกและผูกกับบัญชีใหม่ ตรวจผ่าน HTTPS จริงทั้ง Apex/www และหน้าไทย/อังกฤษ เมนู ข้อมูลการเดินทาง รวม 6 เส้นทางต่อโดเมนตอบ 200 พร้อมเนื้อหาที่คาดหมาย รูปส่วนต้นหน้าโหลดได้และ URL workers.dev ยังตอบ 200 หลักฐานในเครื่อง: `tmp/acupofzoo-dns-before.json`, `tmp/acupofzoo-domain-evidence.json`, `tmp/acupofzoo-domain-deploy-final.log` โหมด staging/fixture และ noindex ยังคงเดิม การผูกโดเมนรอบนี้ยังไม่ใช่การเปิด production/CMS

ผลตรวจทานอิสระ: PASS บน config SHA-256 `AB670149DC74B7F8042532E8FABA7EB5FCE2BBD73ED3B2D01F92C505204047B9` ผู้ตรวจได้รับบริบทใหม่และอ่านอย่างเดียวบน filesystem ร่วม โดย Root เป็นผู้แก้ config และดำเนินการย้าย ผู้ตรวจยืนยันหลักฐาน DNS/Worker domains และรันทดสอบ HTTP GET เองครบ 6 เส้นทางต่อ Apex/www/workers.dev รวม 18 เส้นทางผ่านทั้งหมด ส่วนหลักฐานภาพ/วิดีโอและขั้นตอนย้ายเป็นผลที่ Root ส่งให้ตรวจ

ตรวจเว็บที่ deploy จริงผ่าน BrowserOS neo: หน้าหลัก TH/EN 10 เส้นทางและข่าวตอบ HTTP 200 พร้อม `noindex, nofollow`, robots ปิด crawl, sitemap ว่าง และเส้นทางที่ไม่มีอยู่ตอบ 404 รูปในส่วนต้นหน้าแรกและหน้าเมนูโหลดได้ วิดีโอเล่นและหยุดได้ เมนูมี 47 รายการทั้งสองภาษา และกดสลับ TH → EN หลังเลือกหมวดแล้วยังคง `#plant-based` ไม่พบ horizontal overflow ใน viewport ที่ตรวจ ภาพหน้าเมนูได้รับการตรวจด้วย screenshot จริง; ผล responsive หลายขนาดมาจาก browser tests ในเครื่อง

เว็บ preview รอบเดิมอยู่ที่ https://a-cup-of-zoo-preview.suttisak-lukesp.workers.dev/ บนบัญชีเดิม เก็บ URL นี้ไว้อ้างอิงประวัติ ไม่ใช่ปลายทางของบัญชีใหม่ Worker ใช้ชื่อ `a-cup-of-zoo-preview`, `SITE_ENV=staging` และ `CONTENT_MODE=fixture` จึงยังอ่านข้อมูลตัวอย่างในโปรเจกต์ ไม่ได้เชื่อม CMS ที่เผยแพร่บนคลาวด์ หน้าเว็บตั้ง `noindex` และผูกโดเมนร้านตามสถานะรอบล่าสุดด้านบนแล้ว

เตรียมจาก workspace นี้ด้วย:

```sh
bun install
bun run check
bun run test:unit
bun run verify:content
bun run build
bunx wrangler deploy --dry-run
```

รัน `check` และ `build` ตามลำดับ เพราะใช้แคช Astro/Vite ร่วมกัน สร้างโปรไฟล์บัญชีใหม่ครั้งแรก แล้วผูกกับโฟลเดอร์โปรเจกต์นี้โดยไม่เปลี่ยนบัญชี default ของโปรเจกต์อื่น:

```sh
bunx wrangler auth create nawaratthinsook --scopes account:read user:read workers:write workers_scripts:write workers_routes:write
bunx wrangler auth activate nawaratthinsook
bunx wrangler whoami
```

โปรไฟล์ `nawaratthinsook` ถูกสร้างและผูกกับ workspace นี้แล้ว จึงไม่ต้องสร้างซ้ำก่อน deploy ครั้งต่อไป ในเครื่องใหม่ให้ทำขั้นตอน OAuth ด้านบนด้วย `Nawaratthinsook@gmail.com` และตรวจว่า `whoami` ยืนยันอีเมลกับ account ID ตรงกับ `wrangler.jsonc` จากนั้นเผยแพร่ preview ด้วย:

```sh
bun run build
bunx wrangler deploy --profile nawaratthinsook
```

Astro สร้าง `dist/server/wrangler.json` และ Wrangler อ่านผ่าน `.wrangler/deploy/config.json` ให้อัตโนมัติ ไม่ต้องแก้ไฟล์ที่สร้างเหล่านี้ โปรไฟล์เก็บ credentials ในเครื่องและไม่มี credentials อยู่ใน repository คำเตือน missing OAuth scopes จาก `whoami` แสดงสิทธิ์ของบริการอื่นที่ไม่ได้ขอในรอบนี้; คำสั่ง deploy Workers สำเร็จด้วยสิทธิ์ที่ระบุไว้

ตรวจความพร้อมในเครื่องรอบ 27 ตุลาคม: Astro 63 ไฟล์ไม่มี diagnostics, unit tests 22 ผ่าน / 246 assertions, browser tests 30 ผ่าน, content verification ไม่มีรายการ invalid, build และ Wrangler dry run ผ่าน ข้อมูล `displayName` และ `parkingNote` ยังรอการยืนยันตามรายงานเดิม ผลทดสอบในเครื่องแยกจากการตรวจ URL ที่เผยแพร่จริง บันทึก deploy ในเครื่องอยู่ที่ `tmp/cloudflare-deploy-nawaratthinsook.log`

การติดตั้ง dependency ต้องมี `../CMS-Platform-acupofzoo/packages/client` ในเครื่อง เพราะแพ็กเกจ client ยังอ้างผ่าน `file:` จึงยังไม่พร้อมสำหรับ Cloudflare Git build จาก repository เดี่ยว หากจะเปิด production ต้องมี CMS URL ที่เข้าถึงได้จาก Cloudflare ตั้ง `CONTENT_MODE=cms`, `CMS_BASE_URL`, `SITE_ENV=production` และแก้ `site` ใน `astro.config.mjs` จาก `.invalid` เป็นโดเมนจริงก่อน canonical, sitemap และข้อมูลร้านจะใช้โดเมนจากจุดเดียวกัน โดยโค้ดปฏิเสธ fixture ใน production

## SEO ระหว่างเตรียมเว็บไซต์

คง `noindex` และ robots ที่ปิดการ crawl สำหรับ local/staging ตามเดิม มี title/description แยกตามหน้า, Open Graph, Twitter Card และ structured data ร้านกาแฟแล้ว ดูสิ่งที่ทำและงานก่อนเปิดจริงใน [SEO readiness](docs/seo-readiness.md)

## เปิดหน้าเว็บด้วยข้อมูลตัวอย่าง

ธีม boutique ล่าสุดพร้อมภาพตรวจมือถือ/desktop และขอบเขตการทดสอบอยู่ใน [บันทึกตรวจธีม](docs/review/boutique-2026-09-27/README.md) ยังไม่ได้ deploy ธีมชุดนี้

```sh
bun install
bun run dev
```

เปิด http://127.0.0.1:4321

โหมดนี้ตั้ง `CONTENT_MODE=fixture` ข้อมูลมาจากไฟล์ตัวอย่างในเครื่อง ไม่ใช่จาก CMS

## เชื่อม CMS ในเครื่อง

CMS อยู่ใน worktree `../CMS-Platform-acupofzoo` สาขา `acupofzoo-local-prototype` ไม่ใช่ working tree เดิมของ CMS-Platform

```sh
bun run --cwd ../CMS-Platform-acupofzoo dev:api:acupofzoo
bun run --cwd ../CMS-Platform-acupofzoo/apps/api db:migrate:bun:acupofzoo
bun run --cwd ../CMS-Platform-acupofzoo/apps/api seed:acupofzoo:local
bun run --cwd ../CMS-Platform-acupofzoo dev:admin:acupofzoo
```

จากนั้นเปิดเว็บด้วย

```sh
CONTENT_MODE=cms CMS_BASE_URL=http://127.0.0.1:8787 bun run dev
```

บน Windows PowerShell:

```powershell
$env:CONTENT_MODE="cms"; $env:CMS_BASE_URL="http://127.0.0.1:8787"; bun run dev
```

แอดมินอยู่ที่ http://localhost:5173 หน้าข้อมูลร้านใช้บันทึกร่างก่อน แล้วค่อยเผยแพร่ หน้าเว็บอ่านเฉพาะชุดที่เผยแพร่แล้ว

## ตรวจ

เมนูและกิจกรรมแบบ native: รายการอาหารอยู่ที่ `src/lib/content/menu-catalog.ts`, แพ็กเกจและกิจกรรมอยู่ที่ `src/lib/content/activities-catalog.ts` ภาพเก็บใน `src/assets/food-menu/` ดูแหล่งข้อมูล ขอบเขต และข้อยกเว้นใน [บันทึกนำเข้าเมนู](docs/menu-import.md) ไม่ต้องใช้ Heyzine ในหน้าเว็บ

```sh
bun run check
bun run test:unit
bun run test:e2e
bun run build
bun run verify:content
```
