# A Cup of Zoo — Garden & Animal Experience Implementation Plan

**สถานะ:** Implemented locally ตามคำสั่ง “งั้นแก้” — ผลตรวจและข้อจำกัดดู [implementation ledger](../../review/garden-experience-2026-09-28/README.md); ยังไม่ได้ deploy

**Owner / Execution:** Root เป็นเจ้าของดีไซน์ implementation และ integration ใช้ executing-plans ตามลำดับงาน ไม่มีข้อกำหนดให้แบ่งงานตามรุ่นโมเดลหรือใช้หลายคนเขียนพร้อมกัน

**Goal:** ทำให้ผู้เข้าชมอยากมาใช้เวลาที่คาเฟ่ สวน และโซนสัตว์ ผ่านภาพจริงที่เด่น การจัดวางที่ประณีต ภาพสีน้ำและเนื้อกระดาษ พร้อมข้อมูลตัดสินใจที่เข้าใจง่ายทั้งไทยและอังกฤษ

**Architecture:** ใช้ Astro และ shared TH/EN page components เดิม รักษา native HTML, catalog, CMS gateway และเส้นทางเดิม แยก CSS ส่วนร่วมกับหน้าแรกให้รับผิดชอบชัด ใช้ JavaScript เฉพาะ navigation, theme, video และการแสดงแถบทางลัดตามตำแหน่ง ไม่มี runtime framework ใหม่

**Tech Stack:** Astro 7, TypeScript, CSS, Bun, Playwright และ Cloudflare adapter เดิม

**Spec:** Design brief และข้อกำหนดในเอกสารฉบับนี้ รวบรวมจากบทสนทนา roast วันที่ 28 กันยายน 2026, [โบรชัวร์ที่ผู้ใช้ส่ง](../../../reference-data/services-packages-2026-09-28.png), [ข้อกำหนดสีน้ำเดิม](2026-09-27-watercolor-canvas.md) และ [ผลตรวจเดิม](../../review/watercolor-2026-09-27/README.md)

**ภาพเพิ่มเติม:** [ภาพจริง 6 ภาพและแนวทางใช้งาน](../../../reference-data/garden-experience-2026-09-28/README.md) ผู้ใช้ส่งระหว่างเขียนแผน เก็บต้นฉบับและ hashes แล้ว ยังไม่ได้ crop ลบข้อความ หรือใช้ในเว็บ

## 1. Design brief และขอบเขตการตัดสินใจ

### ผู้ใช้ระบุแล้ว

- ต้องการอารมณ์ luxury ที่ได้แรงบันดาลใจจาก https://www.qissa.co.uk/ พร้อมความน่ารักของสัตว์ ภาพสีน้ำ และความเป็นกระดาษ
- มี hero video แล้ว ต้องใช้เป็นส่วนสำคัญของการออกแบบ
- ร้านมีคาเฟ่ สวน ประสบการณ์สัตว์ 6 โซน และกิจกรรมตามโบรชัวร์ ไม่ออกแบบราวกับมีเพียงเครื่องดื่มกับมุมถ่ายรูป
- ผู้ใช้ยืนยันภาพที่ 6 เป็นเด็กกับแมว และระบุว่ามีห้องเล่นกับแมว ให้เล่าเป็นประสบการณ์เด่นในกลุ่ม Indoor โดยไม่เพิ่มโซน/ราคาเกินแพ็กเกจเดิม
- ผู้ใช้ปรับข้อกำหนดระหว่างเขียนแผน: อนุญาตให้ลดการใช้ Mali และลดความชัดของเนื้อกระดาษ ข้อนี้แทนข้อกำหนดเดิมที่ให้ใช้ Mali ทุกหัวเรื่องและเน้น texture ชัด; คงโลโก้จริง TH/EN และ light/dark/auto

### แนวทางที่แผนเสนอ

- Luxury มาจากภาพที่คัดดี จังหวะการอ่าน ตัวอักษร และความใส่ใจรายละเอียด ความน่ารักมาจากสัตว์จริง สีน้ำเป็นลายเซ็นที่มีตำแหน่งชัด
- ภาพรวมเป็นคาเฟ่และสวนที่ประณีต อบอุ่น และเข้าถึงได้ เหมาะกับคนรักสัตว์ คู่รัก เพื่อน และครอบครัว ไม่ใช้ถ้อยคำเฉพาะครอบครัวเป็นประตูเข้าหลักทุกจุด
- ทุกช่วงหน้าเพิ่มข้อมูลหรือเหตุผลใหม่ในการมา ไม่ใช้ข้อความ “วันสบาย ๆ” ซ้ำแทนเรื่องราว
- ใช้ ivory / cocoa / garden green เดิมเป็นหลัก ทองหม่นเป็น accent ลด gradient โลหะ เงาเรือง และ glass overlay ที่แย่งภาพ
- ลด Mali 500 เหลือคำบรรยายสัตว์หรือข้อความลายมือสั้น ๆ; หัวเรื่องหลัก h1/h2 ใช้ Noto Sans Thai Looped ที่มีอยู่ในโปรเจกต์ด้วยน้ำหนัก 400/500 และขนาด/ช่องว่างที่สร้างลำดับชัด ทั้งไทยและอังกฤษ ไม่เพิ่มฟอนต์ใหม่ในรอบแรก และไม่ใช้ตัวหนาหนักกับเงาทอง
- ลด texture เป็นผิวกระดาษละเอียดบนพื้น ivory ให้รับรู้เมื่อมองพื้นที่ว่าง แต่ไม่แย่งความสนใจจากรูปและเนื้อหา พื้นที่ข้อมูลหนาแน่นใช้พื้นเรียบได้ ภาพสีน้ำยังต้องเห็นเป็นเอกลักษณ์ ตรวจค่าจริงจาก render ทั้ง light/dark แทนยึด opacity เดิม
- แผนนี้ยังไม่ใช่หลักฐานว่าผู้ใช้เลือก “คาเฟ่ก่อน” หรือ “สัตว์ก่อน” จากคำถามก่อนหน้า ใช้ทั้งสองอย่างร่วมกันในหน้าจอแรก และให้ผู้ใช้ประเมิน composition ก่อนขยายไปทุกหน้า

