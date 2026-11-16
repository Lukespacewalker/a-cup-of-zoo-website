import type { Locale } from "../i18n/locale";

export function voteUnit(locale: Locale, count?: number) {
  if (locale === "th") return "คะแนน";
  return count === 1 ? "vote" : "votes";
}

export function rankByVotes<T extends { count: number; sortOrder: number }>(
  entries: T[],
): Array<T & { rank: number | null }> {
  const sorted = [...entries].sort(
    (a, b) => b.count - a.count || a.sortOrder - b.sortOrder,
  );
  let rank = 0;
  return sorted.map((entry, index) => {
    if (index === 0 || entry.count !== sorted[index - 1].count)
      rank = index + 1;
    return { ...entry, rank: entry.count > 0 ? rank : null };
  });
}
