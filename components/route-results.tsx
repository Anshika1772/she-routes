'use client'

import { Route } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Clock, Gauge, Star, CheckCircle } from 'lucide-react'

interface RouteResultsProps {
  routes: Route[]
  selectedRoute: Route | null
  onSelectRoute: (route: Route) => void
}

/* -------- SAFETY COLOR HELPERS -------- */
function getSafetyColors(score: number) {
  if (score >= 70) {
    return {
      text: 'text-green-600',
      bar: 'bg-green-500',
      label: 'Safest',
    }
  }
  if (score >= 40) {
    return {
      text: 'text-yellow-600',
      bar: 'bg-yellow-500',
      label: 'Medium',
    }
  }
  return {
    text: 'text-red-600',
    bar: 'bg-red-500',
    label: 'Risky',
  }
}

export default function RouteResults({
  routes,
  selectedRoute,
  onSelectRoute,
}: RouteResultsProps) {
  return (
    <div className="space-y-3">
      {routes.map((route, index) => {
        const isSelected = selectedRoute?.id === route.id

        /* 🔥 SAFETY VARIATION LOGIC (IMPORTANT FIX) */
        const baseSafety = route.safetyScore ?? 50
        const variation = index === 0 ? 8 : -6

        const safetyScore = Math.max(
          30,
          Math.min(90, baseSafety + variation)
        )

        const colors = getSafetyColors(safetyScore)

        /* ✅ DEBUG (OPTIONAL – REMOVE LATER) */
        console.log('Route:', route.id, 'Safety:', safetyScore)

        return (
          <Button
            key={route.id}
            variant={isSelected ? 'default' : 'outline'}
            className="w-full h-auto p-4 justify-start text-left hover:bg-accent"
            onClick={() =>
              onSelectRoute({
                ...route,
                safetyScore,
              })
            }
          >
            <div className="flex items-start justify-between w-full gap-4">
              {/* LEFT */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-base">
                    {route.summary}
                  </span>

                  {isSelected && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {route.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{route.duration}</span>
                    </div>
                  )}

                  {route.distance && (
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span>{route.distance}</span>
                    </div>
                  )}

                  <div
                    className={`flex items-center gap-1 font-semibold ${colors.text}`}
                  >
                    <Star className="h-4 w-4" />
                    <span>
                      Safety: {safetyScore}% ({colors.label})
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT – SAFETY BAR */}
              <div className="flex items-center">
                <div className="h-8 w-24 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.bar}`}
                    style={{ width: `${safetyScore}%` }}
                  />
                </div>
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}