### ไม่อยู่ในงานนี้

- ระบบจอง ชำระเงิน ระบบสมาชิก หรือการเขียน CMS/production
- การแก้ราคา เปลี่ยนแพ็กเกจ หรือนำโปรโมชันขึ้นเป็นข้อเสนอถาวรโดยไม่มีหลักฐาน
- เพิ่มเมนูเครื่องดื่มที่ยังไม่มีข้อมูล สร้างชื่อ/นิสัยสัตว์ หรือภาพสมจริงของประสบการณ์ที่ไม่ได้ถ่ายจากร้าน
- ถอด theme control, เปลี่ยนโลโก้, แปลข่าวทั้งระบบ หรือ deploy

## 2. ข้อเท็จจริงและแหล่งข้อมูล

โบรชัวร์ที่ผู้ใช้ส่งเป็นหลักฐานบริการที่ใช้วางแผน ไม่อ้างว่าวันรับไฟล์คือวันยืนยันราคาโดยเจ้าของร้าน เก็บ snapshot ใน reference-data เพื่อไม่พึ่งไฟล์ Temp และไม่ใช้ภาพสองหน้าทั้งใบเป็นเนื้อหาหลักของหน้าเว็บ

| เรื่อง | ข้อมูลที่ต้องคง | การนำเสนอ |
|---|---|---|
| คาเฟ่ | ไม่มีค่าเข้า ขั้นต่ำอาหารหรือเครื่องดื่มคนละ 1 ออร์เดอร์ | วางเงื่อนไขติดกับคำว่าไม่มีค่าเข้า |
| One Zone | 249 บาท เลือกกลุ่ม Indoor หรือ Outdoor; ส่วนลด 95 บาท; Indoor ได้ถุงเท้า / Outdoor ได้ป้ายเอมะ | ห้ามสื่อว่าเลือกได้เพียงบ้านสัตว์หนึ่งบ้าน |
| All Zone | 349 บาท ทุกโซน; ส่วนลด 95 บาท; ตะกร้าอาหารสัตว์มูลค่า 120 บาท; ถุงเท้าและเอมะ | เปรียบเทียบสิ่งที่เพิ่มจาก One Zone โดยไม่แต่งสิทธิประโยชน์ |
| Indoor | หมาและแมว / เมียร์แคทและแพรี่ด็อก / อีเห็น | ใช้ชื่อร้านตามหลักฐาน ไม่ตัดสินชนิดจากภาพประกอบ |
| Outdoor | จิ้งจอก / แพะแคระ / กระต่าย; เข้าบ้าน 18:00 | แยกจากเวลาปิดคาเฟ่ |
| เด็ก | ต่ำกว่า 100 ซม. เข้าฟรี; ผู้ใหญ่ร่วมกิจกรรมอย่างน้อย 1 คน; เข้า Indoor ต้องซื้อถุงเท้าเด็กใหม่ 49 บาท | เห็นก่อนเลือกแพ็กเกจ ไม่ซ่อนใน tooltip |
| กิจกรรม | ตะกร้าอาหาร 80 บาทเป็นโปรจาก 120; ปลาอัลลิเกเตอร์ 50 บาท/3 ไม้; นมแพะ 40 บาท/ขวด; เอมะ 59 บาท; อาหารปลาคาร์ฟ 20 บาท | คงหน่วยและคำกำกับโปรโมชัน แยกมูลค่าของแถมกับราคาซื้อเพิ่ม |
| อาหารสัตว์เพิ่ม | ใช้รายการและหน่วยใน activities-catalog.ts เทียบกับภาพต้นฉบับ | ไม่ทำราคาเป็นภาพอย่างเดียว |

- เรือพายและพื้นที่สวนแสดงเป็นสิ่งที่ร้านมี ไม่อนุมานว่ารวมบริการฟรี ไม่ต้องมีเจ้าหน้าที่ หรือเปิดพร้อมใช้ตลอดเวลา
- ใช้ `localizedActivities(locale)` และ catalog เดิมร่วมกันระหว่างหน้าแรก กิจกรรม และข้อมูลก่อนมา หลีกเลี่ยงคัดลอกตัวเลขหลายแห่ง
- เวลาเปิดใช้ `venue.content.regularHours` และ holiday note เหมือนหน้า Visit; เลิกฝังเวลาคงที่อีกชุดในหน้าแรกและลบคำชวน “ทุกวัน” ที่ขัดกับวันหยุด
- ข้อมูลที่ยังไม่ยืนยันเก็บในหมายเหตุหรือใช้คำชวนที่ไม่รับประกัน ห้ามแก้ verification status ให้สูงขึ้นเพียงเพราะได้รับรูป

## 3. โครงสร้างหน้าและลำดับเนื้อหา

### หน้าแรก `/` และ `/en/`

