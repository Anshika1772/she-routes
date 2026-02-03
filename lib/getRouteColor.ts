export function getRouteColor(score: number) {
  if (score >= 70) return '#16a34a'; // green - safest
  if (score >= 40) return '#facc15'; // yellow - medium risk
  return '#dc2626'; // red - high risk
}

