import crimeData from "@/data/processed/crime.json"
import lightingData from "@/data/processed/lighting.json"
import areaData from "@/data/processed/area_type.json"

export function getNearbyData(
  lat: number,
  lng: number
) {
  const crime = (crimeData as any[]).find(
    (c) =>
      Math.abs(c.lat - lat) < 0.005 &&
      Math.abs(c.lng - lng) < 0.005
  )

  const light = (lightingData as any[]).find(
    (l) =>
      Math.abs(l.lat - lat) < 0.005 &&
      Math.abs(l.lng - lng) < 0.005
  )

  const area = (areaData as any[]).find(
    (a) =>
      Math.abs(a.lat - lat) < 0.005 &&
      Math.abs(a.lng - lng) < 0.005
  )

  return {
    crimeCount: crime?.count ?? 0,
    lightingScore: light?.score ?? 0.3,
    areaType: area?.type ?? "isolated",
  }
}

