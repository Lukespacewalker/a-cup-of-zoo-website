export const JAR_CAPACITY = 50;
export function ballCount(count: number) {
  return count % JAR_CAPACITY;
}
export function rankAnimals<T extends { count: number; sortOrder: number }>(
  animals: T[],
): Array<T & { rank: number | null }> {
  const sorted = [...animals].sort(
    (a, b) => b.count - a.count || a.sortOrder - b.sortOrder,
  );
  let rank = 0;
  return sorted.map((animal, index) => {
    if (index === 0 || animal.count !== sorted[index - 1].count)
      rank = index + 1;
    return { ...animal, rank: animal.count > 0 ? rank : null };
  });
}