1. **Hero:** วิดีโอ/ภาพสำรองเห็นสัตว์และบรรยากาศชัด โลโก้จริงขนาดเหมาะสม หัวเรื่องเดิม “จิบอะไรดี… มีเพื่อนรออยู่” ใช้ต่อได้ คำอธิบายหนึ่งประโยคระบุคาเฟ่ สวน สัตว์ และคลอง 6 ปุ่มหลัก “วางแผนมาเที่ยว” → `/visit/`; รอง “สำรวจประสบการณ์” → `#experiences` ในหน้าแรก เวอร์ชันอังกฤษใช้ “Plan your visit” / “Explore experiences”
2. **เลือกวันของคุณ `#experiences`:** สามเรื่องพร้อมภาพจริงและลิงก์: คาเฟ่/อาหาร → menu, เพื่อนสัตว์ → animals, สวน/กิจกรรม → activities; มีข้อความไม่มีค่าเข้าคาเฟ่พร้อมขั้นต่ำสั้น ๆ
3. **สัตว์:** นำด้วยเรื่อง “ห้องเล่นกับแมว” / “Meet the cats” และภาพเด็กกับแมวที่ผู้ใช้ยืนยัน จัด crop ให้เห็นใบหน้าทั้งคู่พร้อมภาพรองของสัตว์อื่น เชื่อมไป Indoor และข้อมูลแพ็กเกจ ใช้ชื่อจริงเมื่อยืนยันแล้ว ไม่ตีความภาพตกแต่งเป็นสัตว์ที่รับประกันว่าจะได้พบหรือรับประกันสิทธิในการอุ้มสัตว์
4. **คาเฟ่และสวน:** ภาพอาหารและสถานที่ช่วยให้เห็นรูปแบบการใช้เวลา ลดคำชวนซ้ำและไม่ยกเมนูทั้งหมดมาไว้หน้าแรก
5. **กิจกรรมเด่นและมุมขอพร:** เลือกไม่เกิน 3 กิจกรรมที่มีภาพเหมาะสม ใช้ WishingCorner เดิมร่วมกัน ลิงก์ไป anchor รายกิจกรรม; ถ้าภาพไม่พร้อมใช้ข้อความ/ภาพประกอบที่แยกชัดและเก็บรายละเอียดครบในหน้ากิจกรรม
6. **เริ่มวางแผน:** สรุปคาเฟ่เทียบกับแพ็กเกจ 249/349 จากแหล่งเดียว เปิดราคา/เงื่อนไขเต็มได้ พร้อมเวลา ที่อยู่ แผนที่ และช่องทางติดต่อ

### หน้ารอง

- **Animals:** ภาพสัตว์จริงอยู่ในช่วงเปิดหน้า ก่อนรายชื่อยาว ให้ห้องเล่นกับแมวมีภาพและเรื่องสั้นของตัวเองภายใน Indoor จากนั้นจัดสัตว์อื่นตาม Indoor/Outdoor เชื่อม `activities/#animal-zones` และ `#passes`; ไม่แยกห้องแมวเป็นแพ็กเกจหรือโซนที่เจ็ด รายชื่อสัตว์อื่นเดิมเก็บเป็นข้อมูลเสริมพร้อมที่มาและข้อจำกัด ไม่สับสนว่ารายชื่อเก่าทั้งหมดอยู่ในแพ็กเกจปัจจุบัน
- **Activities:** ภาพหรือเรื่องประสบการณ์สั้นก่อนรายการรายละเอียด พร้อม jump links ไปแพ็กเกจ/โซน/กิจกรรม/มุมขอพร/สวน ให้คนที่มาหาราคาเข้าถึงทันที ไม่ต้องผ่านการเล่าเรื่องทั้งหมด; รักษา anchor เดิม `#passes`, `#animal-zones`, `#experiences`, `#wishing-corner`, `#garden` และ ID กิจกรรม
- **Menu:** คง 47 รายการ ราคา ตัวเลือก และภาพต้นฉบับ แสดงอาหารเด่นเร็วขึ้น ลดพื้นที่เปิดหน้าที่ไม่มีข้อมูล; ใช้คำว่าเมนูอาหารเมื่อปลายทางยังไม่มีรายการเครื่องดื่มจริง
- **Visit:** เวลาเปิดและเวลา Outdoor, สรุปการเข้าใช้บริการ, แผนที่ และสองเบอร์ติดต่อหาเจอง่าย ลิงก์รายละเอียดแพ็กเกจชัด เงื่อนไขต้องตรงกับ Activities
- **News / 404:** รับระบบภาพและ controls ร่วม ตรวจ regression; ไม่เพิ่มขอบเขตข่าวภาษาอังกฤษ

## 4. กติกาภาพ ตัวอักษร และ interaction

