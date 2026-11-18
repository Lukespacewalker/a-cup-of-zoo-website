import type { PublicVenueDto } from "@lukespace-cms/client";
import portraitSources from "../../../reference-data/animal-party-members/portraits.json";
import referenceSources from "../../../reference-data/animal-party-members/reference-members.json";
import { partyIds, type PartyId } from "../voting/party-ids";
import { translator, type Locale } from "../i18n/locale";

type Localized = readonly [th: string, en: string];
type MapPosition = readonly [x: number, y: number];

interface PartyDetails {
  group: Localized;
  name: Localized;
  slogan: Localized;
  pin: MapPosition;
  memberIds?: readonly string[];
}

interface MemberImageSource {
  partyId: string;
  id: string;
  nameTh: string;
  nameEn: string;
  kind?: string;
  noteTh?: string;
  noteEn?: string;
}

const memberImageSources: MemberImageSource[] = [
  ...portraitSources,
  ...referenceSources.members,
];

// The 14 groups and the individual names come from the owner's Canva brief.
// Positions are percentages of the full gouache map.
const parties: Record<PartyId, PartyDetails> = {
  dog: {
    group: ["สุนัข", "Dogs"],
    name: ["พรรคหางไม่มีพัก", "The Wagging Tails"],
    slogan: [
      "ใครเดินผ่าน เรากระดิกหางให้หมด",
      "Walk past us and we'll wag for you.",
    ],
    pin: [21, 39],
    memberIds: [
      "kai-jew",
      "kai-down",
      "candy",
      "mine",
      "yin-yang",
      "moo-krob",
      "khai-yiao-ma",
      "nam-lieap",
      "khao-chao",
      "look-chin",
      "sai-krok",
    ],
  },
  cat: {
    group: ["แมว / แมวป่า", "Cats & wildcats"],
    name: ["พรรคงีบก่อน", "The Nap First Party"],
    slogan: [
      "ทุกนโยบายผ่านมติแล้ว ขออีกห้านาที",
      "Motion passed. Five more minutes, please.",
    ],
    pin: [60, 20],
    memberIds: ["tart", "sum-lee", "veres"],
  },
  bird: {
    group: ["นก", "Birds"],
    name: ["พรรคจิ๊บทุกข่าว", "The Early Birds"],
    slogan: [
      "ข่าวดีเราร้อง ข่าวลือเราร้องดังกว่า",
      "We chirp the news and squawk the gossip.",
    ],
    pin: [88, 12],
  },
  civet: {
    group: ["อีเห็น", "Civets"],
    name: ["พรรคกะดึก", "The Night Shift"],
    slogan: [
      "พระอาทิตย์เลิกงาน ถึงคิวเราเข้าเวร",
      "When the sun clocks out, we clock in.",
    ],
    pin: [92, 32],
  },
  fox: {
    group: ["จิ้งจอก", "Foxes"],
    name: ["พรรคหางฟู", "The Fluffy Tails"],
    slogan: [
      "หางฟูได้อีก ขอแค่ไม่มีลมย้อน",
      "We stand for fluff and against headwinds.",
    ],
    pin: [41, 46],
    memberIds: ["nama", "daifuku", "dorayaki", "mochi", "senbei"],
  },
  meerkat: {
    group: ["เมียร์แคต", "Meerkats"],
    name: ["พรรคยืนเฝ้า", "The Lookouts"],
    slogan: [
      "ยืนเฝ้าให้ทั้งสวน เห็นขนมก่อนใคร",
      "Watching over the garden. Spotting snacks first.",
    ],
    pin: [70, 46],
    memberIds: ["mee-tang", "mee-thong", "mee-chok", "mee-heng"],
  },
  "prairie-dog": {
    group: ["แพรรีด็อก", "Prairie dogs"],
    name: ["พรรคขุดถึงใจ", "The Burrow Builders"],
    slogan: [
      "อุโมงค์ทุกสายไปถึงห้องเก็บขนม",
      "Every tunnel leads to the snack cupboard.",
    ],
    pin: [91, 46],
  },
  rabbit: {
    group: ["กระต่าย", "Rabbits"],
    name: ["พรรคหูยาว", "The Long Ears"],
    slogan: [
      "ทุกเสียงเรารับฟัง โดยเฉพาะเสียงแกะถุงผัก",
      "We hear every voice, especially the rustle of a bag of greens.",
    ],
    pin: [39, 60],
  },
  goat: {
    group: ["แพะแคระมินิปิ๊กมี่", "Pygmy goats"],
    name: ["พรรคปีนได้ปีน", "The Little Climbers"],
    slogan: [
      "ทุกเวทีหาเสียง ต้องปีนขึ้นไปเอง",
      "We climb onto every stage ourselves.",
    ],
    pin: [91, 61],
  },
  snake: {
    group: ["งู", "Snakes"],
    name: ["พรรคเลื้อยมาเอง", "The Smooth Movers"],
    slogan: ["ไม่มีขา แต่ไปถึงทุกเวที", "Zero legs. Full campaign schedule."],
    pin: [12, 69],
  },
  iguana: {
    group: ["อีกัวนา", "Iguanas"],
    name: ["พรรคจองแดด", "The Sun Seekers"],
    slogan: [
      "ขอแดดอ่อน ๆ กับที่นั่งหนึ่งกิ่ง",
      "A little sunshine and a branch for everyone.",
    ],
    pin: [29, 69],
  },
  turtle: {
    group: ["เต่า", "Turtles & tortoises"],
    name: ["พรรคค่อย ๆ ไป", "The Slow & Steady Party"],
    slogan: [
      "เร่งไม่ได้ แต่บ้านพร้อมย้ายทุกเมื่อ",
      "We take our time and bring our own homes.",
    ],
    pin: [51, 74],
  },
  fish: {
    group: ["ปลา", "Fish"],
    name: ["พรรควนบ่อ", "The Pond Loop"],
    slogan: [
      "ลงพื้นที่ทุกวัน ส่วนใหญ่เป็นพื้นที่ใต้น้ำ",
      "Out in the community every day. Mostly underwater.",
    ],
    pin: [36, 91],
  },
  poultry: {
    group: ["ไก่ เป็ด และห่าน", "Chickens, ducks & geese"],
    name: ["พรรคตื่นเช้า", "The Dawn Chorus"],
    slogan: [
      "ไก่ขัน เป็ดก๊าบ ห่านรับช่วง ครบทุกย่าน",
      "A crow, a quack and a honk for every neighborhood.",
    ],
    pin: [83, 75],
  },
};

