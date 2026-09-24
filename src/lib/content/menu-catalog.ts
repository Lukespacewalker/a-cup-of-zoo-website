import type { ImageMetadata } from "astro";
import moodFood from "../../assets/menu/mood-food.jpg";

export type MenuItem = {
  id: string;
  name: string;
  note: string;
  price: string | null;
  highlight: boolean;
  shopMediaId: string | null;
};

export type MenuSection = {
  id: "drinks" | "desserts" | "food";
  index: string;
  title: string;
  lede: string;
  mood: ImageMetadata | null;
  moodAlt: string;
  items: MenuItem[];
};

/** Add a dish by appending to items. Set highlight for the large feature. Leave price null until the cafe confirms it. */
export const menuCatalog: MenuSection[] = [
  {
    id: "drinks",
    index: "01",
    title: "เครื่องดื่ม",
    lede: "ภาพจากร้าน ชื่อแก้วและราคายังไม่ยืนยัน",
    mood: null,
    moodAlt: "",
    items: [
      {
        id: "shop-drinks",
        name: "เครื่องดื่มของร้าน",
        note: "จากภาพที่ร้านส่งมา ยังไม่ระบุชื่อสูตร",
        price: null,
        highlight: true,
        shopMediaId: "drinks",
      },
    ],
  },
  {
    id: "desserts",
    index: "02",
    title: "ของหวาน",
    lede: "ขนมอบจากภาพร้าน ยังไม่ระบุชื่อเมนู",
    mood: null,
    moodAlt: "",
    items: [
      {
        id: "shop-pastry",
        name: "ขนมอบของร้าน",
        note: "จากภาพที่ร้านส่งมา ยังไม่ระบุชื่อหรือราคา",
        price: null,
        highlight: true,
        shopMediaId: "croissant",
      },
    ],
  },
  {
    id: "food",
    index: "03",
    title: "อาหาร",
    lede: "รายการยังว่าง พร้อมใส่ได้หลายเมนู",
    mood: moodFood,
    moodAlt: "ภาพจัดวางจานอาหารชั่วคราว ไม่ใช่เมนูของร้าน",
    items: [],
  },
];
