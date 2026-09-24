# A Cup of Zoo: Codex Implementation Plan v0.1

> **สำหรับ Codex:** ใช้ Root-first และ `superpowers:executing-plans` หากมี skill นี้ ทำงานตาม checklist ทีละ task ไม่แจกงานให้ subagent โดยอัตโนมัติ อ่าน AGENTS.md ของ workspace และ CMS ก่อนเริ่ม แผนนี้ให้พัฒนา local prototype ใน Phase 0–2 แล้วหยุดก่อนงาน production

**Goal:** สร้างเว็บไซต์ Astro ของ A Cup of Zoo ที่ทดลองใช้ได้จริงในเครื่อง ใช้รูปที่ลูกค้าส่งมา เชื่อม CMS-Platform เดิม และพิสูจน์วงจรแก้ข้อมูล → ดูตัวอย่าง → เผยแพร่ → เห็นบนเว็บไซต์ โดยยังไม่ deploy หรือเปลี่ยนโดเมนจริง

**Architecture:** แยก Astro frontend ออกจาก `Lukespacewalker/CMS-Platform` ซึ่งเป็นเจ้าของ Admin, API, contracts, domain, persistence และ migrations เว็บไซต์เรียก public CMS API ฝั่งเซิร์ฟเวอร์ผ่าน public client เดิม ใช้ fixture เฉพาะช่วงออกแบบใน local และเปลี่ยนเป็นข้อมูลจาก CMS จริงก่อนปิด Phase 2

**Tech Stack:** Astro + TypeScript, Bun, React/Vite Admin เดิม, CMS Worker API เดิม, Bun SQLite/filesystem สำหรับ local CMS; เป้าหมาย hosting ที่เสนอคือ Cloudflare Workers + Static Assets, D1 และ R2 ส่วนการสร้าง resource และ deploy ต้องอนุมัติแยก

**Spec:** ข้อกำหนดโครงการอยู่ใน §1–§8 ของไฟล์นี้ เป็น implementation baseline สำหรับทดลอง ไม่ใช่การอนุมัติราคา/สัญญาหรือ full production scope เอกสาร Scope/Requirements/Budget v0.1 ก่อนหน้าเป็นข้อมูลประกอบ ไม่ต้องนำส่วนงบมาใส่เว็บไซต์

**วันที่:** 23 กันยายน 2026

**สถานะ:** แผนส่งต่อให้ Codex; ยังไม่ได้สร้างเว็บไซต์ รัน tests/build หรือ deploy จากแผนนี้

**แหล่งข้อมูลร่วมไฟล์:** `reference-data/business-evidence.json`, `reference-data/asset-manifest.json`, `reference-assets/`

## Global constraints

- CMS ต้องเป็น `Lukespacewalker/CMS-Platform`; frontend ต้องเป็น Astro ห้ามสลับเป็น Next.js, WordPress, Sanity หรือสร้าง Admin ใหม่อีกชุด
- ใช้ Bun ใน CMS ตาม AGENTS.md; snapshot ที่ตรวจระบุ `bun@1.3.14` ใน packageManager ตรวจเวอร์ชันของ checkout จริงก่อนรัน ไม่อัปเกรด dependency ทั้ง monorepo เพื่อทำเว็บนี้
- ใช้ภาษาไทยเป็นหลัก ชื่อแบรนด์บนเว็บไซต์เป็น “A Cup of Zoo” ไม่ใส่ Quack & Honk เป็นแบรนด์ของร้าน และไม่เปลี่ยนมาสคอตร้านเป็นเป็ด/ห่านของบริษัทผู้พัฒนา
- หน้าเว็บต้องมี HTML ของเนื้อหาหลัก ไม่ทำ public site เป็น React SPA ทั้งเว็บ
- เริ่ม local เท่านั้น: bind localhost ไม่เปิด tunnel, ไม่สร้าง GitHub repo, ไม่ push, ไม่เชื่อม CI ที่ deploy อัตโนมัติ, ไม่ใช้ `--remote`, ไม่ซื้อแพ็กเกจ, ไม่แก้ DNS และไม่แตะ production
- โค้ด CMS ใช้ร่วมกันได้ แต่โปรไฟล์ ฐานข้อมูล ไฟล์ local และ future D1/R2 ต้องแยกของ `acupofzoo`; ห้ามนำ IDs, tokens หรือ default project ของลูกค้ารายอื่นมาใช้
- ใช้รูปที่ได้รับเป็นหลัก ไม่สร้างรูปสัตว์/สถานที่จำลองมาสื่อว่าเป็นสถานที่จริง ไม่คัดลอกรูปจากผู้รีวิว และไม่ลบลายน้ำ
- ไม่แต่งค่าเข้า ชื่อสัตว์รายตัว สายพันธุ์ ราคาเมนู เวลาเล่นสัตว์ คำรับรองความปลอดภัย คะแนนรีวิว หรือข้อมูลเส้นทาง
- ห้ามอ้างว่าข้อมูลยืนยันจาก Facebook/Maps แล้วเมื่ออ่านไม่ได้ ให้เก็บสถานะ provisional และระบุข้อจำกัด
- ห้ามถือว่าผู้ใช้อนุมัติ Cloudflare หรือการเปิด public จากคำว่า “ลองทำ”; การอนุมัติครั้งนี้ใช้สำหรับแผนและคำสั่งทดลองเท่านั้น
- ห้ามแก้ประวัติ migration เดิม ให้เพิ่มไฟล์ลำดับถัดไปหลังตรวจ checkout ปัจจุบัน และใช้ migration กับ local database ของร้านนี้เท่านั้น
- เก็บ secret ฝั่งเซิร์ฟเวอร์ ไม่ฝังใน Astro PUBLIC_* variables, HTML, logs หรือ client bundle

## Review focus

1. Facebook/Maps อ่านไม่ได้หรือให้ข้อมูลขัดกัน: UI ต้องไม่สร้างข้อเท็จจริงแทน; ครอบคลุม Task 1 และ Task 8
2. บันทึกข่าวที่เผยแพร่แล้ว: เวอร์ชันที่ public เห็นต้องไม่เปลี่ยนก่อน Publish; ครอบคลุม Task 6
3. มี cache หลายชั้นหลัง archive: ข่าวต้องไม่กลับมาจาก fallback หรือ stale cache; ครอบคลุม Task 7
4. ภาพมีข้อความ โลโก้ติดมา หรือมีเด็กในภาพ: เลือกใช้โดยไม่ครอปใบหน้า/ข้อความผิดและไม่เผยภาพบุคคลเป็น default; ครอบคลุม Task 3 และ Task 8
5. CMS ล่ม โปรไฟล์ผิด หรือไม่มี CMS checkout: UI ไม่ล่มทั้งหน้า ไม่อ่านข้อมูลลูกค้ารายอื่น และรายงานสิ่งที่ยังไม่ได้เชื่อมตรงไปตรงมา; ครอบคลุม Task 0, Task 2, Task 4 และ Task 7

---

## 1. ความเข้าใจงานและการแบ่ง milestone

ผู้ว่าจ้างต้องการเว็บไซต์สวยเพื่อแนะนำคาเฟ่สไตล์ญี่ปุ่นและสัตว์ พร้อม SEO และข่าวที่เจ้าของอัปเดตเองได้ ต้นเลือก CMS ของทีมและ Astro แล้ว ข้อมูลการเปิดและการเดินทางให้อ้างจาก Facebook ร้านและ Google Maps โดยไม่เพิ่มระบบดึงข้อมูลอัตโนมัติใน production

เป้าหมายรอบแรกไม่ใช่สร้างแพลตฟอร์มใหญ่ให้ครบทุกอย่าง แต่ให้เห็นเว็บไซต์จริง และพิสูจน์การเชื่อม CMS เดิมอย่างน้อยในงานข่าวและข้อมูลการมาเที่ยว

| Milestone | ผลลัพธ์ | วิธีดำเนินการ |
| --- | --- | --- |
| Phase 0: ตรวจ workspace และข้อมูล | แผนที่ไฟล์จริง baseline tests รายการข้อมูลที่ตรวจได้/ยังขาด | ทำก่อนแก้โค้ด |
| Phase 1: Visual prototype | Astro ครบ 6 หน้าหลักและหน้าข่าว ใช้ภาพจริง มี seed mode ที่ชัดเจน | ถ่าย screenshot ให้เห็นผลงานก่อนงานหลังบ้านยาว |
| Phase 2: Connected local prototype | CMS โปรไฟล์ acupofzoo + ข่าว + ข้อมูลร้าน + สื่อ เชื่อมเว็บจริงใน local | เป้าหมายเริ่มต้นของคำสั่งท้ายไฟล์ แล้วหยุด |
| Phase 3: Client-ready release | ผู้ใช้รายบุคคล editor ที่เจ้าของใช้สะดวก CRUD ทุกส่วน ตรวจหลักฐานธุรกิจ และ Cloudflare staging | ต้องทบทวนขอบเขตและอนุมัติเริ่มแยก |
| Phase 4: Production launch | domain/DNS, migration จริง, UAT, backup/restore, deploy และ handover | ต้องอนุมัติ deployment แยก ห้ามทำต่ออัตโนมัติ |

Phase 1 เป็น checkpoint ให้เห็นหน้าตา ไม่ใช่เหตุให้หยุดที่ mockup หาก CMS checkout ใช้งานได้ ให้ทำต่อ Phase 2 ตามคำสั่งเริ่มงาน แต่ไม่รอการตรวจภาพจากเจ้าของทุก component ยกเว้นมีการเปลี่ยนทิศทางใหญ่จากบรีฟ

หากไม่มีสิทธิ์หรือ checkout CMS: ทำ Phase 1 ให้จบพร้อม contract adapter และรายงาน blocker อย่างเจาะจง ห้ามสร้าง CMS สำรองเอง ห้ามกล่าวว่าเชื่อม CMS สำเร็จ

## 2. Scope สำหรับ prototype และสิ่งที่ไม่ทำ

### 2.1 Routes ที่ต้องมี

