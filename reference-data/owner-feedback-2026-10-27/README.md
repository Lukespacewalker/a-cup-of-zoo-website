# ข้อมูลบรีฟเจ้าของร้าน A Cup of Zoo วันที่ 27 ตุลาคม 2026

ต้นทาง: [Website Brief_A Cup of Zoo cafe](https://canva.link/w28jcu2fj17qetw) จำนวน 11 หน้า

ลิงก์ที่เปิดได้: https://www.canva.com/design/DAHYz2902Do/uNqLI2aFUF5ZNF389Mwscg/view

ดู [รายการงานเทียบกับเว็บไซต์ปัจจุบัน](../../docs/owner-feedback-2026-10-27.md) สำหรับสิ่งที่ต้องปรับก่อนเปิดจริง

อัปเดต28ตุลาคม: เทียบหน้า4กับ Canva อีกครั้ง ดาวน์โหลด [ภาพรวมสัตว์1599×601](assets/animal-cards-source-2026-10-28.png) เพิ่มแล้ว รายชื่อครบ23ตัวอยู่ใน [animal-roster.json](animal-roster.json) โดยเจ้าของยืนยัน MINE และ YIN-YANG ที่ซ้ำให้รวมเป็นตัวเดียว พิกัดภาพที่แยกและค่าแฮชอยู่ใน [animal-assets-manifest.json](animal-assets-manifest.json) ดู [การนำเข้า CMS และระบบโหวต](../../docs/cms-animal-voting.md)

## ไฟล์ที่เก็บ

| ไฟล์ | เนื้อหา |
|---|---|
| `slides/slide-01.png` ถึง `slide-11.png` | ภาพย่อจาก Canva grid ขนาด 596 × 335 สำหรับตรวจลำดับและภาพรวม ไม่ใช่ export ความละเอียดเต็ม |
| `assets/asset-01.png` ถึง `asset-36.png` | ภาพ PNG ที่ Canva viewer โหลด ใช้ภาพเหล่านี้อ่านรายละเอียดในโปสเตอร์และแผนผัง |
| [extracted-text.json](extracted-text.json) | ข้อความจาก DOM ของแต่ละหน้า หน้า 1 และ 7 เป็นภาพจึงไม่มีข้อความ DOM |
| [drinks-menu-source.pdf](drinks-menu-source.pdf) | เล่ม Beverage & Dessert 27 หน้า จาก [Heyzine](https://heyzine.com/flip-book/587e5387cd.html) ที่บรีฟหน้า 5 ระบุ |
| [drinks-menu-source.json](drinks-menu-source.json) | ข้อความดิบจาก PDF แยกหน้า อาจมีตัวอักษรซ้ำ ลำดับคอลัมน์และอักขระไทยผิดจากการ extraction ต้องตรวจภาพ PDF ก่อนนำราคาไปใช้ |
| [asset-manifest.json](asset-manifest.json) | ขนาดไฟล์ ความละเอียด SHA-256 และที่มาของภาพ/PDF รวม 48 ไฟล์ |
| [source-inspection.json](source-inspection.json) | commit และ hash ของ source ที่นำมาเทียบ พร้อมข้อมูลที่อ่านจาก preview |

PNG เป็นสำเนาไบต์จากทรัพยากรที่ browser โหลด ไม่ได้ปรับแต่งภาพ เก็บ asset ที่ซ้ำกันในหลายหน้าเพียงครั้งเดียว ค่า `observedOnSlides` ใน manifest หมายถึงภาพที่อยู่ใน DOM ขณะเปิดหน้านั้น ซึ่ง Canva อาจ preload หน้าข้างเคียง ให้ใช้ดัชนีด้านล่างอ้างตำแหน่งเนื้อหาจริง

## ดัชนีภาพและหน้า

| หน้า Canva | เนื้อหา | ไฟล์ภาพประกอบ |
|---|---|---|
| [1](slides/slide-01.png) | ภาพหน้าแรกเว็บไซต์ปัจจุบัน | asset-01 |
| [2](slides/slide-02.png) | รายการความต้องการและหมวดเว็บไซต์ | ข้อความใน extracted-text.json |
| [3](slides/slide-03.png) | แพ็กเกจ Free Zone กิจกรรม และ Map Guide | asset-02 ถึง asset-05 |
| [4](slides/slide-04.png) | ตัวอย่าง leaderboard โหวต รายชื่อสัตว์ และแนวคิดกล้อง | asset-06 ถึง asset-14 |
| [5](slides/slide-05.png) | ลิงก์เมนูอาหารและเครื่องดื่ม | ข้อความใน extracted-text.json |
| [6](slides/slide-06.png) | Group Tour & Events | asset-15 ถึง asset-21 |
| [7](slides/slide-07.png) | ภาพกิจกรรม Suzuki | asset-22 ถึง asset-25 |
| [8](slides/slide-08.png) | งานโฆษณา รีวิว พรีเซ็นเตอร์ | asset-26 และ asset-27 |
| [9](slides/slide-09.png) | ภาพตัวอย่างบริการ Google Tag Manager | asset-28 |
| [10](slides/slide-10.png) | โลโก้พาร์ตเนอร์ | asset-29 ถึง asset-34 |
| [11](slides/slide-11.png) | แนวคิดเกมและข้อมูลสมัคร/สิทธิสมาชิก | asset-35 และ asset-36 |

## ภาพที่ใช้ต่อบ่อย

- [แพ็กเกจ](assets/asset-03.png), [กิจกรรม](assets/asset-04.png), [แผนผังร้าน](assets/asset-05.png)
- จิ้งจอก: [NAMA](assets/asset-07.png), [DAIFUKU](assets/asset-08.png), [DORAYAKI](assets/asset-09.png), [MOCHI](assets/asset-10.png), [SENBEI](assets/asset-11.png)
- [เมียร์แคท](assets/asset-12.png), [รวมหมา/แมว](assets/asset-13.png)
- [สมัครสมาชิก](assets/asset-35.png), [ตารางระดับสมาชิกและแลกแต้ม](assets/asset-36.png)

เมนูอาหารใช้ลิงก์ https://heyzine.com/flip-book/72a5470ad6.html ซึ่งเป็นลิงก์เดียวกับหลักฐานเดิมใน [บันทึกนำเข้าเมนู](../../docs/menu-import.md) รอบนี้ไม่ได้ดาวน์โหลดเล่มอาหารซ้ำหรือยืนยันว่าทุกหน้าของเล่มออนไลน์ไม่เปลี่ยนจากสำเนาเก่า

PDF เครื่องดื่มตรวจจำนวนหน้าด้วย pypdf และตรวจภาพหน้าปกกับหน้า 6, 16, 27 ที่ render ด้วย Poppler ยังไม่ใช่การตรวจราคาครบทุกรายการ ข้อความดิบไม่ควรใช้เป็น catalog โดยอัตโนมัติ
