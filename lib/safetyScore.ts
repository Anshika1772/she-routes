type AreaType = 'market' | 'residential' | 'isolated';

interface SafetyInput {
  crimeCount: number;
  lighting: 'good' | 'partial' | 'poor';
  areaType: AreaType;
  hour: number; // 0–23
}

export function calculateSafetyScore({
  crimeCount,
  lighting,
  areaType,
  hour,
}: SafetyInput): number {

  // 🚨 Crime score
  let crimeScore = 90;
  if (crimeCount > 30) crimeScore = 20;
  else if (crimeCount > 15) crimeScore = 40;
  else if (crimeCount > 5) crimeScore = 70;

  // 💡 Lighting score
  const lightingScore =
    lighting === 'good' ? 90 : lighting === 'partial' ? 60 : 30;

  // 👥 Area score
  const areaScore =
    areaType === 'market'
      ? 85
      : areaType === 'residential'
      ? 70
      : 35;

  // ⏰ Time score
  const timeScore = hour >= 6 && hour <= 19 ? 90 : 50;

  // 🧮 Final weighted score
  const score =
    crimeScore * 0.4 +
    lightingScore * 0.25 +
    areaScore * 0.2 +
    timeScore * 0.15;

  return Math.round(score);
}