| Route | เนื้อหา | แหล่งข้อมูลเมื่อจบ Phase 2 |
| --- | --- | --- |
| `/` | Hero, สัตว์เด่น, กิจกรรม, คาเฟ่/อาหาร, ข่าวล่าสุด, ข้อมูลมาเที่ยว, CTA | CMS venue content + published posts |
| `/animals/` | สัตว์/กลุ่มสัตว์ที่ร้านมี ภาพและคำอธิบาย ไม่กำหนดกิจกรรมที่ไม่มีหลักฐาน | CMS venue content |
| `/activities/` | พื้นที่และกิจกรรมที่ยืนยันแล้ว ไม่แต่งรอบหรือค่าใช้จ่าย | CMS venue content |
| `/menu/` | อาหาร ขนม เครื่องดื่มแบบแนะนำ ไม่มีตะกร้าหรือสั่งซื้อ | CMS venue content |
| `/visit/` | เวลาเปิด พื้นที่ตั้ง โทร เส้นทาง ข้อควรรู้ และคำถามที่มีคำตอบยืนยัน | CMS venue content |
| `/news/` | ข่าวจริงที่ published หรือ empty state ที่ออกแบบดี | CMS posts |
| `/news/[slug]/` | บทความผ่าน template เดียว เนื้อหา render server-side | CMS published posts |
| `/404` และ URL ไม่พบจริง | หน้าที่ไม่พบและทางกลับเว็บไซต์ | Astro 404 behavior ต้องทดสอบ HTTP |

ไม่ทำหน้าว่างเพื่อเติมเมนูให้ครบ ไม่มี link `#` ที่ไม่มี action ไม่ใส่ privacy policy ที่อ้างว่าตรวจโดยผู้เชี่ยวชาญแล้ว หากยังไม่มีข้อความอนุมัติ ไม่เก็บข้อมูลผ่านฟอร์มสาธารณะและไม่ฝัง analytics ที่ติดตามบุคคลในรอบทดลอง

### 2.2 Content quantity

ตัวเลข 12 สัตว์, 6 กิจกรรม, 12 เมนู และ 5 ข่าวจาก scope เดิมเป็นเพดานงานลงข้อมูลเพื่อคุยราคา ไม่ใช่คำสั่งให้แต่งข้อมูลเติมให้ครบ ใน prototype ใช้เท่าที่มีหลักฐานจริง

ภาพที่ได้รับมีสุนัข แมว เป็ด บ่อปลา อาหาร เครื่องดื่ม และบรรยากาศร้าน จากบรีฟมีแพะและจิ้งจอก แต่ยังไม่มีภาพสัตว์จริงที่เหมาะสมครบทุกชนิด อย่าใช้รูปปั้นหรือมาสคอตแทนภาพจิ้งจอกจริงโดยไม่อธิบาย

ข่าวทดสอบที่ใช้พิสูจน์ Publish ให้ใช้ชื่อ “ข่าวตัวอย่างสำหรับทดสอบระบบ” ใน local และมี `demo` marker เพื่อกันออกจาก production seed ไม่สร้างโพสต์โปรโมชั่นสมมติที่ดูเหมือนร้านประกาศจริง

### 2.3 Out of scope ใน Phase 0–2

กล้องไลฟ์, streaming infrastructure, จอง/ชำระเงิน/POS, สมาชิก, ระบบซื้อสัตว์, หลายภาษา, สร้างมาสคอตใหม่, 3D, page builder, social scraping/sync, Google Maps paid API, import reviews, AI เขียนข่าวอัตโนมัติ และการแก้ CMS ทั้งแพลตฟอร์มแบบไม่เกี่ยวกับงาน

ไม่แสดงเมนู Live/ปุ่มจองถ้ายังไม่มีบริการจริง ไม่ทำ widget “เปิดอยู่ตอนนี้” ในรอบแรก เพราะต้องยืนยันวันพิเศษและนโยบายข้อมูลก่อน ใช้ตารางเวลาและข้อความวันหยุดแทน

## 3. ข้อเท็จจริงและการอ้างอิง Facebook/Google Maps

### 3.1 สถานะข้อมูล ณ วันที่ทำแผน

- แหล่ง Google Maps ที่ผู้ใช้ให้: `https://maps.app.goo.gl/A6AVc2ScgEJwSrbVA`
- หน้า Facebook ที่ค้นพบเป็น candidate: `https://www.facebook.com/Acupofzoocafe/`
- เว็บไซต์เดิมที่ผู้ใช้ให้: `https://acupofzoo.com/`
- การตรวจครั้งนี้เปิดรายละเอียด Maps ไม่สำเร็จ หน้า Facebook ตอบว่าถูกบล็อก และเว็บเดิมให้หน้า redirect โดยไม่มีข้อมูลที่อ่านได้เพียงพอ จึง **ยังไม่ได้ยืนยันข้อมูลปัจจุบันโดยตรงจาก Facebook หรือ Maps**
- ข้อมูลชื่อร้าน คลอง 6 ปทุมธานี โทร 098 983 8037 และเวลา 10:00–19:00 ปิดอังคารยกเว้นวันหยุดนักขัตฤกษ์ มาจากข้อความบรีฟที่ผู้ใช้ส่ง ไม่ใช่ผลการตรวจล่าสุดจากแพลตฟอร์ม

### 3.2 ขั้นตอนตรวจข้อมูลของ Codex

1. ใช้ browser/web tools ที่ workspace มี เปิดเพจร้านและลิงก์ Maps โดยวิธีปกติ หากมีการล็อกอินหรือ block ให้บันทึกและหยุด ไม่พยายามเลี่ยง access control
2. ยืนยันว่าเพจเป็นร้านเดียวกันด้วยชื่อ เบอร์โทร แบรนด์ และพื้นที่ตั้ง ไม่เลือกจากชื่อใกล้เคียงหรือเพจ Family โดยอัตโนมัติ
3. อ่าน About/ข้อมูลร้านและประกาศล่าสุดที่เกี่ยวกับเวลาเปิด รวมทั้งรายการธุรกิจ Maps ที่ลิงก์พาไป
4. เก็บ field, value, source URL, วันที่ตรวจ, วันที่ของประกาศถ้ามี, ข้อจำกัด และผู้อนุมัติ โดยแยกแต่ละ claim
5. ถ้าข้อมูลขัดกัน: ใช้ประกาศร้านที่ระบุวันที่แน่นอนสำหรับข้อยกเว้นวันนั้น ส่วนเวลาเปิดปกติที่ขัดกันให้เจ้าของยืนยัน ไม่เลือกเองหรือผสมค่าระหว่างสองแหล่ง
6. หากอ่านไม่ได้ ให้ใช้ค่าจากบรีฟใน local ภายใต้ป้าย prototype และคง `verificationStatus: user_provided` ห้ามเปลี่ยนเป็น `verified`
7. พิกัด latitude/longitude, ที่อยู่เต็ม, place ID, ถนน/ซอย, ค่าจอดรถ, รถสาธารณะ และเวลาเดินทาง ให้เป็น null/ไม่แสดงจนตรวจได้ อย่าประมาณระยะทางจากพื้นที่ตั้ง
8. ก่อน production ต้องมีเจ้าของยืนยันข้อมูลสำคัญ โดยเก็บวันยืนยัน ไม่ต้องทำระบบดึง Facebook/Maps ทุกครั้งที่คนเปิดเว็บไซต์

### 3.3 Seed policy

ค่าที่ใช้เริ่มทดลองได้จากบรีฟ:

| Field | ค่า provisional | Public behavior ก่อนยืนยัน |
| --- | --- | --- |
| displayName | A Cup of Zoo | ใช้ได้ใน local |
| locationLabel | คลอง 6 ปทุมธานี | ไม่เติมที่อยู่เต็ม |
| phoneDisplay / phoneE164 | 098 983 8037 / +66989838037 | ปุ่ม `tel:` เปิดหมายเลขนี้ |
| regularHours | จันทร์ พุธ พฤหัสบดี ศุกร์ เสาร์ อาทิตย์ 10:00–19:00; อังคารปิด | แสดงเป็นเวลาตามข้อมูลที่ได้รับ มีหมายเหตุในหน้า visit |
| holidayNote | วันอังคารที่ตรงกับวันหยุดนักขัตฤกษ์เปิดตามข้อมูลจากบรีฟ | เป็นข้อความ ไม่ auto-generate วันที่เปิดพิเศษ |
| mapsUrl | ลิงก์ที่ผู้ใช้ให้ | เปิด external link ไม่สร้างแผนที่สมมติ |
| admissionPrice | null | แสดง “สอบถามค่าเข้าชมและเงื่อนไขกับทางร้าน” ไม่แสดง 0 บาท |
| addressLine / coordinates / placeId | null | ไม่ใส่ใน schema.org และไม่สร้าง navigation parameters |
| facebookUrl | candidate ใน evidence เท่านั้น | ยังไม่เปิด CTA นี้จนยืนยันว่าเป็นเพจร้าน |

`reference-data/business-evidence.json` เป็นหลักฐานการตั้งต้น ไม่ใช่ production CMS และไม่ต้องส่งรายละเอียดตรวจสอบภายในออก public API

## 4. Visual specification

### 4.1 แนวทางที่ให้ทำ

Japanese garden + warm café + real animals: น่ารักแต่ไม่รก ภาพสถานที่และสัตว์จริงเป็นหลัก ใช้รูปทรงโค้ง วงรี และรายละเอียดเล็กน้อยจากบรรยากาศร้าน ไม่ทำหน้าตา dashboard/SaaS template

สีเสนอ: warm cream `#FFF8EC`, forest green `#234A37`, leaf green `#78985D`, warm orange `#D77B43`, dark cocoa `#302B25` ใช้สีเป็น design tokens และตรวจ contrast ก่อนใช้กับตัวหนังสือเล็ก สีเหล่านี้เป็นข้อเสนอ UI ไม่ใช่ brand guideline ที่ลูกค้ารับรองแล้ว

ใช้ฟอนต์ไทยที่อ่านง่ายและมีสิทธิ์ใช้เว็บ เช่น Noto Sans Thai หรือชุดที่มีใน repo ตรวจ license และโหลดเฉพาะน้ำหนักที่ใช้ ไม่ส่งไฟล์ฟอนต์จากสภาพแวดล้อมแชตไปให้ผู้ใช้ เก็บ body text อย่างน้อย 16px และเว้นบรรทัดพอสำหรับภาษาไทย

### 4.2 หน้าแรก