- Hero ใช้วิดีโอเดิม `public/videos/hero-animal.mp4` และ poster เดิมเป็นจุดเริ่มต้น ตรวจไฟล์/codec/การเสิร์ฟและการเล่นจริงก่อนสรุปว่า asset เสีย; รอบ roast เห็น poster แต่ยังยืนยัน playback ไม่ได้
- ภาพเพิ่มเติมเลือกใช้ตามหน้าที่: โต๊ะริมกระจกเป็นภาพคาเฟ่หลัก, ทางเดินกับศาลาเป็นภาพสวนหลัก, บ่อปลากับเป็ดและกระต่ายเป็นภาพรอง, เด็กให้อาหารแพะเป็นภาพ interaction หลังจัดการข้อความ, เด็กกับแมวเป็นภาพหลักของเรื่องห้องเล่นกับแมวตามที่ผู้ใช้ยืนยัน
- ภาพแพะมีข้อความทับคนและสัตว์ ต้องตรวจว่าการ crop ยังรักษามือ/หญ้า/สัตว์ได้ หากไม่ได้ใช้ภาพอื่นก่อนและบันทึกความต้องการต้นฉบับสะอาด; ภาพเด็กกับแมวทดลอง crop ข้อความด้านล่างโดยรักษาใบหน้าทั้งคู่ การลบข้อความภายหลังต้องเก็บ derivative และตรวจความตรงกับต้นฉบับ
- วางข้อความตาม safe area ของคลิป ตรวจต้น/กลาง/ปลายและจุดต่อ loop ทั้งจอสูงและจอกว้าง ไม่เลือกตำแหน่งจาก poster เฟรมเดียว
- ลดความมืดเฉพาะเท่าที่ข้อความอ่านได้ ใช้ gradient เฉพาะพื้นที่ข้อความ แทน vignette หลายชั้นที่กลบสัตว์ทั้งภาพ
- ย้ายป้ายร้านสีน้ำออกจากกึ่งกลางวิดีโอ เก็บในช่วงเล่าเรื่องร้านบนกระดาษ; โลโก้ header/footer ไม่แก้
- ภาพสัตว์จริงและอาหารใช้ขอบเรียบหรือมุมมนเบา ไม่มีกรอบหนาซ้อนกรอบ เงายกตัวทั่วทั้งหน้า หรือ brush mask ที่ตัดหน้า/อาหาร
- สีน้ำใช้ในช่องว่าง คำบรรยาย หรือรอยต่อเรื่อง ตัวละครจิ้งจอกเก้าหางเด่นที่มุมขอพร; ถ้าลด mascot ในหัวหน้ารองยังต้องให้เอกลักษณ์สีน้ำเห็นได้จริง ไม่ตัดความน่ารักออกทั้งระบบ
- ลายมือเป็น accent เฉพาะข้อความสั้น ไม่ใช้กับ navigation, ราคา, เงื่อนไข หรือหัวเรื่องหลักทุกส่วน รักษา body/ราคาอ่านง่าย ห้ามใช้เงาและทองไล่สีหนาทับหัวเรื่องเพื่อสร้างความแพง
- Header อยู่เหนือ hero จริง ทดสอบ hit target ไม่ใช่ดูเพียงค่า z-index; เมนูมือถืออยู่เหนือเนื้อหา ปิดด้วย Escape และคืน focus
- Controls เดิม TH/EN และ theme ใช้ target อย่างน้อย 44×44 px ตามข้อตกลงเดิม รักษา route/hash และ persistence
- มือถือซ่อน sticky CTA เฉพาะตอนชุด action ของ hero อยู่ใน viewport แสดงหลังเลื่อนพ้น; หน้ารองแสดงทางลัดตามเดิม มีพื้นที่รองรับท้ายหน้าและไม่บัง focus ไม่มี scroll listener ที่ทำ layout read ทุกเฟรม
- Video control ใช้สถานะ media จริงผ่าน play/pause/error events และจัดการ `play()` rejection; ชื่อปุ่มบอก action ถัดไปแยก TH/EN ไม่แสดงสถานะเล่นสำเร็จจากการกดอย่างเดียว
- Reduced motion: เริ่มจาก poster ไม่ autoplay; ผู้ใช้เลือกเล่นเองได้และหยุดได้ เมื่อเปลี่ยน preference เป็น reduce ระหว่างใช้งานให้หยุด; autoplay ถูกบล็อกหรือโหลดผิดพลาดยังอ่านเนื้อหาและกด CTA ได้
- ปิด JavaScript แล้วยังอ่านเนื้อหา/ราคาและตามลิงก์หลักได้ ใช้ poster เป็น fallback ของ hero และไม่ปล่อยวิดีโอ loop ที่ไม่มีตัวควบคุมใช้งานได้

## 5. ไฟล์และความรับผิดชอบ

| ไฟล์ | หน้าที่ในการเปลี่ยน |
|---|---|
| `src/styles/tokens.css`, `global.css`, `garden.css`, `watercolor.css` | ระบบสี/พื้นกระดาษ/ตัวอักษร/controls และแก้ style ownership ที่ชนกัน |
| `src/styles/cafe-home.css` | composition หน้าแรกและจุดต่อ video→paper; ไม่ override header ทุกหน้าด้วย selector เปล่า |
| `src/layouts/SiteLayout.astro` | เพิ่ม page variant เฉพาะหน้าแรกถ้าจำเป็น และรักษาการโหลดฟอนต์/ธีม |
| `src/components/site/Header.astro`, `Footer.astro` | navigation และ sticky CTA ที่ตอบสนองตำแหน่ง hero |
| `src/components/pages/HomePage.astro` | ลำดับเรื่อง/ลิงก์/แหล่งข้อมูลเวลาเปิด |
| สร้าง `src/components/site/HeroVideo.astro` | แยก media, poster, controls และ playback state จากเนื้อหาหน้าแรก |
| `src/components/pages/AnimalsPage.astro`, `ActivitiesPage.astro`, `MenuPage.astro`, `VisitPage.astro` | โครงสร้างหน้ารองตาม brief |
| `src/components/site/WishingCorner.astro`, `WatercolorAnimal.astro`, `FoxSeal.astro` | ใช้ asset ที่มีอยู่ตามบริบท ไม่สร้าง mascot เพิ่มโดยอัตโนมัติ |
| `src/lib/content/activities-catalog.ts`, `src/lib/i18n/activities.ts`, `src/lib/i18n/venue.ts`, `src/lib/content/decor.ts` | คงข้อเท็จจริง/ตัวเลข ปรับข้อความที่จำเป็นและแหล่งข้อมูลร่วม |
| `src/lib/content/local-images.ts`, `src/assets/`, `public/videos/` | เลือก mapping/crop ที่ตรวจแล้ว รักษา originals และบันทึกที่มา |
| `tests/e2e/*.spec.ts`, `tests/unit/locale.test.ts`, `tests/unit/business.test.ts` | ใช้ coverage เดิมและเพิ่ม regression ที่เปลี่ยนจริง |
| `docs/review/garden-experience-2026-09-28/` | baseline, asset inventory, หลักฐานตรวจ และข้อจำกัดของงานรอบใหม่ |

ไม่เปลี่ยน gateway interfaces หรือ CMS schema ไม่สร้าง abstraction สำหรับทุก section หากไม่มีประโยชน์ซ้ำจริง

## 6. ลำดับ implementation

### Task 1 — ตรวจ baseline และความพร้อมของภาพ

