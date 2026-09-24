# สถานะการทดลองในเครื่อง

Milestone: Phase 2 connected local prototype

Frontend: `H:\repos\Lukespacewalker\a-cup-of-zoo-website` ยังไม่มี commit เปิดที่ http://127.0.0.1:4321
CMS: `H:\repos\Lukespacewalker\CMS-Platform-acupofzoo` สาขา `acupofzoo-local-prototype` จาก `2a0d7a6` โปรเจกต์ `acupofzoo` ข้อมูลอยู่ที่ `apps/api/.local-cms-acupofzoo`
working tree เดิมของ `CMS-Platform` ไม่ได้ถูกแก้

## ที่รันแล้ว

- Frontend: `bun run test:unit` 7 ผ่าน, `bun run test:e2e` 8 ผ่าน, `bun run verify:content` ผ่าน, `bun run check` ผ่าน, `bun run build` ผ่าน
- CMS API: `bun run --cwd apps/api check` ผ่าน, `bun test` ใน `apps/api` 51 ผ่าน
- CMS Admin: `bun run --cwd apps/admin check` ผ่าน
- ยังไม่ได้รัน `bun run test` และ `bun run build` ทั้ง monorepo และไม่ได้วัด Lighthouse

## ข้อมูล

- Facebook เพจ `Acupofzoocafe` อ่านได้เมื่อ 24 กันยายน 2026 ชื่อตรงร้าน และโพสต์ใส่ลิงก์ Maps เดียวกับบรีฟ เวลาในโพสต์ตรงกับบรีฟ คือ 10:00–19:00 ปิดอังคาร ยกเว้นอังคารที่ตรงวันหยุดนักขัตฤกษ์ เบอร์ในโพสต์คือ 098 983 8037
- Google Maps จากลิงก์ที่ให้มาเปิดได้ ชื่อ A Cup of Zoo Cafe&Farm แต่เบอร์บนรายการคือ 092 279 1890 จึงยังไม่เลือกเบอร์เดียว และยังไม่อ่านตารางเวลาทั้งสัปดาห์
- ที่อยู่ที่ใช้มาจากข้อความบนเพจ Facebook ไม่ได้ใส่พิกัด คะแนนรีวิว ราคา หรือรายชื่อสายพันธุ์
- เวลาเปิดบนเว็บยังติดสถานะ `user_provided`

## ที่ยังไม่ทำ

ไม่ได้ deploy ไม่ได้ migrate ระยะไกล ไม่ได้แก้ DNS ไม่ได้สร้างทรัพยากรคลาวด์ และยังไม่มีบัญชีผู้ใช้รายบุคคลสำหรับเจ้าของร้าน