1. Header โลโก้ที่ได้รับหรือ wordmark ชั่วคราว “A Cup of Zoo” พร้อม 5–6 links และ CTA มาเที่ยว
2. Hero ใช้ภาพมุมนั่งริมสวนเป็นฐาน มีภาพแมว/เป็ดประกอบเป็น collage อย่างพอดี
3. ข้อความตัวอย่าง: “วันพักผ่อนเล็ก ๆ กับเพื่อนขนฟู” และข้อความตรงไปตรงมาว่าเป็นคาเฟ่สัตว์สไตล์ญี่ปุ่น คลอง 6 ปทุมธานี
4. CTA หลัก “วางแผนมาเที่ยว” ไป `/visit/`; CTA รอง “ดูเส้นทาง” ไป Maps link ที่ได้รับ
5. Quick info ชื่อพื้นที่ เวลาเปิดปกติ และช่องทางติดต่อ จากข้อมูลเดียวกับหน้า visit
6. Featured animals ที่มีภาพจริง + link ดูเพิ่ม
7. Activities ใช้ภาพและคำอธิบายยืนยันได้ ไม่อ้างว่าสัมผัสหรือให้อาหารสัตว์ได้ทุกตัว
8. Café & treats ใช้ภาพเครื่องดื่มและขนมที่ได้รับ ไม่เดาชื่อสูตรหรือราคา
9. Latest news แสดงเฉพาะข่าว published; ถ้าไม่มีไม่ใส่ placeholder cards ให้เขียน empty state สั้น ๆ
10. Visit CTA + footer ที่มีชื่อร้าน โทร และเส้นทาง

สลับองค์ประกอบภาพเต็ม กริด และเนื้อหาแบบ editorial ไม่ทำทุก section เป็นกล่องขนาดเท่ากันทั้งหมด ไม่ใช้ gradient ม่วง/ฟ้าและ icon สำเร็จรูปเป็นพระเอก

### 4.3 รูปที่ให้และวิธีใช้

ดู `asset-manifest.json` ซึ่งมีชื่อไฟล์ใหม่ ขนาดและ hash ครบ:

- `cafe-garden-seating.png`: เหมาะกับ hero/café section; ตรวจการ crop บนมือถือด้วย
- `cat-portrait.png`: ภาพแมวเด่นของหน้า animals/hero collage
- `ducks-pond.png`: ภาพเป็ด/บรรยากาศน้ำ
- `cafe-interior-gallery.png`: เรื่องบรรยากาศในร้าน
- `drinks.png`, `croissant.png`: หน้า menu แบบภาพจริง
- `cats-and-dog.png`: สัตว์ที่มีรูปอยู่ ไม่ตั้งชื่อหรือสายพันธุ์เอง
- `entrance-promo-banner.png`, `pond-promo-graphic.png`: มีข้อความและกราฟิกติดมา เหมาะอ้างอิงแนวทางหรือ gallery ไม่ใช้เป็น background ที่มีข้อความเว็บทับจนอ่านไม่ได้
- `child-with-dogs-reference.png`: มีเด็กในภาพ ให้เก็บเป็น reference เท่านั้นและไม่ใช้บนหน้าเว็บเริ่มต้น รอผู้รับผิดชอบยืนยันสิทธิ์เผยแพร่

ไม่ตัดลายน้ำออก ไม่เก็บรูปต้นฉบับทั้งหมดไว้ใน public/ โดยอัตโนมัติ คัดภาพที่อนุญาตให้ใช้ใน prototype มาสร้าง derivatives ส่วน originals คงใน reference-assets นอก output เว็บไซต์

เมื่อยังไม่มี logo ต้นฉบับ ให้ใช้ wordmark ที่อ่านง่าย ไม่ crop โลโก้มุมเล็กให้แตก และไม่สร้างตัวละครใหม่มาแทนโลโก้จริง

### 4.4 Interaction/accessibility

เมนูมือถือกดเปิด/ปิดได้ คีย์บอร์ดใช้ได้ Esc ปิดได้ focus ไม่หาย มี skip link และ semantic landmarks ปุ่มสัมผัสขั้นต่ำ 44×44 CSS px ไม่ autoplay เสียง/วิดีโอ ไม่ scroll-jack และรองรับ `prefers-reduced-motion`

ตรวจอย่างน้อย 320, 390, 768, 1440px ห้ามมี horizontal overflow จาก collage, Thai headings หรือแถบ CTA กำหนดความสูงส่วนล่างเผื่อ sticky CTA และ safe-area บนมือถือ

## 5. Architecture และขอบเขต repository

### 5.1 ข้อเท็จจริงที่ตรวจจาก CMS

ตรวจ main commit `2a0d7a6bfefb898d8de327c086aa9dfdd5cad1d5` ผ่าน GitHub เมื่อ 23 กันยายน 2026 ให้ Codex ตรวจ HEAD ใหม่ก่อนเริ่มเพราะ checkout อาจเดินต่อแล้ว

- README กำหนดให้ CMS owns API/Admin/MCP/contracts/migrations ส่วน consumer owns public site และ CMS client integration
- Admin เป็น React/Vite; API รองรับ Worker และ local Bun composition
- มี `createCmsClient({ baseUrl, fetch? })` ที่คืน `{ request }` อยู่จริง ไม่ได้มี `.posts.list()` หรือ `.getVenue()` อยู่แล้ว
- Public posts route ปัจจุบันคือ `/api/public/posts?locale=th&limit=25` และ `/api/public/posts/{slug}?locale=th`
- ที่ snapshot นี้ public posts ตอบ `cache-control: public, max-age=60, stale-while-revalidate=300` ต้องไม่สมมติว่าบวกกับ cache อีกชั้นแล้วยังอัปเดตภายใน 5 นาทีเสมอ
- `Post.update()` ปัจจุบันเปลี่ยนเนื้อหาโดยคง status เดิม ต้องพิสูจน์และแก้ draft/publication boundary แบบไม่ทำลายผู้ใช้ CMS เดิม
- การเรียก Admin เดิมใช้ token ใน localStorage; local developer workflow ใช้ทดลองได้ แต่ไม่ใช่ client-ready auth และห้ามเปิดให้คนทั่วไปเข้า

อ้างอิงไฟล์ [R1–R8] ในท้ายแผน ทั้งหมดคือการอ่าน source ไม่ใช่ผลทดสอบ runtime

### 5.2 Frontend workspace

หา frontend repository ที่เปิดใน Codex ก่อน ชื่อ repo ใหม่ยังไม่ได้รับการยืนยัน ห้ามสมมติว่ามี `Lukespacewalker/A-Cup-of-Zoo` หรือสร้าง remote repo เอง

ถ้าเป็น workspace frontend ว่าง ให้ scaffold Astro ใน workspace นั้น หากเปิดอยู่ใน CMS-Platform ให้ใช้ sibling frontend workspace ที่ผู้ใช้เตรียมหรือขอเส้นทางก่อน ห้ามวาง `src/pages` ของร้านไว้ใน monorepo CMS โดยไม่มีคำสั่ง

ใช้ Astro server rendering สำหรับ CMS pages เมื่ออยู่โหมด API และ static assets สำหรับรูป/css/js หลีกเลี่ยงการบังคับ SPA fallback จน path ที่ไม่พบตอบ 200

### 5.3 Content modes

- `CONTENT_MODE=fixture`: local design เท่านั้น อ่านข้อมูลตัวอย่างผ่าน interface เดียวกับ API มี prototype banner และ noindex
- `CONTENT_MODE=cms`: server-side เรียก CMS URL ที่กำหนด explicit; ห้าม fallback ไป fixture อัตโนมัติ
- `SITE_ENV=local|staging|production`: default เป็น local; production ต้อง reject fixture mode และ demo content
- ไม่มี `PUBLIC_ADMIN_TOKEN`, `PUBLIC_MCP_TOKEN`, auto-discovery of production CMS หรือ connection ไป default tenant

ใน Phase 2 seed จากข้อมูลที่เตรียมไว้เข้าสู่ **local acupofzoo CMS เพียงครั้งแรก** หลังจากนั้นแก้ CMS แล้วเว็บอ่านค่าที่แก้จริง ไม่ re-seed ทุกครั้งที่ startup และไม่เขียนค่าจาก frontend กลับทับ CMS

### 5.4 CMS additions ที่จำเป็น

Reuse `posts` และ `media` เดิม เพิ่มโปรไฟล์ `acupofzoo` และ module `venue-content` แบบมี schema ตายตัวสำหรับร้านหนึ่งแห่ง ไม่ทำ generic CMS builder

สำหรับ prototype ใช้หนึ่ง typed venue document มี business info, animals, activities, menu highlights และ FAQ ขนาดเล็ก โดยมี draft JSON กับ published snapshot ที่ validate ด้วย contracts เดียวกัน เป็น bounded document ที่มีฟิลด์ระบุแน่นอน ไม่ใช่ช่อง arbitrary JSON ให้เจ้าของกรอก

Phase 2 มี UI แก้ business info/hours/contacts และข่าว ส่วนรายการสัตว์/กิจกรรม/เมนู seed ผ่าน application layer ใน CMS ได้ก่อน UI จัดการทุก collection เป็นงาน Phase 3 ไม่อ้างว่าส่งมอบ full CRUD แล้ว

ต้องรองรับทั้ง Bun SQLite/filesystem local adapters และ D1/R2-compatible boundaries ไม่สร้าง SQL client หรือ file writer ใน Astro

### 5.5 การเผยแพร่และ cache

Draft ไม่ออก public API; public reads อ่าน snapshot ที่ publish แล้วเท่านั้น Archive ลบออกจาก public response ไม่ hard-delete ประวัติ

รอบแรกให้ HTML และ API ของโปรไฟล์ acupofzoo ใช้ `Cache-Control: no-store` เพื่อพิสูจน์ความถูกต้องของ Publish/Archive ก่อน ไม่เปลี่ยน cache policy ของลูกค้ารายอื่น global

หลังผ่าน behavior แล้ว Phase 3 ค่อยเพิ่ม edge cache แบบระบุ end-to-end freshness ไม่เกิน 300 วินาที พร้อมทดสอบ invalidation จริง ไม่เพิ่ม stale windows ซ้อนกัน ไม่มี stale fallback ของข่าว archived

