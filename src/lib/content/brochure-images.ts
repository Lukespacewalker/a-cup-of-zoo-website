import activities from "../../../reference-data/garden-experience-2026-09-28/07-activities-source.png";
import zones from "../../../reference-data/garden-experience-2026-09-28/08-zone-houses-source.png";
type Crop = [number, number, number, number];
export const activitySheet = activities;
export const zoneSheet = zones;
// Normalized photo windows measured from the supplied sheets, excluding text/prices.
export const activityCrops: Record<string, Crop> = Object.fromEntries(
  ["basket", "alligator-gar", "goat-milk", "ema", "koi"].map((id, i) => [
    id,
    [[0.024, 0.215, 0.402, 0.595, 0.799][i], 0.326, 0.168, 0.293] as Crop,
  ]),
);
export const zoneCrops: Crop[] = [0.03, 0.198, 0.354, 0.535, 0.701, 0.854].map(
  (x) => [x, 0.2, 0.13, 0.43],
);
