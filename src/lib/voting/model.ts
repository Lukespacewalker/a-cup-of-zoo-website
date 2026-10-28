export const JAR_CAPACITY = 50;
const BALL_COLORS = ["#ddbd68", "#a8b9c3", "#d39479", "#a8b383"];

// Use the absolute, one-based vote number so colors survive jar changes and reloads.
export function voteBallColor(voteNumber: number) {
  return BALL_COLORS[(voteNumber - 1) % BALL_COLORS.length];
}

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
