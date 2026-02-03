import { getNearbyData } from "./dataset"
import { calculateSafetyScore } from "./safetyScore"
import { calculateRouteSafetyScore } from "./routeSafety"

/* 👇 basic point type */
type RoutePoint = {
  lat: number
  lng: number
}

export function annotateRoute(routePoints: RoutePoint[]) {
  const annotated = routePoints.map((point: RoutePoint) => {
    const lat = point.lat
    const lng = point.lng

    const nearby = getNearbyData(lat, lng)

    const safetyScore = calculateSafetyScore({
      crimeCount: nearby.crimeCount,
      lighting:
        nearby.lightingScore >= 0.7
          ? "good"
          : nearby.lightingScore >= 0.4
          ? "partial"
          : "poor",
      areaType: nearby.areaType,
      hour: new Date().getHours(),
    })

    // 🔥 PROOF — dataset used
    console.log("DATASET USED →", {
      lat,
      lng,
      nearby,
      safetyScore,
    })

    return {
      ...point,
      safetyScore,
    }
  })

  const routeSafetyScore = calculateRouteSafetyScore(annotated)

  return {
    points: annotated,
    routeSafetyScore,
  }
}