**Dependencies:** ไม่มี; **Output:** inventory และเป้าหมายก่อนแก้ที่ตรวจย้อนกลับได้

- [x] บันทึก HEAD + dirty/untracked delta ก่อนทำงาน (ตอนเขียนแผน HEAD `1fc2599a9fa32ad6ab02760a93e425934adb6919`); ตรวจ process/checkout ของ server อย่าสมมติว่าพอร์ต 4321 คือโค้ดปัจจุบัน เพราะพบคนละเวอร์ชันระหว่าง roast
- [x] สร้าง `docs/review/garden-experience-2026-09-28/README.md` และ `asset-inventory.md`: ระบุไฟล์/media ID, ขนาด, สิ่งที่เห็น, การใช้งาน mobile/desktop และแหล่งที่มา สำหรับ hero/สัตว์/อาหาร/สวน/กิจกรรม/สีน้ำ
- [x] เริ่ม inventory จาก reference-data/garden-experience-2026-09-28 ที่บันทึกแล้ว ตรวจภาพซ้ำกับ local-images.ts และจัดแผน crop สำหรับภาพมีข้อความ/ตราร้าน โดยไม่บังคับใช้ครบหกภาพหรือขยายภาพ 1080 px เป็น hero กว้าง
- [x] ตรวจ video ผ่านเบราว์เซอร์ที่เปิดใช้งานจริงและ HTTP media response บันทึก duration, codec ที่ตรวจได้, frame progression, poster และ playback failure โดยไม่กล่าวโทษ clip จากการโหลดค้างครั้งเดียว
- [ ] เก็บภาพก่อนแก้ไทย/อังกฤษที่ 390 และ 1440 พร้อมหน้าแรก สัตว์ กิจกรรม และเมนู ใช้ screenshot/render จริงและแยกจาก source inspection
- [x] เทียบ catalog กับโบรชัวร์ ระบุราคาที่เป็นโปรและข้อมูลที่ต้องถามก่อนเผยแพร่ ไม่มีการเปลี่ยนธุรกิจจากการเดา
- [x] รัน baseline `bun run check`, `bun run test:unit` และ E2E บน fixture server ที่ยืนยัน checkout แล้ว บันทึก failure เดิม; `.cover-actions` ใน `theme.spec.ts` ไม่ตรงกับ hero ปัจจุบัน ห้ามนับว่า suite เดิมผ่านจากรายงานวันที่ 27

### Task 2 — ระบบภาพร่วมและ hero ที่ใช้ได้จริง

**Dependencies:** Task 1; **Files:** styles ร่วม, SiteLayout, Header, HomePage, HeroVideo, `tests/e2e/hero.spec.ts` (ใหม่), theme/navigation tests

**Interface:** `HeroVideo.astro` รับ `{ locale: Locale; videoSrc: string; posterSrc: string }`; ใช้ source/poster จากหน้าแรก มี accessible control และ media state ของตัวเอง ใช้ `data-hero-video` / `data-hero-toggle` เป็นจุดตรวจ ข้อความและ CTA เป็น HTML ใน HomePage

- [x] เพิ่ม regression tests ก่อนแก้: header link/menu คลิกได้บน home ที่ 390/1440; play แล้ว `currentTime` เดิน; pause แล้วเวลาหยุด; ชื่อ control เปลี่ยนตามสถานะ; media failure/play rejection ไม่ทำให้ปุ่มหรือหน้าเสีย; reduced motion ไม่ autoplay
- [x] รัน `bunx playwright test tests/e2e/hero.spec.ts` เก็บเหตุผลที่ fail ก่อนแก้ แยกข้อจำกัด decoder ของ test browser ออกจาก product failure; ถ้า browser ทดสอบเล่นไม่ได้ต้องมีหลักฐาน playback จาก browser ที่รองรับจริงก่อนรับงาน
- [x] กำหนด style ownership แก้ `.site-header` ที่ `garden.css` ทับค่า layering เดิม ใช้ page variant แบบ explicit หากจำเป็น; จำกัด cleanup เฉพาะ selector ที่เกี่ยวข้องและตรวจหน้ารอง
- [x] สร้าง HeroVideo และปรับ composition ตามหัวข้อ 4 นำ crest ใหญ่ออกจาก video ลด overlay/gradient/เงา และเอา badge จุดเขียวที่ไม่มีข้อมูลออก
- [x] เปลี่ยน heading token และ override `main h1, main h2` ที่ watercolor.css ให้ใช้ Noto Sans Thai Looped 400/500 ตามบทบาท จำกัด Mali ให้ caption/ข้อความสั้น ลดความเข้ม texture ตามข้อกำหนดล่าสุดโดยรักษา theme behavior; ตรวจ TH/EN ที่ 320/390/768/1440 และจอกว้าง 1920 ไม่ให้หัวเรื่องขาดเป็นคำเดี่ยวอย่าง “ดี…”
- [x] ตรวจทั้งวิดีโอและ poster กับข้อความ/หน้าสัตว์จริง แล้วรัน hero/theme/navigation tests ที่กระทบจนผ่าน
- [x] เก็บ composition ของ hero และ section แรกที่ 390/1440 ให้ผู้ใช้ตรวจบุคลิกก่อนขยายไปทุกหน้า; นี่เป็น checkpoint ของงานภาพ ไม่ใช่รื้ออนุมัติขอบเขตเดิม

### Task 3 — หน้าแรกที่พาไปเลือกประสบการณ์

**Dependencies:** Task 2; **Files:** HomePage, cafe-home.css, WishingCorner, Footer, `tests/e2e/experience-navigation.spec.ts` (ใหม่), theme/watercolor/locale tests

