import { expect, test } from "bun:test";
import {
  memberTiers,
  memberCouponLabels,
  memberGuestLabels,
  presentMemberTier,
} from "../../src/lib/content/member-tiers";

test("member benefit additions preserve the owner brief's five tiers", () => {
  expect(
    memberTiers.map((tier, index) => {
      const presentation = presentMemberTier(
        tier,
        memberTiers[index - 1],
        "en",
      );
      return [
        tier.name,
        tier.spend,
        tier.discount,
        presentation.newDiscount,
        presentation.newGuest,
        presentation.newCoupon,
        tier.birthdaySouvenir,
        presentation.newBirthdaySouvenir,
      ];
    }),
  ).toEqual([
    ["Friend", 0, 0, false, false, false, false, false],
    ["Buddy", 3000, 0, false, true, true, false, false],
    ["Besties", 7000, 5, true, false, true, true, true],
    ["Soulmate", 12000, 10, true, true, true, true, false],
    ["Family", 20000, 15, true, false, true, true, false],
  ]);
  expect(presentMemberTier(memberTiers[0], undefined, "en").coupons).toEqual([
    { label: "—", isNew: false },
  ]);
});

test("changing member benefit labels cannot change entitlements or split coupons", () => {
  const originalGuests = structuredClone(memberGuestLabels);
  const originalCoupons = structuredClone(memberCouponLabels);
  try {
    memberGuestLabels.once.en = "Same guest label";
    memberGuestLabels.monthly.en = "Same guest label";
    memberGuestLabels.once.th = "Same guest label";
    memberGuestLabels.monthly.th = "Same guest label";
    for (const label of Object.values(memberCouponLabels))
      label.th = label.en = "Same coupon + label";
    const soulmate = presentMemberTier(memberTiers[3], memberTiers[2], "en");
    expect(soulmate.guest).toBe("Same guest label");
    expect([soulmate.newGuest, soulmate.newCoupon]).toEqual([true, true]);
    expect(soulmate.coupons).toEqual([
      { label: "Same coupon + label", isNew: false },
      { label: "Same coupon + label", isNew: false },
      { label: "Same coupon + label", isNew: true },
    ]);
  } finally {
    Object.assign(memberGuestLabels, originalGuests);
    Object.assign(memberCouponLabels, originalCoupons);
  }
});

test("birthday souvenirs follow the explicit entitlement rather than the spend threshold", () => {
  const friend = { ...memberTiers[0], spend: 50000 };
  const besties = { ...memberTiers[2], spend: 0 };
  expect(presentMemberTier(friend, undefined, "th").birthdaySouvenir).toBe(
    false,
  );
  expect(
    presentMemberTier(besties, memberTiers[1], "th").birthdaySouvenir,
  ).toBe(true);
  expect(
    presentMemberTier(besties, memberTiers[1], "th").newBirthdaySouvenir,
  ).toBe(true);
});