type VenueAnimal = PublicVenueDto["content"]["animals"][number];
export type NamedAnimal = VenueAnimal & { name: string; note: string };

export function animalPartyCatalog(
  locale: Locale,
  venue: PublicVenueDto | null,
) {
  const t = translator(locale);
  const residents: NamedAnimal[] = (venue?.content.animals ?? [])
    .filter(({ visible }) => visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((animal) => ({
      ...animal,
      name: t(animal.title, animal.titleEn || animal.title),
      note: t(animal.description, animal.descriptionEn || animal.description),
    }));

  const animalParties = partyIds.map((id, sortOrder) => {
    const party = parties[id];
    const memberImages = memberImageSources
      .filter(({ partyId }) => partyId === id)
      .map(({ id, nameTh, nameEn, kind, noteTh, noteEn }) => ({
        id,
        name: t(nameTh, nameEn),
        kind,
        note: t(noteTh ?? "", noteEn ?? ""),
      }));
    return {
      id,
      sortOrder,
      group: t(...party.group),
      name: t(...party.name),
      slogan: t(...party.slogan),
      pin: party.pin,
      residents: residents.filter((animal) =>
        party.memberIds?.includes(animal.id),
      ),
      memberImages,
    };
  });
  const assigned = new Set(
    animalParties.flatMap((party) => party.residents.map(({ id }) => id)),
  );
  return {
    parties: animalParties,
    otherResidents: residents.filter(({ id }) => !assigned.has(id)),
  };
}
