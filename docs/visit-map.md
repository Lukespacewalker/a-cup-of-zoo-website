# Google Maps ในหน้าการเดินทาง

ผู้ใช้ขอเพิ่ม embed Google Maps เมื่อ 27 กันยายน 2026 ใช้ร่วมกันใน `/visit/` และ `/en/visit/` ผ่าน `VisitPage.astro` วางใต้ที่อยู่ร้าน คงปุ่มเส้นทาง Facebook และโทรศัพท์เดิมไว้

หมุดใช้ CID `13571304804789208237` ของ A Cup of Zoo จาก Google Maps URL เดิม (`0xbc56f5d0ec0344ad`) เป็น embed ที่ไม่ต้องใช้ API key กำหนดภาษา `th`/`en` ตามหน้า มี title สำหรับโปรแกรมอ่านหน้าจอ ใช้ native lazy loading และกรอบสูง 320–420 px ตามขนาดหน้าจอ หากเปลี่ยนร้านหรือหมุดใน CMS ต้องเปลี่ยน CID ใน component ด้วย

คำขอนี้แทนข้อกำหนด external Maps link อย่างเดียวใน [แผนเดิม](superpowers/plans/2026-09-23-a-cup-of-zoo.md) เฉพาะหน้าการเดินทาง หน้าเมนูยังไม่ฝัง viewer หรือ iframe

ตรวจในเครื่อง: `bun run check` ไม่มี error/warning, `bun run build` ผ่าน และ Playwright ชุด visit/locale ผ่าน 10 รายการ ตรวจ BrowserOS neo ที่ 390 px แล้ว iframe โหลดหมุดร้านจริงและหน้าไม่ล้นแนวนอน หน้าอังกฤษที่ 1440 px มี title และ URL ภาษาอังกฤษและไม่ล้นแนวนอน ผลนี้เป็นงานในเครื่อง ยังไม่ได้ deploy
