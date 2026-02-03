'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { MapPin, Navigation, Loader, AlertTriangle } from 'lucide-react'
import RouteResults from '@/components/route-results'
import { geocodePlace } from '@/lib/geocode'

/* ================= MAP ================= */
const FreeMap = dynamic(() => import('@/components/FreeMap'), {
  ssr: false,
})

/* ================= SAFETY ================= */
function calculateRouteSafetyScore(index: number): number {
  if (index === 0) return 85
  if (index === 1) return 55
  return 25
}

/* ================= OSRM ================= */
async function getRoutes(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
) {
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&alternatives=true&geometries=geojson`
  )

  const data = await res.json()
  if (!data.routes) throw new Error('No routes found')
  return data.routes
}

export default function RoutePlannerPage() {
  const [startLocation, setStartLocation] = useState('')
  const [endLocation, setEndLocation] = useState('')
  const [routes, setRoutes] = useState<any[]>([])
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [safetyServices, setSafetyServices] = useState<any[]>([])

  const [startCoords, setStartCoords] =
    useState<{ lat: number; lng: number } | null>(null)
  const [endCoords, setEndCoords] =
    useState<{ lat: number; lng: number } | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)

  /* ===== SAFETY SERVICES ===== */
  const fetchSafetyServices = async (lat: number, lng: number) => {
    const services = [
      { type: 'police', query: 'amenity=police' },
      { type: 'hospital', query: 'amenity=hospital' },
      { type: 'ngo', query: 'amenity=social_facility' },
    ]

    const results = await Promise.all(
      services.map(async ({ type, query }) => {
        const res = await fetch(
          `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1500,${lat},${lng})[${query}];out;`
        )
        const data = await res.json()
        const elements = data.elements || []

        if (elements.length === 0) return null

        // Find nearest
        const nearest = elements.reduce((closest: any, el: any) => {
          const dist = Math.sqrt(
            (el.lat - lat) ** 2 + (el.lon - lng) ** 2
          )
          return !closest || dist < closest.dist
            ? { ...el, dist }
            : closest
        }, null)

        const distanceKm = (nearest.dist * 111).toFixed(1) // Rough km

        return {
          type,
          name: nearest.tags?.name || `${type} station`,
          lat: nearest.lat,
          lng: nearest.lon,
          distance: distanceKm,
        }
      })
    )

    return results.filter(Boolean)
  }

  /* ===== CURRENT LOCATION ===== */
  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStartCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
          setStartLocation('Current Location')
        },
        () => setError('Location access denied')
      )
    }
  }, [useCurrentLocation])

  /* ===== SAFETY SERVICES ===== */
  useEffect(() => {
    if (!selectedRoute) return

    const midpoint = selectedRoute.polyline[
      Math.floor(selectedRoute.polyline.length / 2)
    ]
    const lat = midpoint[0]
    const lng = midpoint[1]

    fetchSafetyServices(lat, lng).then(setSafetyServices)
  }, [selectedRoute])

  /* ===== FIND ROUTES ===== */
  const handleFindRoutes = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      const start =
        startCoords ?? (await geocodePlace(startLocation))
      const end = await geocodePlace(endLocation)

      const osrmRoutes = await getRoutes(start, end)

      const formattedRoutes = osrmRoutes.map(
        (r: any, index: number) => {
          const safety = calculateRouteSafetyScore(index)

          return {
            id: `route-${index}`,
            summary: `Route ${index + 1}`,
            safetyScore: safety,
            distanceKm:
              Math.round((r.distance / 1000) * 10) / 10,
            color:
              safety >= 70
                ? 'green'
                : safety >= 40
                ? 'yellow'
                : 'red',
            polyline: r.geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]]
            ),
          }
        }
      )

      formattedRoutes.sort(
        (a: any, b: any) => b.safetyScore - a.safetyScore
      )

      setRoutes(formattedRoutes)
      setSelectedRoute(formattedRoutes[0])
      setStartCoords(start)
      setEndCoords(end)
    } catch {
      setError('Unable to calculate route')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Plan Safe Route
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Route</CardTitle>
              <CardDescription>
                Enter start and destination
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleFindRoutes}
                className="space-y-4"
              >
                <div>
                  <Label>Start</Label>
                  <div className="flex gap-2">
                    <Input
                      value={startLocation}
                      onChange={(e) =>
                        setStartLocation(e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setUseCurrentLocation(true)
                      }
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Destination</Label>
                  <Input
                    value={endLocation}
                    onChange={(e) =>
                      setEndLocation(e.target.value)
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Finding routes...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Find Routes
                    </>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* MAP + ROUTES */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Map View</CardTitle>
              </CardHeader>
              <CardContent>
                <FreeMap
                  routes={routes}
                  selectedRoute={selectedRoute}
                  start={startCoords}
                  end={endCoords}
                  safetyServices={safetyServices}
                />
              </CardContent>
            </Card>

            {routes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RouteResults
                    routes={routes}
                    selectedRoute={selectedRoute}
                    onSelectRoute={setSelectedRoute}
                  />
                </CardContent>
              </Card>
            )}

            {routes.length > 0 && safetyServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nearest Safety Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {safetyServices.map((service: any) => (
                      <div key={service.type} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full ${
                              service.type === 'police'
                                ? 'bg-blue-500'
                                : service.type === 'hospital'
                                ? 'bg-red-500'
                                : 'bg-purple-500'
                            }`}
                          />
                          {service.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {service.distance} km
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
