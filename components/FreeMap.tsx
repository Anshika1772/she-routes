'use client';

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

/* ---------------- FIX LEAFLET ICON ---------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ---------------- TYPES ---------------- */
type Coords = { lat: number; lng: number };

interface Route {
  id: string;
  summary: string;
  safetyScore: number;
  polyline: [number, number][];
}

interface FreeMapProps {
  routes: Route[];
  selectedRoute: Route | null;
  start: Coords | null;
  end: Coords | null;
  safetyServices: any[];
}

/* ---------------- COLOR BY SAFETY ---------------- */
import { getRouteColor } from '@/lib/getRouteColor';

/* ---------------- STEP 2.2 : MAP ZOOM TO ROUTE ---------------- */
function MapZoomToRoute({
  selectedRoute,
}: {
  selectedRoute: Route | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedRoute) return;

    const bounds = L.latLngBounds(selectedRoute.polyline);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [selectedRoute, map]);

  return null;
}

/* ---------------- MAIN MAP ---------------- */
export default function FreeMap({
  routes,
  selectedRoute,
  start,
  end,
  safetyServices,
}: FreeMapProps) {
  const center: [number, number] = start
    ? [start.lat, start.lng]
    : [26.8467, 80.9462]; // Lucknow fallback

  return (
    <div className="h-[420px] w-full rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
      >
        {/* ✅ STEP 2.2 ACTIVE */}
        <MapZoomToRoute selectedRoute={selectedRoute} />

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* START MARKER */}
        {start && (
          <Marker position={[start.lat, start.lng]}>
            <Popup>Start Location</Popup>
          </Marker>
        )}

        {/* END MARKER */}
        {end && (
          <Marker position={[end.lat, end.lng]}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* SAFETY SERVICES MARKERS */}
        {safetyServices.map((service: any) => {
          const color =
            service.type === 'police'
              ? 'blue'
              : service.type === 'hospital'
              ? 'red'
              : 'purple'
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          return (
            <Marker
              key={`${service.type}-${service.lat}-${service.lng}`}
              position={[service.lat, service.lng]}
              icon={icon}
            >
              <Popup>
                {service.name} ({service.distance} km)
              </Popup>
            </Marker>
          )
        })}

        {/* STEP 2.3 : ROUTE HIGHLIGHT */}
        {routes.map((r) => (
          <Polyline
            key={r.id}
            positions={r.polyline}
            pathOptions={{
              color: getRouteColor(r.safetyScore),
              weight: selectedRoute?.id === r.id ? 6 : 3,
              opacity: selectedRoute?.id === r.id ? 1 : 0.4,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
