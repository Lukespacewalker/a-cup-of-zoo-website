import type { ImageMetadata } from "astro";

// Owner's Canva brief, archived 2026-10-27. Source index: reference-data/owner-feedback-2026-10-27/README.md.
const assets = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/owner-brief/*.png",
  { eager: true },
);
export const ownerPhoto = (number: number) =>
  assets[
    `../../assets/owner-brief/asset-${String(number).padStart(2, "0")}.png`
  ].default;
export const menuBooks = {
  food: "https://heyzine.com/flip-book/72a5470ad6.html",
  drinks: "https://heyzine.com/flip-book/587e5387cd.html",
};
export const partners = [
  { name: "NSM", image: 30 },
  { name: "SBS Rangsit", image: 32 },
  { name: "BG Pathum United", image: 33 },
  { name: "PKAH", image: 34 },
  { name: "24 Sleep Resort", image: 29 },
  { name: "Petopia", image: 31 },
];
export const memberRewards = [
  { points: 20, th: "ป้ายเอมะเขียนขอพร", en: "Ema wishing plaque" },
  { points: 20, th: "อาหารสัตว์ 1 อย่าง", en: "One animal food item" },
  {
    points: 40,
    th: "จุ่มสัตว์ 1 จุ่ม สุ่มตุ๊กตาสัตว์กลับบ้าน",
    en: "One lucky dip for an animal toy to take home",
  },
  { points: 40, th: "ตะกร้าอาหารสัตว์", en: "Animal food basket" },
  { points: 50, th: "เครื่องดื่ม 1 แก้ว", en: "One drink" },
  { points: 100, th: "One Zone Pass", en: "One Zone Pass" },
  { points: 120, th: "All Zone Pass", en: "All Zone Pass" },
];