สื่อสาธารณะใช้ immutable object keys สำหรับรูปเวอร์ชันใหม่ ไม่เขียนทับ key เดิมเมื่อเปลี่ยนรูป เพื่อเลี่ยงรูปเก่าค้าง ส่วน media ที่อัปโหลดเพื่อร่างไม่ถือว่า private โดยอัตโนมัติ เพราะ route สื่อเดิมเป็น public ต้องกำหนด media privacy ใน production gate แยกจาก draft text

### 5.6 Runtime errors

ถ้า CMS timeout/network error: หน้าเว็บยังมี header/footer และข้อความ “ขณะนี้โหลดข้อมูลส่วนนี้ไม่ได้” ไม่แสดงว่า “ไม่มีข่าว” และไม่แสดง seed news เป็นข่าวจริง

กำหนด timeout ฝั่ง CMS fetch เช่น 3 วินาที ไม่ retry ไม่จำกัดเวลา ข้อมูลไม่พบจริงเป็น 404 แต่ service unavailable เป็น 503 สำหรับหน้ารายละเอียดที่ต้องใช้ CMS ไม่แปลงทุก error เป็น 404

## 6. Interfaces ที่เสนอให้สร้าง

ชื่อต่อไปนี้เป็น **API/contract ที่ต้องเพิ่ม** ไม่ใช่สิ่งที่มีใน repository แล้ว หาก checkout มี equivalent ที่ดีกว่า ให้ reuse และบันทึก mapping ใน execution note ไม่สร้างของซ้ำ

### 6.1 Contract ของ venue

สร้าง schema ใน `packages/contracts/src/venue-content.ts` และ export ตามรูปแบบเดิม public client ได้ generated DTO ผ่าน generator เดิมเท่านั้น Frontend view model ไม่ใช่ domain source of truth

```ts
export type VerificationStatus =
  | "user_provided"
  | "source_verified"
  | "owner_confirmed"
  | "unknown";

export type HoursEntry = {
  isoWeekday: 1 | 2 | 3 | 4 | 5 | 6 | 7; // จันทร์ = 1
  closed: boolean;
  opens: string | null;  // HH:mm ตาม Asia/Bangkok
  closes: string | null;
};

export type HoursException = {
  date: string; // YYYY-MM-DD ที่ตรวจว่าเป็นวันจริงแล้ว
  closed: boolean;
  opens: string | null;
  closes: string | null;
  note: string;
};

export type VenueItem = {
  id: string;
  title: string;
  description: string;
  mediaAssetId: string | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
};

export type VenueContentInput = {
  displayName: string;
  locationLabel: string;
  addressLine: string | null;
  phoneE164: string | null;
  mapsUrl: string | null;
  facebookUrl: string | null;
  timezone: "Asia/Bangkok";
  regularHours: HoursEntry[];
  hoursExceptions: HoursException[];
  holidayNote: string | null;
  hoursVerification: VerificationStatus;
  admissionText: string | null; // ยังไม่ยืนยัน ไม่ใช่ราคา 0
  animals: VenueItem[];
  activities: VenueItem[];
  menuHighlights: VenueItem[];
  faqs: Array<{ id: string; question: string; answer: string }>;
};

export type VenueContentAdminDto = {
  id: "venue";
  version: number;
  draft: VenueContentInput;
  published: VenueContentInput | null;
  publishedVersion: number | null;
  publishedAt: string | null;
};

export type PublicVenueDto = {
  id: "venue";
  version: number;
  content: VenueContentInput;
  publishedAt: string;
};
```

ต้อง resolve `mediaAssetId` ผ่าน media repository/public URL metadata ที่มีอยู่จริง ไม่สร้างไฟล์ `image.jpg` สมมติ public API ไม่ส่ง draft, internal evidence, actor secrets หรือ private metadata

Validation: HTTPS สำหรับ Maps/Facebook; แยก allowlist ของลิงก์แต่ละประเภท; E.164; ไม่อนุญาต weekday ซ้ำ; opens/closes เป็นคู่และ opens < closes สำหรับธุรกิจนี้; closed=true ต้องใช้เวลา null; วันพิเศษไม่ซ้ำและต้องเป็นวันที่ปฏิทินจริง; sortOrder non-negative; เพดาน arrays ต่อชนิด 100 และบังคับ title/description length limit; ไม่ตีความ null เป็น free/open

### 6.2 Endpoints ที่ต้องเพิ่ม

| Endpoint | หน้าที่ |
| --- | --- |
| `GET /api/venue` | อ่าน draft/editor state ภายใต้ auth เดิมใน local |
| `PUT /api/venue` | save draft พร้อม `expectedVersion`; ครั้งแรกเริ่ม version 1 ผ่าน seed/application ไม่ upsert ข้าม optimistic checks |
| `POST /api/venue/publish` | publish snapshot ด้วย version check |
| `GET /api/public/venue` | อ่านเฉพาะ published snapshot หรือ 404 ถ้ายังไม่เคย publish |

Admin routes อยู่ใต้ authentication boundary เดิม public venue route ต้อง dispatch **ก่อน** public generic handler ซึ่งตอบ 404 เมื่อไม่รู้จัก resource อย่า register ทีหลังแล้วเข้า route ไม่ถึง

Request body ที่ต้องกำหนดใน contract: `PUT /api/venue` รับ `{ content: VenueContentInput, expectedVersion: number }`; `POST /api/venue/publish` รับ `{ expectedVersion: number }` การ bootstrap ครั้งแรกให้เรียก application create/seed แยก ไม่ให้ public caller ข้าม version check ด้วยเลข 0 ตัวตนผู้กระทำได้จาก runtime/auth boundary ไม่เชื่อ `actor` ที่ส่งมาจาก client ใน production

Response envelope และ error shape ใช้มาตรฐานเดิมใน CMS: validation 422, stale expectedVersion 409, auth 401/403 ตามกลไกจริง และไม่มี configured auth บน non-local host ต้อง fail closed

### 6.3 Frontend gateway

สร้าง `src/lib/content/gateway.ts` เป็น interface และ `src/lib/content/cms-gateway.ts` เป็น adapter; ใช้ DTO จาก generated public client ไม่ import deployment registry เข้า frontend

```ts
import type { PublicVenueDto, PostDto } from "@lukespace-cms/client";

export interface SiteContentGateway {
  getVenue(): Promise<PublicVenueDto>;
  listPosts(): Promise<PostDto[]>;
  getPost(slug: string): Promise<PostDto | null>;
}
```

`PostDto` มีอยู่แล้ว `PublicVenueDto` ต้องสร้าง/export ผ่าน generator ใน Task 4; ช่วง Phase 1 ใช้ temporary frontend contract ที่มี tests และลบทิ้งหรือเปลี่ยนเป็น re-export เมื่อ Task 4 เสร็จ ห้ามมีสอง schema ที่แก้แยกกันในงาน final

SDK ปัจจุบันเรียกแบบนี้:

```ts
import { createCmsClient } from "@lukespace-cms/client";

const client = createCmsClient({ baseUrl: cmsBaseUrl, fetch: fetchWithTimeout });
const venue = await client.request<PublicVenueDto>("/api/public/venue");
const result = await client.request<{ items: PostDto[] }>(
  "/api/public/posts?locale=th&limit=25"
);
```

ตัวแปร `cmsBaseUrl` ต้องอ่านจาก server-only config และ `fetchWithTimeout` ต้องสร้างใน Task 2 ไม่ใส่ bearerToken สำหรับการอ่าน public API

## 7. File map

ตำแหน่ง frontend เป็น proposed paths ใน repo ที่เลือกจริง ถ้ามี component structure อยู่แล้วให้ใช้แนวทางนั้นและบันทึก mapping ไม่ scaffold ซ้ำ

```text
<frontend>/
  docs/superpowers/plans/2026-09-23-a-cup-of-zoo.md  # แผนหลักไฟล์นี้
  docs/implementation-status.md                    # หลักฐานรันและ blocker ไม่ใช่แผนอีกฉบับ
  reference-assets/                               # original photos ไม่ถูกเสิร์ฟทั้งหมด
  reference-data/                                  # asset manifest + business evidence
  src/assets/site/                                # selected/optimized prototype assets
  src/layouts/SiteLayout.astro
  src/components/site/{Header,Footer,MobileNav,PrototypeNotice}.astro
  src/components/sections/{Hero,AnimalHighlights,ActivityHighlights,CafeHighlights,VisitCta}.astro
  src/components/content/{AnimalCard,ActivityCard,MenuCard,NewsCard,ContentUnavailable}.astro
  src/components/seo/SeoHead.astro
  src/lib/content/{gateway,cms-gateway,fixture-gateway,create-gateway}.ts
  src/lib/content/{view-models,fetch-with-timeout}.ts
  src/lib/business/{format-hours,links}.ts
  src/lib/seo/metadata.ts
  src/pages/{index,animals,activities,menu,visit,news/index,news/[slug],404}.astro
  src/pages/{robots.txt,sitemap.xml}.ts
  src/styles/{tokens,global}.css
  src/middleware.ts
  tests/unit/{business,content-gateway,publication-policy}.test.ts
  tests/e2e/{navigation,visit,news,seo,accessibility}.spec.ts
  scripts/{prepare-assets,verify-content}.ts
  playwright.config.ts
  astro.config.mjs
  package.json
```

CMS paths ที่มีอยู่แล้วและต้องตรวจ/อาจแก้:

```text
packages/contracts/src/{project,posts,index}.ts
packages/client/src/index.ts
packages/client/scripts/vendor-public-dtos.ts
packages/cms-application/src/cms-dependencies.ts
packages/db/src/schema.ts
apps/api/src/runtime/{cms-request-handler,create-cloudflare-cms-dependencies}.ts
apps/api/src/local/{create-local-cms-runtime,migrate-bun-sqlite}.ts
apps/api/src/features/public/transport/http-public-routes.ts
apps/admin/src/app/{project-config,admin-modules,App}.tsx|.ts
apps/admin/src/features/posts/ui/PostEditorPage.tsx
apps/api/package.json
apps/admin/package.json
package.json
```

CMS paths ใหม่ที่เสนอ:

```text
packages/contracts/src/venue-content.ts
packages/domain/src/venue-content/venue-content.ts
packages/cms-application/src/features/venue-content/{venue-repository,venue-use-cases,index}.ts
apps/api/src/features/venue-content/infrastructure/d1-venue-repository.ts
apps/api/src/features/venue-content/transport/http-venue-routes.ts
apps/api/src/local/bun-venue-repository.ts
apps/admin/src/features/venue-content/{infrastructure/venue-api,ui/VenueSettingsPage}.tsx|.ts
apps/api/tests/{venue-content,acupofzoo-publication,acupofzoo-profile}.test.ts
apps/api/scripts/seed-acupofzoo.ts
```