- [x] เพิ่ม tests สำหรับ primary CTA → same-locale Visit, secondary → home `#experiences`, สามประสบการณ์ → หน้าปลายทางถูกต้อง และ wishing corner → anchor เดิม
- [x] จัด section ตามหัวข้อ 3 ใช้ `localizedActivities(locale)` สำหรับราคา/เงื่อนไข ไม่ hardcode ตัวเลขซ้ำใน markup
- [x] เปลี่ยนเวลาเปิดหน้าแรกให้อ่าน regularHours และ holiday note เดียวกับ Visit ใช้ formatDay/dayName เดิม; ลบ “ทุกวัน” และข้อความที่สัญญาเครื่องดื่มแต่ปลายทางไม่มีรายการ
- [x] เพิ่ม behavior sticky CTA ด้วย IntersectionObserver ที่ hero actions; เมื่อ actions ยังเห็นไม่ซ้ำแถบล่าง เมื่อเลื่อนพ้น/ย้อนกลับแสดงและซ่อนถูกต้อง หน้ารองและ no-JS ยังมีทางไปเมนู/มาเที่ยว
- [x] ทดสอบ scroll ลง/ขึ้น, เข้า hash โดยตรง, keyboard focus ใกล้ขอบล่าง และ no-JS; ตรวจ interaction จริง ไม่ใช่ screenshot อย่างเดียว
- [x] รัน experience-navigation/theme/watercolor/locale tests ที่เกี่ยวข้อง แก้ accessible-name/selectors ตาม UI ใหม่โดยรักษา intent/assertions เรื่องปลายทาง ภาษา ราคา focus และ theme

### Task 4 — สัตว์และกิจกรรมเป็นเรื่องเดียวกัน

**Dependencies:** Task 1 inventory + Task 2 styles; **Files:** AnimalsPage, ActivitiesPage, activities.css, decor/catalog/i18n เฉพาะที่จำเป็น, experience-navigation และ menu/locale tests

- [x] จัดภาพจริงก่อนรายชื่อใน Animals และแยก Indoor/Outdoor ตามโบรชัวร์ เก็บรายชื่อเก่าเป็นส่วนเสริมที่ไม่รับประกันจำนวน/availability
- [x] เพิ่มเรื่องห้องเล่นกับแมวโดยใช้ภาพที่ 6 และคำบรรยายตรงสิ่งที่เห็น เชื่อมไปกลุ่ม Indoor เดิม; ทดสอบลิงก์ TH/EN โดยไม่เพิ่มโซนที่เจ็ดหรือค่าเข้าใหม่
- [x] ปรับ copy ให้เป็นเสียงร้าน โดยย้ายคำอธิบายกระบวนการทำเว็บออกจาก lead; คงที่มาและข้อจำกัดข้อมูลที่มีผลต่อการตัดสินใจ
- [x] จัด Activities ให้เห็นภาพประสบการณ์และ shortcut ราคาเร็ว รักษา package comparison, child terms, เวลา Outdoor และ anchor ที่ลิงก์จากภายนอก/ภาษาอื่นใช้
- [x] คงรายละเอียดกิจกรรมและอาหารเพิ่มครบ แม้หน้าแรกเลือกแสดงเพียงบางเรื่อง ไม่ตีความเรือพายหรือกิจกรรมซื้อเพิ่มว่ารวมฟรี
- [x] ทดสอบเลือกกลุ่มโซน→แพ็กเกจ, เปลี่ยนภาษาที่ anchor, ตัวเลข/หน่วยทั้งสองภาษา และเส้นทางจาก Animals ไปข้อมูลค่าเข้า
- [x] ตรวจภาพจริงของ Animals/Activities ทั้ง 390/1440: คนเห็นสัตว์ก่อนรายการยาวและหาแพ็กเกจได้จากลิงก์ชื่อชัด ไม่ใช้เกณฑ์ว่าต้องซ่อนราคาพ้นจอแรก

### Task 5 — เมนูและข้อมูลก่อนมาเที่ยวที่ต่อเนื่องกัน

**Dependencies:** Task 2 styles + Task 3 shared facts; **Files:** MenuPage, VisitPage, menu-catalog.css, tests menu/visit/locale

- [x] ลดพื้นที่ intro เมนูให้เห็นอาหารจริงเร็ว คง 47 รายการ หมวด ราคา ตัวเลือกและรายละเอียด HTML เมื่อปิด JS
- [x] ชื่อ CTA ทุกจุดตรงกับสิ่งที่ปลายทางมี ไม่เพิ่มรายการเครื่องดื่ม/ขนมโดยไม่มีแหล่งข้อมูล
- [x] จัด Visit ให้ข้อมูลเวลา/Outdoor/แพ็กเกจ/แผนที่และโทรหาเจอง่าย ใช้ข้อมูลร่วม ห้ามแก้สองเบอร์ Maps SEO หรือ noindex โดยไม่เกี่ยวกับงาน
- [x] ทดสอบเปลี่ยน hours ของ fixture ทดสอบแบบ disposable แล้วหน้าแรก/Visit แสดงตรงกัน คืน state หลังทดสอบโดยไม่เขียนข้อมูล production
- [x] รัน menu/visit/locale และ unit business/locale ที่กระทบ ตรวจจำนวนรายการ ตัวเลข หน่วย child terms สองเบอร์ และ no-JS menu

### Task 6 — ตรวจรวมและทบทวนอิสระ

**Dependencies:** Tasks 2–5; **Files:** tests เดิม/ใหม่, review folder, README และเอกสารประวัติที่เกี่ยวข้อง

