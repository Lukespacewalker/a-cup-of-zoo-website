type Pricing =
  number | [hot: number | null, iced: number | null, blended?: number];

type Drink = [th: string, en: string, pricing: Pricing];

interface DrinkSection {
  id: string;
  title: { th: string; en: string };
  items: Drink[];
}

// Owner's drinks-menu-source.pdf, pp. 3–27. Option prices are hot, iced,
// then blended, in baht. The passion fruit smoothie is listed on p. 18.
export const drinkSections: DrinkSection[] = [
  {
    id: "coffee",
    title: { th: "กาแฟ", en: "Coffee" },
    items: [
      ["อเมริกาโน่", "Americano", [65, 75]],
      ["อเมริกาโน่น้ำผึ้ง", "Honey Americano", [75, 95]],
      ["อเมริกาโน่น้ำผึ้งมะนาว", "Honey Lemon Americano", [85, 105]],
      ["อเมริกาโน่น้ำส้ม", "Orange Americano", [null, 105]],
      ["อเมริกาโน่น้ำช่อดอกมะพร้าว", "Coconut Flower Americano", [null, 115]],
      ["เอสเปรสโซ่", "Espresso", [65, 90]],
      ["ลาเต้", "Latte", [75, 90]],
      ["คาปูชิโน่", "Cappuccino", [75, 90]],
      ["มอคค่า", "Mocha", [80, 95, 125]],
      ["คาราเมลมัคคิอาโต", "Caramel Macchiato", [90, 115, 155]],
      ["ไวท์ช็อกโกแลตลาเต้", "White Choco Latte", [95, 125]],
      ["กาแฟปั่น", "Coffee Frappuccino", [null, null, 125]],
    ],
  },
  {
    id: "tea-matcha",
    title: { th: "ชาและมัทฉะ", en: "Tea & matcha" },
    items: [
      ["ชาไทย", "Thai Tea", [75, 95, 115]],
      ["ชาเขียวนม", "Milk Green Tea", [85, 105, 125]],
      ["ชาดำ", "Black Tea", [null, 75]],
      ["ชาพีช", "Peach Tea", [null, 85]],
      ["ชามะนาว", "Lemon Tea", [null, 95]],
      ["มัทฉะเพียว", "Pure Matcha", [85, 115]],
      ["มัทฉะลาเต้", "Matcha Latte", [95, 135, 155]],
      ["มัทฉะน้ำผึ้งมะนาว", "Matcha Honey Lemon", [null, 135]],
      ["มัทฉะน้ำช่อดอกมะพร้าว", "Matcha Coconut Flower", [null, 145]],
    ],
  },
  {
    id: "cocoa-milk",
    title: { th: "โกโก้และนม", en: "Cocoa & milk" },
    items: [
      ["โกโก้", "Cocoa", [75, 95, 115]],
      ["โกโก้สตรอว์เบอร์รี", "Bloody Cocoa", [null, 115]],
      ["นมสดอัญชัน", "Butterfly Pea Milk", [null, 115]],
      ["นมชมพู", "Pink Milk", [null, 85, 105]],
      ["นมสดสตรอว์เบอร์รี", "Strawberry Milk", [null, 95, 115]],
      ["นมสดคาราเมล", "Caramel Milk", [75, 95, 115]],
      ["นมสด", "Fresh Milk", [65, 85, 105]],
    ],
  },
  {
    id: "sodas",
    title: { th: "โซดา", en: "Sodas" },
    items: [
      ["บ๊วยซากุระโซดา", "Sakura Plum Soda", [null, 125, 145]],
      ["เสาวรสยูซุโซดา", "Passion Yuzu Soda", [null, 125]],
      ["ลิ้นจี่กุหลาบโซดา", "Lychee Blossom Soda", [null, 135]],
      ["พีชเลมอนโซดา", "Peach Lemonade Soda", [null, 125]],
      ["บลูฮาวาย", "Blue Hawaii", [null, 95]],
      ["สตรอว์เบอร์รีโซดา", "Strawberry Soda", [null, 95]],
      ["แอปเปิลเขียวโซดา", "Green Apple Soda", [null, 95]],
      ["พีชโซดา", "Peach Soda", [null, 95]],
      ["เลมอนอัญชันโซดา", "Butterfly Pea Lime Soda", [null, 95]],
      [
        "บัตเตอร์เบียร์ (คาราเมลโซดา)",
        "Butter Beer (Caramel Soda)",
        [null, 95],
      ],
      ["แดงโซดา", "Red Soda", [null, 85, 95]],
      ["แดงมะนาวโซดา", "Red Sour Soda", [null, 95, 115]],
      ["มะนาวโซดา", "Lime Soda", [null, 95, 115]],
      ["น้ำผึ้งมะนาวโซดา", "Honey Lime Soda", [null, 100, 120]],
    ],
  },
  {
    id: "fruit-smoothies",
    title: { th: "น้ำผลไม้และสมูทตี้", en: "Fruit & smoothies" },
    items: [
      ["น้ำช่อดอกมะพร้าว", "Coconut Flower Juice", [null, 95, 125]],
      ["สตรอว์เบอร์รีสมูทตี้", "Strawberry Smoothie", [null, null, 145]],
      ["เสาวรสสมูทตี้", "Passion Fruit Smoothie", [null, null, 145]],
    ],
  },
  {
    id: "other-drinks",
    title: { th: "เครื่องดื่มอื่น ๆ", en: "Other drinks" },
    items: [
      ["น้ำเปล่า", "Water", 15],
      ["โค้กออริจินัล / โค้กซีโร่", "Coke Original / Zero", 30],
      ["น้ำแข็งแก้ว", "Cup of Ice", 4],
    ],
  },
];

export const coffeeExtras: Drink[] = [
  ["เพิ่มช็อตกาแฟ", "Extra espresso shot", 15],
  ["วิปครีม", "Whipped cream", 15],
];