Migration filename เลือกเลขถัดไปจาก filesystem จริง อธิบายเหตุผลและรายการ schema ที่เพิ่มก่อน apply local ห้ามถือว่าเลข 0009 ยังว่างเพราะแผนเขียนจาก snapshot นี้

## 8. Acceptance matrix

| ID | เกณฑ์ทดลอง | เจ้าของ task |
| --- | --- | --- |
| A-01 | Astro routes ครบและไม่เป็น SPA ทั้งเว็บ | 2, 3 |
| A-02 | ภาพจริงและ mobile UI ผ่าน screenshot review ไม่มี lorem ipsum | 3, 8 |
| A-03 | ทุก business claim มี evidence และไม่ยืนยันข้อมูลที่อ่านไม่ได้ | 1, 8 |
| A-04 | acupofzoo local profile ไม่ใช้ storage/secret ของรายอื่น | 4 |
| A-05 | แก้เวลา/เบอร์ใน CMS แล้ว publish จากนั้นเว็บอ่านใหม่เห็นค่าจริง | 5, 7 |
| A-06 | ข่าว draft ไม่ออก public และ save draft ของข่าว published ไม่เปลี่ยน live | 6 |
| A-07 | Archive แล้ว news detail เป็น 404 และไม่หลุดจาก fallback/cache | 6, 7 |
| A-08 | CMS unavailable แสดง error state ที่ถูก ไม่ปลอมเป็นข่าวว่าง | 2, 7 |
| A-09 | JSON-LD ไม่มี rating/price/address/coordinates ที่ไม่ยืนยัน | 8 |
| A-10 | local/staging noindex; production reject fixture/demo | 2, 8 |
| A-11 | tests/build รันจริง รายงานผลตามหลักฐาน ไม่อ้างว่า test ที่ไม่ได้รันผ่าน | 0–9 |
| A-12 | ไม่ deploy, ไม่ remote migrate, ไม่ DNS และไม่มีค่าใช้จ่ายเปิดเอง | ทุก task |

---

# Implementation tasks

แต่ละ task ใช้ TDD สำหรับ behavior ที่ทดสอบอัตโนมัติได้: เขียน test ให้ล้มด้วยเหตุผลที่คาดก่อน แก้ให้น้อยที่สุด รันผ่าน ตรวจ diff และ commit เฉพาะไฟล์เกี่ยวข้องถ้านโยบาย workspace อนุญาต ไม่ push หรือ merge อัตโนมัติ งานภาพใช้ screenshot evidence ร่วมกับ behavior tests ไม่ใช้แค่ grep source แทนการเปิดหน้าเว็บ

## Phase 0

### Task 0: ตรวจ workspace, CMS baseline และเส้นทางรัน

**Files:** อ่าน AGENTS.md ทุกระดับ, frontend package.json/lockfile ถ้ามี, CMS README, architecture, deployment, package scripts และ files ใน §7; สร้าง `docs/implementation-status.md`

**Consumes:** workspace ที่ผู้ใช้เปิดจริง + CMS repository ที่เข้าถึงได้

**Produces:** paths ที่ยืนยันแล้ว, HEAD SHA ของสอง repo, baseline failures, package manager และแผนการเพิ่ม files ที่ไม่ทับของเดิม

- [ ] ตรวจ `git status --short` และ `git rev-parse HEAD` ในแต่ละ repo เก็บผล ห้าม reset/stash ทิ้ง user changes
- [ ] เลือก isolated workspace/worktree/branch ตาม AGENTS.md โดยไม่แก้ branch ผู้ใช้เงียบ ๆ
- [ ] ตรวจว่า frontend อยู่ repo ถูกแห่ง หากมีแต่ CMS ให้ขอ path frontend หรือทำ local sibling เมื่อได้รับสิทธิ์ ไม่สร้าง remote repo
- [ ] อ่าน scripts ก่อนรัน: ใน CMS ใช้ `bun install --frozen-lockfile`, `bun run check`, `bun run test`, `bun run build` เมื่อสภาพแวดล้อมรองรับ
- [ ] บันทึกสิ่งที่ FAIL/SKIP ตามจริง ถ้า baseline เดิมล้มด้วยปัญหาไม่เกี่ยว อย่ารื้อแก้ทุกโมดูลเพื่อให้รายงานเขียว
- [ ] ตรวจตัวเลือก Astro/adapter จาก docs ทางการและ lock versions ที่เลือก ใช้ Bun ติดตั้ง dependency เฉพาะจำเป็น ห้ามคำสั่ง scaffold ที่ deploy ต่อเอง
- [ ] บันทึกว่ารอบนี้จบ Phase 2 และชื่อ resource/host ที่ยังไม่มีไม่ใช่ blocker ของการพัฒนา local

ตัวอย่างคำสั่งตรวจที่ไม่เปลี่ยน remote:

```sh
git status --short
git rev-parse HEAD
bun --version
bun run check
bun run test
bun run build
```

**Pass:** รู้แน่ชัดว่าแก้ repo ไหนและรันอะไรได้; ไม่มีการ deploy ตรวจระบบแทน dry-run

### Task 1: จัด provenance, seed และ asset inventory

**Files:** `reference-data/business-evidence.json`, `reference-data/asset-manifest.json`, `scripts/verify-content.ts`, `tests/unit/business.test.ts`

**Consumes:** รูปที่ให้ + brief + Facebook/Maps ตาม §3

**Produces:** local-only seed ที่ทุก field มีสถานะ และรายงานข้อมูลที่ไม่ยืนยัน

- [ ] เปิดแหล่งหลักตาม §3 แล้วบันทึกผลระดับ field ถ้าเข้าถึงไม่ได้คง status เดิม ไม่ให้ search snippet กลายเป็น primary verification
- [ ] ทดสอบว่า admission/address/coordinates ไม่ถูกเติมและ hours ยังไม่เป็น verified โดยไม่มี source evidence
- [ ] ทำ `verify-content` ให้บอก claim ที่พร้อม/ต้องยืนยัน ห้ามเปลี่ยน status เป็น verified จากแค่วันที่ checkedAt
- [ ] กำหนด link allowlist และ null-handling สำหรับข้อมูลที่ยังไม่มี
- [ ] ตรวจ hash/ขนาดภาพจาก manifest และคัด assets ที่ `prototypeUse=true`; ภาพเด็กต้องไม่ถูกคัดเข้า public output

ตัวอย่าง test ของ initial evidence file:

```ts
import { expect, test } from "bun:test";
import evidence from "../../reference-data/business-evidence.json";

test("unverified prices are not converted into free admission", () => {
  expect(evidence.initialValues.admissionPrice).toBeNull();
});

test("failed primary access does not count as verification", () => {
  const maps = evidence.sources.find((source) => source.id === "google-maps");
  expect(maps?.verifiedAt).toBeNull();
  expect(evidence.initialValues.coordinates).toBeNull();
});
```

หลัง Codex ตรวจ primary source สำเร็จ ให้เพิ่ม verified-source fixture แยก และปรับ test ของ checked evidence ให้ตรวจเงื่อนไข verified ต้องมีหลักฐาน แทนบังคับว่าข้อมูลจริงต้อง unverified ตลอดไป

**Run:** `bun test tests/unit/business.test.ts`; `bun run verify:content` หลังสร้าง script นี้

**Pass:** unknown ไม่กลายเป็นข้อเท็จจริง ค่าเปิดและโทรตรงบรีฟหรือ source ที่ตรวจจริง

## Phase 1

### Task 2: Astro shell และ gateway ที่มี fixture/api boundary

**Files:** Astro config/layout, `src/lib/content/*`, `src/middleware.ts`, `tests/unit/content-gateway.test.ts`, `package.json`

**Consumes:** content contract ใน §6 + seed/evidence Task 1

**Produces:** `createGateway(config): SiteContentGateway`, fixture gateway, timeout fetch และ skeleton route ที่มี content HTML

- [ ] หากไม่มี Astro ให้สร้าง minimal project โดยไม่ overwrite ของเดิม ไม่ใส่ React integration เพียงเพราะ CMS Admin ใช้ React
- [ ] เพิ่ม pure config resolver ที่รับ `SITE_ENV`, `CONTENT_MODE`, `CMS_BASE_URL` และไม่ fallback ไป endpoint ของลูกค้ารายอื่น
- [ ] เขียน test ว่า production + fixture ถูก reject, cms mode ไม่มี base URL ถูก reject และ timeout ไม่ถูกตีความเป็น empty list
- [ ] สร้าง fixture gateway เพื่อใช้ใน Phase 1 และ prototype banner/noindex ทุก route
- [ ] สร้าง `fetchWithTimeout` โดยมี signature ที่ใช้กับ SDK ได้เป็น `typeof fetch` ผ่าน wrapper และ timeout ที่กำหนดชัดเจน ส่ง AbortSignal และ map not found vs unavailable เป็น error ที่แยกกัน
- [ ] สร้าง shell ที่ server renders title/heading/text โดยทดสอบ raw HTTP HTML ไม่รอ hydration

กำหนด interface ของ config resolver ใน `create-gateway.ts`:

```ts
export type ContentConfig = {
  environment: "local" | "staging" | "production";
  mode: "fixture" | "cms";
  cmsBaseUrl?: string;
};
export function assertContentConfig(config: ContentConfig): void;
```

ตัวอย่าง behavior tests:

```ts
import { expect, test } from "bun:test";
import { assertContentConfig } from "../../src/lib/content/create-gateway";

test("production cannot silently use fixtures", () => {
  expect(() => assertContentConfig({ environment: "production", mode: "fixture" }))
    .toThrow();
});

test("CMS mode requires an explicit origin", () => {
  expect(() => assertContentConfig({ environment: "local", mode: "cms" }))
    .toThrow();
});
```

**Commands ที่ต้องเพิ่มใน frontend:** `dev`, `check`, `test:unit`, `test:e2e`, `build`, `verify:content` โดยใช้ `bun test tests/unit` เฉพาะ unit folder เพื่อไม่ให้ Bun รัน Playwright specs เป็น unit tests