- [x] รัน `bun run check`, `bun run test:unit`, `bun run test:e2e`, `bun run verify:content` ตรวจผลและข้อค้างจาก baseline ไม่อ้างว่าทั้งหมดผ่านถ้ายังมี required failure
- [x] รัน `bun run build` โดยไม่ให้ prepare-assets/build ชน dev watcher ที่ใช้ assets ชุดเดียวกันบน Windows; หยุดได้เฉพาะ server ของงานนี้ที่ยืนยันว่าไม่มีงานอื่นพึ่งอยู่ มิฉะนั้นใช้ checkout/test state แยก
- [x] ตรวจ rendered routes หลักไทย/อังกฤษที่ 320/390/768/1440, light/dark และ auto ทั้ง system light/dark; News/404 ตรวจ shared UI regression บันทึก viewport จริงทุกครั้งเพราะ browser action บางตัวอาจเปลี่ยนขนาดที่จำลองไว้
- [ ] ตรวจ 1920×1080 สำหรับ hero และ zoom 200% ที่ desktop; no overflow, no collision, ข้อความอ่านได้ contrast อย่างน้อย 4.5:1 สำหรับตัวเล็กและ 3:1 สำหรับตัวใหญ่/controls ที่เกี่ยวข้อง
- [x] ตรวจปุ่ม เมนู Escape/focus, locale hash, theme persistence, sticky CTA, video playing/paused/failure/reduced motion และ anchor arrival จริง พร้อมระบุ browser/อุปกรณ์ที่ตรวจ ไม่อ้างรองรับ iOS Safari จาก Chromium screenshot
- [x] Root self-review ด้วยเกณฑ์ด้านล่าง จากนั้น freeze HEAD + dirty/untracked hashes และขอ independent read-only review อีก session หนึ่งสำหรับความเสี่ยงของ visual/interaction ตามแนวทาง review ของงานเดิม ผู้ตรวจไม่แก้ product/tests หรืออ่อน assertions
- [x] บันทึก maker involvement, context ที่ผู้ตรวจได้รับ และ isolation limits แยก source/render/interaction; แก้ required findings แล้วรันเฉพาะ checks ที่ได้รับผล ไม่วน suite ทั้งหมดโดยไม่มีเหตุผล
- [x] อัปเดต README ให้ชี้ผลรอบใหม่เมื่อทำเสร็จ ระบุข้อจำกัดและสถานะ local-only คงประวัติรายงานเก่า ไม่แก้ผล PASS เก่าราวกับเป็นหลักฐานของโค้ดใหม่

## 7. เกณฑ์ตรวจรับและหลักฐาน

| เกณฑ์ | หลักฐานบังคับก่อนรับงานในเครื่อง |
|---|---|
| บุคลิกแบรนด์ | ภาพจริง hero + section แรก TH/EN 390/1440 เห็นสัตว์ชัด สีน้ำยังอยู่ กระดาษละเอียดไม่รบกวนเนื้อหา Mali เป็น accent ไม่มี crest/ข้อความบังจุดสำคัญ; ผู้ใช้เห็น composition และยืนยันว่าตรงทิศทาง |
| ความต่อเนื่อง | ตรวจหน้าแรก Animals Activities Menu Visit จริง ใช้ระบบตัวอักษร วัสดุ สี และ controls เดียวกันโดยไม่ทำทุกหน้าเป็น layout ซ้ำ |
| ความเข้าใจบริการ | อ่านได้ว่าคาเฟ่มีขั้นต่ำ, One Zone คือหนึ่งกลุ่ม, All Zone คือทุกโซน; ราคา/หน่วย/สิทธิประโยชน์/เด็ก/เวลา Outdoor ตรง source ทั้งสองภาษา |
| Navigation | เมนู header ถูกคลิกได้ทุกหน้า ภาษา/ธีม/ลิงก์หมวด/แผนที่/โทรถูกต้อง และ keyboard focus ไม่ถูก fixed bar บัง |
| Hero media | เล่นจริงมี frame/time progression, pause ได้, control ตรงสถานะ, poster/failure/reduced motion/no-JS ใช้งานได้; แค่เห็น source tag หรือ poster ยังไม่ผ่าน playback |
| Responsive | ไม่มีแนวนอนล้น/ปุ่มชน/หัวเรื่องตัดเสียความหมายที่ขนาดกำหนด; 200% zoom ยังเข้าถึง controls และเนื้อหา |
| Regression | check/unit/e2e/build ผ่าน และ content verification ไม่มี invalid; ไม่มีการลด scope ของ assertions เพื่อให้เขียว |
| Review | independent reviewer ตรวจ target ที่ freeze แล้ว ไม่มี required findings ค้าง; ระบุการตรวจของแต่ละคนตามจริง |

**Verdict:** FAIL เมื่อเกณฑ์บังคับล้มเหลว; BLOCKED เมื่อหลักฐานบังคับขาด; PASS เมื่อครบทั้งหมด ความชอบเชิงภาพต้องมีผู้ใช้ประเมิน ไม่แทนด้วยผล build

**การวิจัยเพิ่มเติม (ไม่ใช่สิ่งที่อ้างว่าได้ทำแล้ว):** ให้ผู้ใช้ใหม่ดูช่วงแรกแล้วอธิบายว่าที่นี่คืออะไร จากนั้นหาแพ็กเกจและเส้นทางโดยไม่ใบ้ บันทึกจุดติดขัด ใช้ประเมินความเข้าใจและแรงจูงใจจริง; การไม่มีงานวิจัยนี้ต้องระบุเป็นข้อจำกัด ห้ามแปลง source review เป็นข้อสรุปว่าลูกค้ารู้สึก luxury แล้ว

## 8. Review focus ที่ผูกกับงาน

1. **CSS order/header overlap:** Task 2 ต้องตรวจ click/hit target หน้าแรกและหน้ารอง ไม่ตรวจแต่ computed z-index
2. **วิดีโอไม่เล่นหรือ preference เปลี่ยน:** Task 2 ครอบคลุม autoplay blocked, media error, pause/play และ reduced motion; จำแนกข้อจำกัด test environment
3. **mobile CTA ทับ/ซ้ำและ focus:** Task 3 ตรวจเมื่อ scroll ทั้งสองทิศ เปิด hash และ keyboard navigation
4. **TH/EN และข้อมูลธุรกิจคลาดกัน:** Tasks 3–5 ตรวจตัวเลข หน่วย เวลาเปลี่ยน และ equivalent route/hash
5. **ภาพไม่ครบหรือ crop ซ่อนสัตว์:** Tasks 1–2 inventory + film frames; Tasks 4–6 ตรวจ real renders/fallback ไม่ให้ใช้ generated photo อ้างสถานที่จริง

