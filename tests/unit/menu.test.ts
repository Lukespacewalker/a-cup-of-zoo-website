import { expect, test } from "bun:test";
import { menuCatalog, sandwichExtras } from "../../src/lib/content/menu-catalog";
import { animalZones, animalFood, passes } from "../../src/lib/content/activities-catalog";

test("all 47 distinct food codes in the supplied 24-page menu retain their prices", () => {
  // Manually transcribed from the rendered source, including the B2/B4 promo duplicates.
  const expected = {
    SIG1: 179, SIG2: 179, SIG3: 179,
    A1: 129, A2: 119, A3: 149, A4: 139, A5: 159, A6: 159, A7: 159, A8: 89, A9: 169, A10: 99, A11: 189,
    B1: 139, B2: 169, B3: 189, B4: 169,
    V1: 139, V2: 179, V3: 179, V4: 139, V5: 179, V6: 139, V7: 219,
    S1: 159, S2: 179, S3: 179, S4: 159, M1: 239, M2: 279, M3: 239, M4: 259,
    R1: 119, R2: 119, R3: 119, R4: 119, R5: 119, R6: 89, R7: 109, R8: 129, R9: 129, R10: 129,
    P1: 99, P2: 129, P3: 129, P4: 129,
  };
  const dishes = menuCatalog.flatMap((section) => section.items);
  expect(dishes).toHaveLength(47);
  expect(Object.fromEntries(dishes.map((dish) => [dish.code, dish.price]))).toEqual(expected);
  expect(new Set(dishes.map((dish) => dish.code)).size).toBe(47);
});

test("rice protein choices and sandwich add-ons keep distinct prices and portions", () => {
  const dishes = menuCatalog.flatMap((section) => section.items);
  for (const code of ["R1", "R2", "R3", "R4", "R5", "R9", "R10"]) {
    const dish = dishes.find((item) => item.code === code)!;
    expect(dish.variants?.map((variant) => variant.price)).toEqual(code === "R9" || code === "R10" ? [129, 159] : [119, 149]);
    expect(dish.variants?.[0].label).toBe("หมู / หมูสับ / ไก่");
    expect(dish.variants?.[1].label).toBe("กุ้ง / ปลาหมึก / ทะเล / เบคอน");
  }
  expect(sandwichExtras[0].items.map((item) => item.price)).toEqual([30, 30, 20, 25]);
  expect(sandwichExtras[1].items.map((item) => item.price)).toEqual([30, 30, 20, 25, 20, 25]);
  expect(sandwichExtras[1].items.at(-1)?.name).toContain("10 กรัม");
});

test("passes and animal food preserve package prices without treating all access as free", () => {
  expect(passes.map((pass) => pass.price)).toEqual([249, 349]);
  expect(animalZones.indoor).toHaveLength(3);
  expect(animalZones.outdoor).toHaveLength(3);
  expect(animalFood.map((item) => item.price)).toEqual([40, 40, 20, 20, 20, 40, 50]);
});