**Pass:** `bun run dev` เปิด localhost, หน้าแรกมี HTML, ไม่มี database dependency ใน Astro, fixture mode ชัดเจน

### Task 3: หน้าเว็บจริงครบตาม visual brief พร้อมภาพจริง

**Files:** components, six routes + news detail, tokens/global CSS, `scripts/prepare-assets.ts`, `tests/e2e/navigation.spec.ts`, `tests/e2e/visit.spec.ts`

**Consumes:** gateway Task 2 + manifest + visual spec §4

**Produces:** prototype ที่เดินทุกหน้าได้ มีภาพจริง ไม่ใช่แค่ wireframe และมี mobile navigation

- [ ] เขียน Playwright tests สำหรับ navigation, mobile menu, CTA directions/tel และ horizontal overflow
- [ ] เตรียม derivatives ของภาพที่อนุญาต คง originals นอก public output เก็บ width/height/alt และ mapping ต่อ asset ไม่ดึงรูปคนอื่นจากเว็บ
- [ ] ทำหน้าแรกให้ครบลำดับใน §4 ก่อนทำหน้าอื่น ไม่เอา promotional banner มาใช้ทั้งก้อนแทนการออกแบบ Hero
- [ ] ทำ animals/activities/menu/visit/news/detail จาก shared template และ content model ไม่ hardcode ชื่อเรื่องเฉพาะในหลายไฟล์
- [ ] แสดง news empty state หากไม่มีข่าวจริง สร้าง local demo post เฉพาะ route/seed ที่กัน production แล้ว
- [ ] ทำ mobile menu, focus, Escape, reduced motion และ sticky CTA ที่ไม่บังเนื้อหา
- [ ] เปิดหน้าเว็บและบันทึก screenshots 390px/1440px ของหน้าแรกและ visit รวมอย่างน้อยหนึ่ง full-page screenshot
- [ ] ตรวจภาพจริงด้วยตา หากข้อความล้น ภาพแตก หรือองค์ประกอบชน ให้แก้และถ่ายใหม่ ไม่ใช้แค่ screenshot ที่ถ่ายแล้วไม่เปิดดู

ตัวอย่าง tests:

```ts
import { expect, test } from "@playwright/test";

test("visit CTA keeps the supplied Maps destination", async ({ page }) => {
  await page.goto("/visit/");
  await expect(page.getByRole("link", { name: "ดูเส้นทาง", exact: true }).first())
    .toHaveAttribute("href", "https://maps.app.goo.gl/A6AVc2ScgEJwSrbVA");
  await expect(page.locator('a[href="tel:+66989838037"]').first()).toBeVisible();
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth
  )).toBe(true);
});
```

ทดสอบค่า link จาก published fixture เดียวกันเมื่อข้อมูล source ถูกยืนยันใหม่ อย่า hardcode คนละค่าระหว่าง test กับ seed

**Run:** `bun run check`, `bun run test:unit`, `bun run test:e2e`, `bun run build`

**Pass/Checkpoint:** มี screenshot และทางเปิด localhost ให้ต้นดูระหว่างทาง แม้ยังมีป้าย fixture ต้องบอกว่ายังไม่ใช่ CMS-connected ใน milestone นี้

## Phase 2

### Task 4: เพิ่ม acupofzoo local profile และ venue contract ใน CMS เดิม

**Files:** project registry, root/API/Admin scripts, local composition, public DTO generator, new venue contract/domain/use cases/adapters ตาม §7

**Consumes:** CMS conventions และ `VenueContentInput` §6

**Produces:** โปรไฟล์ `acupofzoo`, enabled modules `posts`, `media`, `venue-content`; local storage แยก; typed contracts exported; venue save/publish API ใช้งานได้

- [ ] เพิ่ม tests ว่า resolve acupofzoo ถูก profile, unknown project fail, module ไม่เปิดให้รายอื่น และ local storage root ไม่ใช้ nuchaba/portfolio/aoed
- [ ] เพิ่มโปรไฟล์และ explicit scripts โดย preserve profiles เดิมทั้งหมด; ปรับ AGENTS/docs เฉพาะรายชื่อที่จำเป็นให้ตรงของจริง
- [ ] ค่า local origins เสนอ Astro `http://localhost:4321`, Admin `http://localhost:5173`, API `http://localhost:8787`; ถ้าพอร์ตชนให้เลือกพอร์ตและตั้ง origins/CORS ให้ตรงกัน ห้ามแอบเปลี่ยนไป remote
- [ ] เพิ่ม `venue-content` schema, aggregate, repository port และ use cases พร้อม version/audit behavior ตาม pattern เดิม
- [ ] เพิ่ม forward migration แบบแยก draft/publication columns หรือ table และสร้างทั้ง Bun/D1 adapters ใช้ local transaction/batch pattern ที่มีอยู่ ห้าม partial publish ครึ่งชุด
- [ ] เพิ่ม route ใหม่ก่อน generic public dispatcher ตาม §6.2 และเปิดเฉพาะ enabled module
- [ ] อัปเดต public client DTO ผ่าน generator ที่มีอยู่ ไม่ copy deployment registry เข้า frontend bundle
- [ ] ยังไม่ต้องใส่ production resource IDs เพื่อให้ local รันได้ หาก type เดิมบังคับ production origins ใช้ domain สงวน `.invalid` ที่ชัดเจนและ guard ห้ามนำไป deploy จนยืนยันจริง ไม่ใช้ URL ของรายอื่น

Test intentions ที่ต้องมีใน `apps/api/tests/acupofzoo-profile.test.ts`:

```ts
import { expect, test } from "bun:test";
import { resolveProjectDefinition } from "@lukespace-cms/contracts";

test("acupofzoo has its own identity and only selected modules", () => {
  const project = resolveProjectDefinition("acupofzoo");
  expect(project.id).toBe("acupofzoo");
  expect(project.cms.enabledModules).toContain("venue-content");
  expect(project.cms.enabledModules).not.toContain("corporate-enquiries");
});

test("venue module is not enabled on existing portfolio", () => {
  expect(resolveProjectDefinition("portfolio").cms.enabledModules)
    .not.toContain("venue-content");
});
```

**Script names ที่ต้องสร้างตาม pattern เดิม:**

```text
CMS root: dev:api:acupofzoo, dev:admin:acupofzoo
API app:  dev:local:acupofzoo, db:migrate:bun:acupofzoo, seed:acupofzoo:local
Admin:    dev:acupofzoo, build:acupofzoo
```

root `dev:api:acupofzoo` ในรอบนี้ให้เรียก Bun local composition ไม่ใช่ remote Worker scripts

**Run:** CMS root `bun run check`, `bun run test`, `bun run build`; profile-specific local tests; ไม่รัน remote migration

**Pass:** `/health` คืน `project: acupofzoo` และไม่อ้าง resource อื่น; core profiles เดิมยังผ่าน regression tests หรือมี baseline exceptions ที่รายงานไว้แล้ว

### Task 5: Local seed, media และฟอร์มข้อมูลร้าน

**Files:** `apps/api/scripts/seed-acupofzoo.ts`, venue use cases/adapters, `VenueSettingsPage`, media linkage, Admin routing

**Consumes:** contracts/API Task 4 + evidence and assets Task 1

**Produces:** ข้อมูลทั้งหมดของหน้าคงที่อยู่ใน local CMS, ฟอร์มแก้เวลา/เบอร์/เส้นทางใช้ได้, สื่อเสิร์ฟผ่าน local storage ของ CMS

- [ ] เขียน integration test ว่า draft แก้แล้ว public snapshot ยังเท่าเดิม, Publish แล้วเปลี่ยน, stale version ได้ 409
- [ ] สร้าง seed command ที่ require profile acupofzoo + localhost/local storage เท่านั้น ตรวจ health identity ก่อน import
- [ ] Import รูปผ่าน media/application boundary ของ CMS ไม่เขียน R2 หรือ DB จาก frontend Seed ใช้ stable source keys และ import ซ้ำไม่ทำรายการซ้ำ ไม่ overwrite การแก้ไขของเจ้าของ
- [ ] Seed venue content และ draft sample news ที่ทำเครื่องหมาย demo ใน manifest; เนื้อหาที่จะ publish ใน local ต้องยังมี noindex/prototype context
- [ ] สร้างหน้า “ข้อมูลร้าน” ใน Admin มีฟอร์มชื่อ พื้นที่ตั้ง โทร Maps URL ตารางรายวัน หมายเหตุวันหยุด และวันพิเศษ บังคับ validate ตาม contract
- [ ] เพิ่ม Save draft/Preview/Publish behavior ที่ชื่อปุ่มตรงกับสิ่งที่เกิดจริง ไม่แสดง “บันทึกร่าง” ถ้าข้อมูลออก public ทันที
- [ ] Admin preview อ่าน draft ผ่าน auth และ render template ที่ไม่ถูก public cache หรือ sitemap ไม่ใช้ query string `?preview=true` แล้วเปิดร่างได้โดยไม่ล็อกอิน
- [ ] แจ้ง stale edit ให้ reload/compare ไม่ overwrite เงียบ ๆ

ตัวอย่าง HTTP acceptance sequence ให้เขียนเป็น automated integration test โดยใช้ in-process runtime/Test DB ของ CMS:

```text
1. Seed venue A และ publish version A
2. GET /api/public/venue => ข้อมูล A
3. PUT /api/venue พร้อม expectedVersion ปัจจุบัน เปลี่ยนเบอร์เป็น B
4. GET /api/public/venue => ยังเป็น A
5. POST /api/venue/publish ด้วย version ใหม่
6. GET /api/public/venue => เป็น B
7. PUT ด้วย expectedVersion เก่า => 409 ไม่เขียนทับ
```

ชื่อเบอร์ A/B เป็น test data เท่านั้นไม่ใช้เป็นข้อมูลธุรกิจจริงใน seed

**Run:** `bun run --cwd apps/api db:migrate:bun:acupofzoo`; `bun run --cwd apps/api seed:acupofzoo:local`; tests ของ venue และ media

**Pass:** ฟอร์มแก้ข้อมูลได้ ข้อมูล/รูปอยู่ acupofzoo local CMS ไม่ใช่ไฟล์ JSON ที่เว็บไซต์แก้เอง

### Task 6: ข่าวเดิมพร้อม published snapshot และ editor ที่ไม่ทำให้ข้อมูลหลุด

