export async function geocodePlace(place: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
  )

  const data = await res.json()

  if (!data || data.length === 0) {
    throw new Error("Location not found")
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  }
}
