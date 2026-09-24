# A Cup of Zoo

เว็บตัวอย่างในเครื่องของคาเฟ่ A Cup of Zoo ใช้ Astro และอ่านข้อมูลจาก CMS โปรไฟล์ `acupofzoo` เมื่อสั่งให้เชื่อม

ยังไม่ deploy ไม่ได้เปลี่ยน DNS และยังไม่ใช้ทรัพยากรคลาวด์

## เปิดหน้าเว็บด้วยข้อมูลตัวอย่าง

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

```sh
bun run check
bun run test:unit
bun run test:e2e
bun run build
bun run verify:content
```