**Files:** existing posts use cases/repositories/public reader, PostEditorPage, new publication persistence/ports ที่จำเป็น, `apps/api/tests/acupofzoo-publication.test.ts`

**Consumes:** posts/media เดิม + acupofzoo profile

**Produces:** create draft → preview → publish → edit draft → publish again → archive ทำงานถูกต้อง ไม่สร้างข่าวระบบที่สอง

- [ ] เขียน regression test แสดงความเสี่ยงปัจจุบัน: Published A → Save edit B → public ต้องยังอ่าน A; เริ่มจาก checkout จริง ไม่ตั้งสมมติฐานว่าทดสอบผ่านแล้ว
- [ ] ถ้ามี snapshot mechanism ใหม่ใน checkout ให้ reuse ถ้ายังไม่มี ให้เพิ่ม publication snapshot repository/use case แบบเลือก policy ที่ runtime composition ไม่ branch ตาม project id ใน domain
- [ ] `acupofzoo` ใช้ explicit snapshot publishing; โปรไฟล์เดิมไม่ถูกเปลี่ยน semantics โดยไม่ตั้งใจและต้องมี regression tests ครอบคลุม
- [ ] Snapshot ตอน Publish ต้องเป็น transaction/atomic unit กับ version/audit เมื่อ Archive public list/detail ไม่อ่าน snapshot นั้นอีก Public list และ detail ต้องใช้ policy เดียวกัน
- [ ] เก็บ immutable media references ใน published snapshot และห้ามลบไฟล์ที่ published content ยังใช้อยู่
- [ ] Reuse PostEditor UI ปรับฟิลด์หัวข้อ รูปปก คำโปรย เนื้อหา และ SEO ตาม contract เดิม ให้เลือกภาพจาก media ได้
- [ ] เพิ่ม toolbar ขั้นพื้นฐาน/preview ที่ทำให้การลงข่าวธรรมดาไม่ต้องพิมพ์ Markdown syntax เอง เก็บ Markdown เป็น storage เดิมได้ ไม่ต้องทำ rich-text collaboration หรือเปลี่ยน storage format ทั้ง platform
- [ ] sanitize output; preview ของร่างต้องไม่เข้าถึงด้วย public API และไม่ผ่าน public HTML cache
- [ ] Archive demo post และพิสูจน์ว่ารายการ+detail หายตามสถานะ

Automated acceptance sequence ที่ต้องมีแยก assertions:

```text
Create draft A            => public list ไม่มี A; slug A เป็น 404
Publish A                 => list/detail มี A
Save revised draft B      => authenticated preview เห็น B; public ยังเห็น A
Publish revised draft B   => public เห็น B
Archive                   => list ไม่มี; detail เป็น 404
Concurrent edit           => stale expectedVersion ได้ 409
Unauthenticated preview   => 401/403 ไม่ใช่ 200 และไม่ใช้ noindex แทน auth
```

**Pass:** พฤติกรรมตามนี้ทดสอบจริง ไม่ใช้ชื่อปุ่มใน UI เป็นหลักฐานว่าร่างแยกแล้ว

### Task 7: เชื่อม Astro กับ local CMS จริงและจัดการ failures

**Files:** frontend cms-gateway/create-gateway/view models/pages/middleware, CMS acupofzoo public cache policy, unit/e2e tests

**Consumes:** Task 4–6 API + generated client DTO

**Produces:** `CONTENT_MODE=cms` ที่ news/venue/media มาจาก CMS จริงทุกหน้า ไม่มี silent fixture fallback

- [ ] เขียน client unit tests ด้วย fake fetch: list envelope `{items}`, URL-encoded slug, 404 ต่างจาก 503, timeout, malformed response และไม่ส่ง admin Authorization
- [ ] เชื่อม public SDK `client.request` ตาม §6.3 พร้อม runtime schema validation ที่ boundary ใช้ package/local artifact ที่ build ได้จริง ไม่อ้างว่า package อยู่ npm แล้วหากยังไม่ได้ publish
- [ ] Local dependency ระหว่างสอง repo ใช้ `file:`/workspace วิธีที่ repo รองรับ หรือ packed local artifact ตามจริง และบันทึกวิธีรันใหม่จาก clean checkout; ห้าม absolute path ของเครื่องผู้พัฒนาใน committed lock/config
- [ ] Seed/API mode เปลี่ยนผ่าน config ที่ explicit; ลบ temporary duplicate contracts ของ Phase 1 และให้ fixture ใช้ generated DTO เดียวกัน
- [ ] ใช้ `no-store` เฉพาะ profile นี้ทั้ง HTML และ public API ระหว่างพิสูจน์ behavior; สื่อ derivative คงใช้ immutable paths ได้
- [ ] ถ้า news optional section ล่มให้แสดง unavailable ไม่ทำให้หน้าแรก blank ถ้าหน้าข่าวรายละเอียดไม่มี service ให้ 503 พร้อมข้อความและทางกลับ
- [ ] ทดสอบเชื่อมจริงด้วย CMS local process ไม่ใช้ `page.route()` แทน server-to-server CMS fetch เพราะ SSR ไม่ผ่าน browser route interception
- [ ] เปิด Admin แก้เวลา/โทร publish แล้วเปิดหน้า visit อีก browser context และตรวจทั้ง HTML กับหน้าแสดงผล
- [ ] ปิด CMS แล้วทดสอบ failure state เปิดใหม่ตรวจ recovery และยืนยันว่าไม่ seed ทับสิ่งที่แก้ไว้

ตัวอย่าง test ว่า HTML มาจาก server ไม่ใช่ hydration:

```ts
import { expect, test } from "@playwright/test";

test("server-rendered visit content is present in raw HTML", async ({ request }) => {
  const response = await request.get("/visit/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("A Cup of Zoo");
  expect(html).toContain("098 983 8037");
});
```

แยก test dataset ของเปลี่ยนเบอร์ออกจาก baseline dataset ข้างบนและ reset เฉพาะ local test DB ห้าม reset dev content ของผู้ใช้

**Pass:** บันทึกหลักฐานก่อน/หลัง Publish, Archive, API offline และ recovery รวม URL/command ที่รันจริง

### Task 8: SEO, source integrity และ visual/accessibility QA

**Files:** SeoHead, metadata, robots/sitemap, content verifier, Playwright seo/accessibility tests, screenshots

**Consumes:** CMS-backed routes + verified/provisional evidence

**Produces:** technical SEO baseline และหลักฐานคุณภาพโดยไม่ overclaim Google ranking

- [ ] ตั้ง title/description เฉพาะแต่ละหน้า canonical ที่ชี้ public domain เป้าหมายเฉพาะ production; local/staging ใส่ `X-Robots-Tag` และ meta noindex
- [ ] ทำ sitemap จาก published pages/posts เท่านั้น ไม่มี demo/draft/admin/preview และไม่ query list จำกัด 25 แล้วทำให้ข่าวเกินลำดับนั้นหายจาก sitemap เงียบ ๆ หาก API ยังไม่มี pagination ให้เพิ่ม bounded pagination/endpoint ที่เหมาะตาม contracts พร้อม test
- [ ] JSON-LD ใช้ข้อมูลร้านที่ตรวจสอบได้และตรงกับข้อความในหน้า ไม่ใส่ aggregateRating/review/stars, free admission, พิกัด หรือที่อยู่เต็มสมมติ ชั่วโมงที่ยัง provisional ไม่ออก structured data
- [ ] ชื่อรูปและ alt เป็นคำอธิบายที่เห็นได้ ไม่ยัดคำค้น ไม่ใช้ข้อความ alt อ้างตัวตนคนหรือสายพันธุ์ที่ไม่มีหลักฐาน
- [ ] ทดสอบ unknown path เป็น 404 จริง, archived slug ไม่อยู่ sitemap, draft preview ไม่มี public access และ CMS errors ไม่เป็น soft 404
- [ ] ตรวจ navigation มือถือ keyboard focus Escape zoom 200% reduced motion และ color contrast; automated scan เป็นส่วนหนึ่งของหลักฐาน ไม่ใช่การรับรอง WCAG ทั้งเว็บ
- [ ] วัด Lighthouse mobile หน้าแรก/visit/news ตามเงื่อนไขที่บันทึก อย่างน้อย 3 รอบสำหรับหน้าที่วัด ใช้ median เป้าหมาย Performance ≥85; ถ้าวัดไม่ได้ให้ระบุไม่วัด ไม่ใส่คะแนนสมมติ
- [ ] ไม่โหลด Facebook SDK/Maps iframe/live video ก่อนผู้ใช้กดโดย default ในรอบนี้ใช้ external Maps link อย่างเดียว
- [ ] ตรวจ screenshots ทั้ง 320,390,768,1440px และเปิดดูจริง โดยตรวจ Thai wrapping, crop ภาพ และ sticky CTA ไม่บังเนื้อหา

ตัวอย่าง SEO tests:

```ts
import { expect, test } from "@playwright/test";

test("prototype stays noindex", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]'))
    .toHaveAttribute("content", /noindex/);
});

test("unknown route is a real 404", async ({ request }) => {
  const response = await request.get("/this-route-does-not-exist/");
  expect(response.status()).toBe(404);
});

test("unverified review score is not invented", async ({ page }) => {
  await page.goto("/visit/");
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(jsonLd.join("\n")).not.toContain("aggregateRating");
});
```

**Pass:** Tests จริง + screenshots จริง + content verification report ไม่มี primary fact ที่ติด verified ปลอม

### Task 9: ส่งมอบ prototype และหยุดก่อน infrastructure

**Files:** README ของ frontend, `docs/implementation-status.md`, `artifacts/qa/` ที่เหมาะกับ repo policy, local .env examples ที่ไม่ใส่ secret

**Consumes:** ผล Task 0–8

**Produces:** clean-start instructions, screenshots, test results, outstanding gates และรายการ diff สอง repo

