// Source: shop menu, pages 2–3 and 24. See docs/menu-import.md.
// IDs keep translations attached to the menu item when display order changes.
export const admissionSummary =
  "โซนคาเฟ่ไม่มีค่าเข้า สั่งอาหารหรือเครื่องดื่มขั้นต่ำ 1 ออร์เดอร์ต่อคน ส่วนโซนสัตว์มี One Zone Pass 249 บาท และ All Zone Pass 349 บาท";
export const passes = [
  {
    id: "one-zone",
    name: "One Zone Pass",
    price: 249,
    description: "เลือกกลุ่มโซน Indoor หรือ Outdoor อย่างใดอย่างหนึ่ง",
    benefits: [
      "เข้าโซนที่เลือกได้ไม่จำกัดเวลาในช่วงเปิดบริการ",
      "ส่วนลดอาหารและเครื่องดื่ม 95 บาท",
      "เลือก Indoor: รับถุงเท้า",
      "เลือก Outdoor: รับป้ายไม้อธิษฐานเอมะ",
    ],
  },
  {
    id: "all-zone",
    name: "All Zone Pass",
    price: 349,
    description: "เที่ยวครบทั้ง Indoor และ Outdoor",
    benefits: [
      "เข้าได้ทุกโซน ไม่จำกัดเวลาในช่วงเปิดบริการ",
      "ส่วนลดอาหารและเครื่องดื่ม 95 บาท",
      "ตะกร้าอาหารสัตว์ มูลค่า 120 บาท",
      "ถุงเท้าและป้ายไม้อธิษฐานเอมะ",
    ],
  },
] as const;
export const animalZones = {
  indoor: [
    "ห้องน้องหมาและน้องแมว",
    "โซนเมียร์แคทและแพรี่ด็อก",
    "โซนน้องอีเห็น",
  ],
  outdoor: [
    "บ้านจิ้งจอก (Red Fox, Marble Fox และ Arctic Fox)",
    "บ้านแพะแคระมินิ",
    "บ้านกระต่าย",
  ],
};
export const experiences = [
  {
    id: "basket" as const,
    name: "ตะกร้าอาหารสัตว์",
    price: 80,
    unit: "ตะกร้า",
    originalPrice: 120,
    note: "ราคาโปรโมชันที่ระบุในเมนู รวมอาหารหมาและแมว อาหารแพะ หญ้าแพะ และอาหารปลา",
  },
  {
    id: "alligator-gar" as const,
    name: "ให้อาหารปลาอัลลิเกเตอร์",
    price: 50,
    unit: "3 ไม้",
    note: "ให้อาหารปลาที่บ่อ ตามคำแนะนำของพนักงาน",
  },
  {
    id: "goat-milk" as const,
    name: "ป้อนนมแพะแคระ",
    price: 40,
    unit: "ขวด",
    note: "ช่วงเวลาเล็ก ๆ กับน้องแพะ",
  },
  {
    id: "ema" as const,
    name: "เขียนป้ายไม้อธิษฐานเอมะ",
    price: 59,
    unit: "แผ่น",
    note: "เขียนคำอธิษฐานบนป้ายไม้",
  },
  {
    id: "koi" as const,
    name: "ให้อาหารปลาคาร์ฟ",
    price: 20,
    unit: "ถุง",
    note: "แวะชมปลาคาร์ฟและให้อาหารที่บ่อ",
  },
];
export const animalFood = [
  { id: "dog-cat", name: "อาหารน้องหมาและน้องแมว", price: 40, note: "" },
  {
    id: "goat-rabbit",
    name: "อาหารน้องแพะและน้องกระต่าย",
    price: 40,
    note: "",
  },
  { id: "grass", name: "หญ้าน้องแพะและน้องกระต่าย", price: 20, note: "" },
  { id: "fish-duck", name: "อาหารน้องปลาและน้องเป็ด", price: 20, note: "" },
  { id: "bird", name: "อาหารน้องนก", price: 20, note: "จำนวนจำกัดในแต่ละวัน" },
  { id: "goat-milk", name: "นมแพะ 1 ขวด", price: 40, note: "" },
  {
    id: "alligator-gar",
    name: "อาหารปลาอัลลิเกเตอร์ 3 ไม้",
    price: 50,
    note: "",
  },
] as const;
export const gardenSpots = [
  "คาเฟ่และร้านอาหาร",
  "Indoor Pet Zone",
  "สวนคุรามะ",
  "เซียมซีจิ้งจอกเก้าหาง",
  "บ่อปลาอัลลิเกเตอร์",
  "Little Farm Friends",
  "สวนญี่ปุ่น",
  "บัวสี่ทิศ",
  "บ่อปลาคาร์ฟ",
  "บ้านจิ้งจอก",
  "บ้านกระต่าย",
  "สวนตามใจฉัน",
  "บ้านแพะแคระมินิ",
  "สะพานแดงญี่ปุ่น",
  "ท่าเรือพายชมวิว",
  "สวนทะเลทราย",
];
