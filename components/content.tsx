const handleSOS = () => {
  if (!navigator.geolocation) {
    alert("Location not supported")
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      const locationLink = `https://maps.google.com/?q=${lat},${lng}`

      alert("Location captured:\n" + locationLink)

      // next step me yahin se SMS trigger hoga
    },
    () => {
      alert("Location permission denied")
    }
  )
}