- [ ] ใน CMS รัน check/test/build และ tests โปรไฟล์ใหม่อีกครั้ง ตรวจว่า root build script รวม build ของ Admin acupofzoo แล้ว
- [ ] ใน frontend รัน check/unit/e2e/build/verify-content จากคำสั่งที่สร้างจริง
- [ ] ทดสอบ clean-start local ด้วย migrations/seed ของ acupofzoo บน test storage ใหม่ที่แยก ไม่ลบ storage dev ผู้ใช้
- [ ] บันทึกชื่อ repo/branch/HEAD, changed files, actual start commands, environment variable names และพอร์ตจริง
- [ ] แยกผล Done / Partial / Blocked / Not run ให้ตรง ไม่มีข้อความ “CMS พร้อม production” เมื่อยังใช้ local developer auth
- [ ] สรุปให้ต้นเป็นภาษาไทย: ลองเปิดอะไรได้ ข้อมูลมาจากไหน CMS เชื่อมอะไรแล้ว และ 3–5 จุดที่ต้องตัดสินใจก่อน Phase 3
- [ ] หยุด ไม่มี wrangler deploy, `--remote`, secrets put, create bucket/database, DNS หรือ CI deploy

รูปแบบ handoff บังคับ:

```text
Milestone: Phase 2 connected local prototype / หรือ Phase 1 + blocker ที่ระบุ
Frontend: path, branch, SHA, actual localhost URL
CMS: path, branch, SHA, project identity, local storage location
Implemented: routes + CMS operations ที่ทดสอบจริง
Evidence: commands with exit codes, screenshots, tests counts จากผลจริง
Data: verified / user-provided / missing พร้อม source records
Not done: production auth, public approval, cloud resources ฯลฯ ตามของจริง
Next gate: รอทบทวนหน้าตาและขอบเขต Phase 3 ก่อน deploy
```

---

## 9. Phase 3–4: Release gates ที่ต้องกลับมาทำภายหลัง

รายการนี้ไม่ใช่คำสั่งให้ทำในรอบแรก แต่ต้องไม่ถูกลืมหรืออ้างว่าส่งมอบแล้ว

### 9.1 Client-ready CMS

บัญชีรายบุคคล Owner/Editor, server-side verified identity + permission checks, revocation, audit actor ที่ได้จาก identity ไม่เชื่อค่าจาก client, ไม่มี shared long-lived token ให้เจ้าของกรอก, ป้องกัน origin/CSRF สำหรับ cookie session และป้องกัน direct API/worker preview hostname ที่ข้าม Access

เลือก Cloudflare Access หรือ identity integration ที่ตรวจแล้วว่าใช้กับ API/stack นี้ได้จริงเป็นงานย่อยแยก ไม่ถือว่ามี Access หน้าเว็บแล้วทุก endpoint ปลอดภัยเอง

ให้เจ้าของใช้มือถือสร้างข่าว เลือกรูป ดูตัวอย่าง และเผยแพร่ได้โดยไม่เขียน Markdown syntax การมี editor toolbar ใน Phase 2 ต้องผ่าน UAT ก่อนเรียก client-ready

เพิ่มฟอร์มจัดการสัตว์/กิจกรรม/เมนู/FAQ ที่ยังไม่ได้ทำใน Phase 2 โดยใช้ venue-content ที่มี schema เดิม ไม่สร้างฐานข้อมูลอีกชุด

### 9.2 Public content และ privacy

ยืนยันโลโก้ ภาพที่ใช้ สิทธิ์เผยแพร่ภาพบุคคล เวลาร้าน เบอร์ ที่อยู่ พิกัด ค่าเข้า กติกาสัตว์ และรายการที่ให้บริการจริง ลบ demo content ออกจาก production migration/seed และทดสอบว่า fixture mode เปิดใน production ไม่ได้

หากเริ่มเก็บข้อมูลผู้ใช้ ใช้ analytics/embedded third parties หรือกล้องสด ให้ทำ privacy/cookie requirements ตามบริการที่เลือกและให้ผู้รับผิดชอบอนุมัติข้อความ ไม่แต่ง legal policy เองให้เหมือนรับรองแล้ว

### 9.3 Cloudflare staging/production

ก่อนขออนุมัติ deploy ให้เสนอ account owner, billing owner, domains, resource names, isolated staging/prod D1/R2, secrets management, deployment commands และ rollback รายตัว

Workers + Static Assets เป็น target ที่เสนอ แต่ไม่สร้างจริงจนอนุมัติ Astro site ไม่รับ D1/R2 bindings เพื่อข้าม CMS architecture; site อาจใช้ service binding ไป CMS API ตาม consumer pattern ที่ทีมเลือก

ทดสอบ Worker runtime กับ `wrangler dev` local และ dry-run บน resource config ของร้านที่ยืนยันแล้ว Bun local ผ่านไม่ใช่หลักฐานว่า production Worker runtime ผ่าน

### 9.4 Operations

ตั้ง logging แบบไม่เก็บ token/ข้อมูลส่วนบุคคลเกินจำเป็น จัด health checks, error reporting, backup D1 และไฟล์ R2, retention และทดสอบ restore จริง กำหนดผู้ดูแลและเวลาตอบสนองตามสัญญา

ตรวจ SEO migration/redirect จากเว็บเดิมเท่าที่ตรวจได้ ไม่ส่งทุก URL ไปหน้าแรก เปิด index หลัง UAT และตรวจค่า canonical/sitemap production ถูกโดเมนจริง

เพิ่ม caching หลัง behavior correctness ผ่านแล้ว พร้อมทดสอบ publish/archive จากหลายจุดและเขียน freshness budget ที่วัดได้

### 9.5 Budget guardrails

ราคาและช่วงงบในเอกสาร discussion ก่อนหน้าไม่ใช่สิทธิ์ใช้เงิน ห้ามเปิด paid plan หรือ paid image/stream/maps service เอง

Phase 0–2 ไม่ต้องมีคลาวด์บิลเพื่อให้ทดลองได้ ส่วน domain, Workers, D1, R2, backup, auth และ streaming ค่อยตรวจราคาปัจจุบันตอนเลือกจริง ไม่ฝังราคา vendor ในโค้ดธุรกิจ

## 10. แหล่งอ้างอิงสำหรับผู้ลงมือ

### ร้านและข้อมูลต้นทาง

[S1] บรีฟผู้ใช้ใน Project A Cup of Zoo วันที่ 23 กันยายน 2026: ชื่อร้าน พื้นที่ตั้ง เบอร์ เวลาเปิดปกติ และข้อยกเว้นวันอังคาร; บันทึกใหม่ใน `reference-data/business-evidence.json` สถานะ user_provided

[S2] Google Maps link ที่ผู้ใช้ให้: https://maps.app.goo.gl/A6AVc2ScgEJwSrbVA ; ยังอ่านรายละเอียดไม่สำเร็จในการทำแผนนี้

[S3] Facebook candidate: https://www.facebook.com/Acupofzoocafe/ ; ยังไม่ยืนยันข้อมูลร้านจากหน้าจริงเพราะถูกบล็อก

[S4] เว็บไซต์เดิม: https://acupofzoo.com/ ; ผลที่อ่านได้ไม่เพียงพอต่อการ audit/migration

### CMS snapshot ที่ตรวจ

ใช้ commit base: https://github.com/Lukespacewalker/CMS-Platform/tree/2a0d7a6bfefb898d8de327c086aa9dfdd5cad1d5

[R1] `README.md` และ `AGENTS.md`: ownership, Bun และ deployment boundaries

[R2] `package.json`, `apps/api/package.json`: actual scripts และ local Bun profile

[R3] `packages/contracts/src/project.ts`: project registry และ module selection

[R4] `packages/client/src/index.ts`: `createCmsClient`, `.request`, URL handling

[R5] `packages/contracts/src/posts.ts`: posts/asset/SEO contracts

[R6] `packages/domain/src/posts/post.ts`: update/publish/archive behavior

[R7] `apps/api/src/features/public/transport/http-public-routes.ts`: public list/detail และ cache policy

[R8] `apps/api/src/runtime/cms-request-handler.ts`: auth boundary และ dispatch order

### เอกสารทางเทคนิคปัจจุบันที่ให้ตรวจตอนติดตั้ง

[T1] Astro on Cloudflare Workers: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/

[T2] Astro documentation: https://docs.astro.build/

[T3] Cloudflare Workers local development: https://developers.cloudflare.com/workers/development-testing/

[T4] Cloudflare Pages documentation สำหรับเทียบทางเลือก ไม่ใช่คำสั่งเปลี่ยน architecture: https://developers.cloudflare.com/pages/

## 11. คำสั่งเริ่มงานสำหรับ Codex

คัดลอกข้อความนี้เมื่อแตก handoff package ลง frontend workspace แล้ว:

```text
อ่าน docs/superpowers/plans/2026-09-23-a-cup-of-zoo.md และ AGENTS.md ที่เกี่ยวข้อง
ใช้ไฟล์นี้เป็นแผนหลักสำหรับ A Cup of Zoo

ให้ลงมือ Phase 0–2 เพื่อทำ connected local prototype:
- Frontend ใช้ Astro
- CMS ใช้ Lukespacewalker/CMS-Platform เดิม ห้ามสร้าง CMS ใหม่
- ใช้ Root-first ทำงานครบแนวเดียวกัน ไม่แจก subagent อัตโนมัติ
- เริ่มตรวจ workspace และ CMS checkout จริง ก่อน scaffold หรือแก้ไฟล์
- ทำหน้าเว็บให้เปิดดูพร้อมภาพจริงได้ก่อน จากนั้นเชื่อม local CMS
- ใช้ reference-assets และ reference-data ที่แนบมา
- ตรวจเวลาเปิด/การเดินทางจาก Facebook ร้านและ Google Maps ตามลิงก์ในแผน
  ถ้าอ่านไม่ได้ ใช้ข้อมูลบรีฟเป็น provisional ใน local ไม่แต่งข้อมูลและไม่อ้างว่ายืนยันแล้ว
- ทดสอบ draft/publish/archive โดยเฉพาะ edit ข่าวที่เคยเผยแพร่แล้ว
- รัน tests/build และเปิดตรวจ screenshot บนมือถือ/เดสก์ท็อป
- ห้าม deploy, remote migration, เปลี่ยน DNS, push หรือสร้าง paid resources

เมื่อ Phase 2 จบ ให้ส่งคำสั่งเปิด local, screenshots, ผลทดสอบจริง และสิ่งที่ยังไม่พร้อม production
ถ้าไม่มี CMS checkout ให้ทำ Phase 1 ให้จบและระบุ blocker ที่ต้องเพิ่ม ไม่ทำ CMS จำลองมาทดแทน
```
