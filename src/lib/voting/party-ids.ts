export const partyIds = [
  "dog",
  "cat",
  "bird",
  "civet",
  "fox",
  "meerkat",
  "prairie-dog",
  "rabbit",
  "goat",
  "snake",
  "iguana",
  "turtle",
  "fish",
  "poultry",
] as const;

export type PartyId = (typeof partyIds)[number];

export interface PartyVoteTotals {
  items: { partyId: PartyId; count: number }[];
  total: number;
}

export function isPartyId(value: string | undefined): value is PartyId {
  return partyIds.some((partyId) => partyId === value);
}
