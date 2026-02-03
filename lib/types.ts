// lib/types.ts

export interface Route {
  id: string
  distance: string
  duration: string
  polyline: string
  summary: string
  points?: any[]
  safetyScore?: number
}
