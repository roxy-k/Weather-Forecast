export function formatTemp(t, units='metric') {
  if (t == null) return '—'
  const rounded = Math.round(t)
  return `${rounded}°${units === 'metric' ? 'C' : 'F'}`
}

export function formatWind(speed, units='metric') {
  if (speed == null) return '—'
  const unit = units === 'metric' ? 'm/s' : 'mph'
  return `${Math.round(speed)} ${unit}`
}

export function formatHumidity(h) {
  if (h == null) return '—'
  return `${h}%`
}

export function degToCompass(num) {
  if (num == null || isNaN(num)) return '—'
  const n = ((num % 360) + 360) % 360
  const idx = Math.floor((n / 22.5) + 0.5) % 16
  const arr = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
    "S","SSW","SW","WSW","W","WNW","NW","NNW"]
  return arr[idx]
}

export function bgClassFor(condition) {
  const c = (condition || '').toLowerCase()
  if (c.includes('clear')) return 'bg-clear'
  if (c.includes('cloud')) return 'bg-clouds'
  if (c.includes('rain')) return 'bg-rain'
  if (c.includes('drizzle')) return 'bg-rain'
  if (c.includes('thunder')) return 'bg-thunder'
  if (c.includes('snow')) return 'bg-snow'
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return 'bg-mist'
  return 'bg-default'
}

export function titleCase(s='') {
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function formatDate(ts, tzOffsetSec=0) {
  const d = new Date((ts + tzOffsetSec) * 1000)
  return d.toLocaleDateString([], {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
  })
}

export function formatTime(ts, tzOffsetSec=0) {
  const d = new Date((ts + tzOffsetSec) * 1000)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
