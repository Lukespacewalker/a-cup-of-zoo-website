import type { PostDto, PublicVenueDto } from "@lukespace-cms/client";

const hours = [1, 2, 3, 4, 5, 6, 7].map((isoWeekday) => isoWeekday === 2
  ? { isoWeekday: isoWeekday as 1 | 2 | 3 | 4 | 5 | 6 | 7, closed: true, opens: null, closes: null }
  : { isoWeekday: isoWeekday as 1 | 2 | 3 | 4 | 5 | 6 | 7, closed: false, opens: "10:00", closes: "19:00" });

const media = (id: string, altTh: string, width = 1080, height = 1080) => ({ id, url: "", altTh, width, height });

export const fixtureVenue: PublicVenueDto = {
  id: "venue",
  version: 1,
  publishedAt: "2026-09-24T00:00:00.000Z",
  media: [
    media("cat-portrait", "แมวของร้านกำลังอยู่ในภาพระยะใกล้"),
    media("cats-and-dog", "แมวและสุนัขอยู่ด้วยกัน"),
    media("ducks-pond", "เป็ดในบ่อน้ำของร้าน"),
    media("cafe-garden-seating", "มุมนั่งกลางแจ้งของร้าน มีโต๊ะและต้นไม้"),
    media("cafe-interior-gallery", "มุมนั่งภายในคาเฟ่"),
    media("drinks", "เครื่องดื่มของร้าน"),
    media("croissant", "ขนมอบของร้าน"),
    media("entrance-promo-banner", "ภาพทางเข้าของร้านซึ่งมีข้อความอยู่ในภาพ", 1640, 856),
    media("pond-promo-graphic", "ภาพบ่อน้ำของร้านซึ่งมีกราฟิกอยู่ในภาพ"),
  ],
  content: {
    displayName: "A Cup of Zoo",
    locationLabel: "คลอง 6 ปทุมธานี",
    addressLine: "27/8 ม.3 ถ.เลียบคลองแอล 5-6 ซอย สุทธิพันธ์ 11 ต.คลองหก อ.คลองหลวง ปทุมธานี 12120",
    phoneE164: "+66989838037",
    mapsUrl: "https://maps.app.goo.gl/A6AVc2ScgEJwSrbVA",
    facebookUrl: "https://www.facebook.com/Acupofzoocafe/",
    timezone: "Asia/Bangkok",
    regularHours: hours,
    hoursExceptions: [],
    holidayNote: "ตามข้อมูลที่ได้รับ ร้านเปิดในวันอังคารที่ตรงกับวันหยุดนักขัตฤกษ์ โปรดตรวจสอบประกาศร้านก่อนเดินทาง",
    hoursVerification: "source_verified",
    admissionText: "สอบถามค่าเข้าชมและเงื่อนไขกับทางร้าน",
    animals: [
      { id: "cat-portrait", title: "แมว", description: "แมวของร้านจากภาพที่ได้รับมา ยังไม่ได้ตั้งชื่อหรือระบุสายพันธุ์", mediaAssetId: "cat-portrait", featured: true, visible: true, sortOrder: 0 },
      { id: "cats-and-dog", title: "แมวและสุนัข", description: "แมวและสุนัขอยู่ด้วยกันในภาพจากร้าน ไม่ได้ระบุชื่อรายตัวหรือสายพันธุ์", mediaAssetId: "cats-and-dog", featured: false, visible: true, sortOrder: 1 },
      { id: "ducks-pond", title: "เป็ด", description: "เป็ดในบ่อน้ำของร้าน", mediaAssetId: "ducks-pond", featured: true, visible: true, sortOrder: 2 },
    ],
    activities: [
      { id: "cafe-garden-seating", title: "มุมนั่งในสวน", description: "มุมนั่งกลางแจ้งของร้าน มีโต๊ะและต้นไม้ ภาพนี้ไม่ได้ยืนยันว่าสัมผัสหรือให้อาหารสัตว์ได้", mediaAssetId: "cafe-garden-seating", featured: true, visible: true, sortOrder: 0 },
      { id: "cafe-interior-gallery", title: "มุมนั่งในร้าน", description: "บรรยากาศมุมนั่งภายในคาเฟ่", mediaAssetId: "cafe-interior-gallery", featured: false, visible: true, sortOrder: 1 },
      { id: "pond", title: "ริมน้ำ", description: "พื้นที่ริมน้ำที่มีเป็ดในภาพ ไม่ได้ยืนยันรอบกิจกรรมหรือค่าใช้จ่าย", mediaAssetId: "ducks-pond", featured: false, visible: true, sortOrder: 2 },
    ],
    menuHighlights: [
      { id: "drinks", title: "เครื่องดื่ม", description: "เครื่องดื่มของร้านจากภาพที่ได้รับมา ยังไม่มีชื่อสูตรหรือราคาที่ยืนยัน", mediaAssetId: "drinks", featured: true, visible: true, sortOrder: 0 },
      { id: "croissant", title: "ขนมอบ", description: "ขนมอบของร้านจากภาพที่ได้รับมา ยังไม่มีชื่อเมนูหรือราคาที่ยืนยัน", mediaAssetId: "croissant", featured: false, visible: true, sortOrder: 1 },
    ],
    faqs: [
      { id: "hours", question: "วันอังคารเปิดไหม", answer: "ตามข้อมูลจากบรีฟ ร้านปิดวันอังคาร และเปิดในวันอังคารที่ตรงกับวันหยุดนักขัตฤกษ์ เวลายังไม่ได้ยืนยันจากเจ้าของร้าน" },
      { id: "admission", question: "ค่าเข้าชมเท่าไร", answer: "สอบถามค่าเข้าชมและเงื่อนไขกับทางร้าน ยังไม่มีตัวเลขที่ยืนยัน" },
      { id: "phone", question: "โทรหาร้านได้อย่างไร", answer: "บรีฟระบุ 098 983 8037 ส่วนรายการ Google Maps ของลิงก์ที่ให้มาแสดง 092 279 1890 สองแหล่งไม่ตรงกัน จึงยังไม่ยืนยันเบอร์เดียว" },
      { id: "parking", question: "มีที่จอดรถไหม", answer: "ตามข้อมูลจากบรีฟมีที่จอดรถ แต่ยังไม่ยืนยันจำนวนที่หรือค่าบริการ" },
    ],
  },
};

export const fixturePosts: PostDto[] = [];

export const mapsUrl = "https://maps.app.goo.gl/A6AVc2ScgEJwSrbVA";
export const briefPhone = { display: "098 983 8037", e164: "+66989838037", source: "บรีฟ" };
export const mapsPhone = { display: "092 279 1890", e164: "+66922791890", source: "Google Maps" };
