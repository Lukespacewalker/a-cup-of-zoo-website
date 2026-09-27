# A Cup of Zoo

> ภาษาไทยใช้เส้นทางเดิม ภาษาอังกฤษอยู่ที่ /en/ รวมหน้าแรก สัตว์ เมนู กิจกรรม และข้อมูลการเดินทาง ข่าวยังเป็นภาษาไทย ดู [ขอบเขต TH/EN และหลักฐานล่าสุด](docs/review/th-en-2026-09-27/README.md)

เว็บคาเฟ่ A Cup of Zoo ใช้ Astro และมีทางอ่านข้อมูลจาก CMS โปรไฟล์ `acupofzoo` เมื่อเปิดโหมด CMS

## Cloudflare preview

เว็บ preview อยู่ที่ https://a-cup-of-zoo-preview.suttisak-lukesp.workers.dev/ บน Cloudflare Workers ใช้ `SITE_ENV=staging` และ `CONTENT_MODE=fixture` จึงยังอ่านข้อมูลตัวอย่างในโปรเจกต์ ไม่ได้เชื่อม CMS ที่เผยแพร่บนคลาวด์ หน้า preview ตั้ง `noindex` และยังไม่ได้ผูกโดเมนร้าน

ปรับ Worker ที่ `wrangler.jsonc` และ deploy จาก workspace นี้ด้วย:

```sh
bun install
bun run deploy:preview
```

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
