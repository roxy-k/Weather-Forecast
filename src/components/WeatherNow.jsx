// src/components/WeatherNow.jsx
import {
  WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm,
  WiSunrise, WiSunset
} from "react-icons/wi";

// UTC seconds + tzOffset(s) -> local time/date
function fmtCity(utcSec, tzOffsetSec = 0) {
  const d = new Date((utcSec + tzOffsetSec) * 1000);
  const time = d.toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit", timeZone: "UTC"
  });
  const date = d.toLocaleDateString([], {
    weekday: "short", month: "short", day: "2-digit", timeZone: "UTC"
  });
  return { time, date };
}

export default function WeatherNow({ current, units = "metric", locationName = "" }) {
  if (!current) return null;

  const tz = Number(current.timezone ?? 0)

  const { time: localTime, date: localDate }   = fmtCity(current.dt, tz);
  const { time: sunriseStr }                   = fmtCity(current.sunrise, tz);
  const { time: sunsetStr }                    = fmtCity(current.sunset, tz);

  function pickIcon(main) {
    const m = (main || "").toLowerCase();
    if (m.includes("clear"))   return <WiDaySunny size={64} color="#facc15" />;
    if (m.includes("cloud"))   return <WiCloud size={64} color="#9ca3af" />;
    if (m.includes("rain"))    return <WiRain size={64} color="#3b82f6" />;
    if (m.includes("snow"))    return <WiSnow size={64} color="#60a5fa" />;
    if (m.includes("thunder")) return <WiThunderstorm size={64} color="#a855f7" />;
    return <WiDaySunny size={64} color="#facc15" />;
  }

  const main = current.weather?.[0]?.main || "";
  const desc = current.weather?.[0]?.description || "";
  const icon = pickIcon(main);

  return (
    <section className="glass card now fade-in">
    <div className="now-header">
  <div className="location-row">
    <span className="location">{locationName}</span>
    <span className="sep">•</span>
    <span className="loc-time">{localTime}</span>
    <span className="sep">•</span>
    <span className="loc-date">{localDate}</span>
  </div>
</div>


      <div className="now-body">
        <div className="now-main">
          <div className="now-tempcol">
            <div className="temp">
              {Math.round(current.temp)}
              <span className="u">{units === "metric" ? "°C" : "°F"}</span>
            </div>

            <span className="desc">{desc}</span>

            <div className="now-stats">
              <span>Feels: {Math.round(current.feels_like)}°</span>
              <span>Humidity: {current.humidity}%</span>
              <span>Wind: {current.wind_speed} {units === "metric" ? "m/s" : "mph"}</span>
            </div>

            <div className="now-sun">
              <span><WiSunrise size={22} color="#f59e0b" /> Sunrise: {sunriseStr}</span>
              <span><WiSunset  size={22} color="#ef4444" /> Sunset: {sunsetStr}</span>
            </div>
          </div>

          <div className="now-icon">{icon}</div>
        </div>
      </div>
    </section>
  );
}
