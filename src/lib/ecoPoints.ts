const ECO_POINTS_KEY = "eco_points";

export function getEcoPoints(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(ECO_POINTS_KEY)) || 0;
}

export function addEcoPoints(points: number): number {
  const current = getEcoPoints();
  const updated = current + points;
  localStorage.setItem(ECO_POINTS_KEY, updated.toString());
  return updated;
}

export function resetEcoPoints(): void {
  localStorage.removeItem(ECO_POINTS_KEY);
}
