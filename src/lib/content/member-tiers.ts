import { translator, type Locale } from "../i18n/locale";

type GuestId = "none" | "once" | "monthly";
type CouponId = "animal-food" | "food-basket" | "drink-bogo" | "new-year-souvenir";
export interface MemberTier {
  id: "friend" | "buddy" | "besties" | "soulmate" | "family";
  name: string;
  spend: number;
  discount: number;
  guest: GuestId;
  couponIds: readonly CouponId[];
  birthdaySouvenir: boolean;
}

// Owner's Canva brief, archived 2026-10-27. Source index: reference-data/owner-feedback-2026-10-27/README.md.
// Entitlements use IDs and explicit flags so copy edits and spending thresholds cannot change benefits.
export const memberTiers: MemberTier[] = [
  { id: "friend", name: "Friend", spend: 0, discount: 0, guest: "none", couponIds: [], birthdaySouvenir: false },
  { id: "buddy", name: "Buddy", spend: 3000, discount: 0, guest: "once", couponIds: ["animal-food"], birthdaySouvenir: false },
  { id: "besties", name: "Besties", spend: 7000, discount: 5, guest: "once", couponIds: ["animal-food", "food-basket"], birthdaySouvenir: true },
  { id: "soulmate", name: "Soulmate", spend: 12000, discount: 10, guest: "monthly", couponIds: ["animal-food", "food-basket", "drink-bogo"], birthdaySouvenir: true },
  { id: "family", name: "Family", spend: 20000, discount: 15, guest: "monthly", couponIds: ["animal-food", "food-basket", "drink-bogo", "new-year-souvenir"], birthdaySouvenir: true },
];

export const memberGuestLabels = {
  none: { th: "—", en: "—" },
  once: { th: "1 ครั้ง", en: "Once" },
  monthly: { th: "เดือนละ 1 ครั้ง", en: "Once a month" },
} satisfies Record<GuestId, { th: string; en: string }>;
export const memberCouponLabels = {
  "animal-food": { th: "อาหารสัตว์", en: "Animal food" },
  "food-basket": { th: "ตะกร้าอาหารสัตว์", en: "food basket" },
  "drink-bogo": { th: "เครื่องดื่ม 1 ฟรี 1", en: "buy-one-get-one drink" },
  "new-year-souvenir": { th: "ของที่ระลึกปีใหม่", en: "New Year souvenir" },
} satisfies Record<CouponId, { th: string; en: string }>;

export function presentMemberTier(tier: MemberTier, previous: MemberTier | undefined, locale: Locale) {
  const t = translator(locale);
  const guestLabel = memberGuestLabels[tier.guest];
  const coupons = tier.couponIds.length ? tier.couponIds.map(id => {
    const label = memberCouponLabels[id];
    return { label: t(label.th, label.en), isNew: !!previous && !previous.couponIds.includes(id) };
  }) : [{ label: "—", isNew: false }];
  return {
    guest: t(guestLabel.th, guestLabel.en),
    coupons,
    newDiscount: !!previous && tier.discount > previous.discount,
    newGuest: !!previous && tier.guest !== previous.guest,
    newCoupon: coupons.some(coupon => coupon.isNew),
    birthdaySouvenir: tier.birthdaySouvenir,
    newBirthdaySouvenir: tier.birthdaySouvenir && !previous?.birthdaySouvenir,
  };
}
