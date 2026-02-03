export function calculateRouteSafetyScore(
  annotatedPoints: { safetyScore: number }[]
): number {
  if (!annotatedPoints.length) return 0;

  const scores = annotatedPoints.map(p => p.safetyScore);

  const avg =
    scores.reduce((sum, s) => sum + s, 0) / scores.length;

  const min = Math.min(...scores);

  const finalScore = avg * 0.8 + min * 0.2;

  return Math.round(finalScore);
}
