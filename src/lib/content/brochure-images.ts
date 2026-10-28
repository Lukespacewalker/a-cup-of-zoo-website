import activities from "../../../reference-data/garden-experience-2026-09-28/07-activities-source.png";
import zones from "../../../reference-data/garden-experience-2026-09-28/08-zone-houses-source.png";
type Crop = [number, number, number, number];
export const activitySheet = activities;
export const zoneSheet = zones;
// Normalized photo windows measured from the supplied sheets, excluding text/prices.
export const activityCrops: Record<string, Crop> = Object.fromEntries(
  ["basket", "alligator-gar", "goat-milk", "ema", "koi"].map((id, i) =>
    [id, [[.024, .215, .402, .595, .799][i], .326, .168, .293] as Crop]),
);
export const zoneCrops: Crop[] = [.03, .198, .354, .535, .701, .854].map(x => [x, .20, .13, .43]);