## 9. ข้อมูลที่ขอเพิ่มได้ แต่ไม่ขวางการเริ่มงาน

- ได้รับภาพโต๊ะ สวน บ่อปลา กระต่าย เด็กให้อาหารแพะ และเด็กกับแมวแล้ว; ภาพบ้านจิ้งจอก/เฟนเนกและป้อนนมแพะยังไม่มีในชุดใหม่นี้ ใช้ภาพที่มีตามความหมายจริง ไม่เรียกภาพยื่นหญ้าว่าป้อนนม และไม่เรียกภาพแมวว่าเฟนเนก
- ภาพที่ 6 ชี้แจงแล้ว: ใช้เป็นเด็กกับแมวและเล่าเรื่องห้องเล่นกับแมว ไม่มีคำถามเรื่องชื่อ/การจับคู่ภาพค้าง
- รายการเครื่องดื่ม/ขนมพร้อมราคาถ้าต้องการให้หน้าเมนูครอบคลุม; ถ้ายังไม่มีรักษาขอบเขตเมนูอาหารและข้อความสอบถามที่ร้าน
- การยืนยันว่าโปรตะกร้า 80 บาทยังใช้และเงื่อนไขบริการล่าสุด ก่อนเผยแพร่จริง; ระหว่างออกแบบใช้ข้อมูลตาม snapshot พร้อม qualification เดิม
- หากต้องการให้มุมสัตว์นำภาพสวนชัดเป็นพิเศษ ให้เลือกจาก composition checkpoint; ค่าเริ่มต้นคือให้เห็นทั้งสัตว์กับสถานที่ การลด Mali และ texture ได้รับอนุญาตแล้ว ไม่ต้องขอซ้ำเพื่อทำตามแผน

## 10. สถานะเอกสารและประวัติ

- แผนฉบับนี้เป็นแผนงานปัจจุบันสำหรับการพัฒนารอบถัดไป แทนการกลับไปทำ hero ป้ายสีน้ำเต็มหน้าในแผนวันที่ 27 กันยายน
- การแก้ระหว่างเขียนแผนตามผู้ใช้: ลด Mali เป็น accent และลดความชัดของกระดาษได้ ข้อนี้แทนข้อบังคับเดิมเรื่อง Mali ทุกหัวเรื่องและ texture ชัด ส่วน TH/EN, theme และโลโก้เดิมยังคงไว้
- เพิ่มภาพอ้างอิงจริง 6 ภาพ เก็บต้นฉบับใน reference-data พร้อมบทบาทและข้อจำกัด crop ผู้ใช้แก้คำกำกับภาพที่ 6 จาก Fennec เป็นเด็กกับแมว / ห้องเล่นกับแมวแล้ว ไม่ทำ image editing ในขั้นเขียนแผน
- รายงานวันที่ 27 เป็นหลักฐานของ revision เดิมเท่านั้น ไม่ยกมาใช้รับรอง cinematic hero ที่เพิ่มภายหลัง
- การเขียนแผนครั้งนี้ไม่รัน application tests ไม่แก้ product ไม่ deploy; ตรวจเฉพาะความครบถ้วนของแผน ลิงก์อ้างอิง และ diff เอกสาร

## Implementation amendments — 28 กันยายน 2026

- ผู้ใช้เลือก doodle แนวสีน้ำให้เข้ากับเป็ด/เมียร์แคท; ใช้ watercolor components เดิมในจุดตกแต่งที่แสดงจริง
- ผู้ใช้เห็นด้วยกับพื้นเขียวมะกอกเข้มเฉพาะช่วงห้องแมว; ตรวจ contrast และ responsive แล้ว
- เพิ่มภาพอ้างอิงโบรชัวร์ 4 ภาพ ใช้ CSS frame ภาพกิจกรรม5รายการ/โซน6จุด ไม่แก้ต้นฉบับหรือราคา
- รายการก่อนแก้ที่เก็บไม่ครบและ native zoom ที่ยังไม่ตรวจคง unchecked; ตรวจ1920และ200% reflow-equivalentแล้ว รายละเอียดหลักฐาน/ข้อจำกัดใน ledger
- ข้อความประวัติว่าไม่ได้เริ่มงานด้านบนส่วนประวัติหมายถึงขั้นเขียนแผนเดิม; สถานะปัจจุบันอ้างหัวเอกสารและ ledger


### Follow-up decisions

- Remove white background in displayed header/footer logo using the original ink as an SVG mask.
- Replace font/emoji arrow glyphs with shared SVG paths across routes.
- Menu images always visible: this supersedes previous expandable gallery behavior. Keep all47 dishes, prices, locale paths and no-JS access.
- Implemented and checked in the follow-up evidence section of the current ledger.

### Current animal roster correction

User confirms all previously historical-listed animals are present; missing photos are only an asset gap. Supersedes the historical supplemental-directory requirement: show breed details within the known Indoor grouping, retain established Outdoor/other zone names, and place other animals visibly beside the roster without inventing their exact housing. Remove the collapsed historical list and old-post disclaimer. Implemented in AnimalsPage for TH/EN.

### Deployment authorized and completed
User subsequently requested deploy. Published to existing Cloudflare preview, version bd29a273-3d7c-4fac-884e-0528121e0e6d; this supersedes the original no-deploy scope/status. Staging fixture mode/noindex retained; live smoke checks recorded in deployment ledger.

