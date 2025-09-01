// src/App.jsx
import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import ForecastHourly from "./components/ForecastHourly";
import ForecastDaily from "./components/ForecastDaily";
import ErrorBanner from "./components/ErrorBanner";
import { forecast5, currentWeather } from "./api/owm";
import WeatherNow from "./components/WeatherNow";

const DEFAULT_COORDS = { lat: 49.2827, lon: -123.1207 }; // Vancouver

export default function App() {
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);
  const [units, setUnits] = useState(() => localStorage.getItem("units") || "metric");
  const [weather, setWeather] = useState({ hourly24: [], daily5: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // dark/light theme state
  const [isDark, setIsDark] = useState(false);

  useEffect(() => localStorage.setItem("units", units), [units]);

  // geolocation with fallback
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("ℹ️ Location unavailable. Showing Vancouver, BC.");
      setUserLat(DEFAULT_COORDS.lat);
      setUserLon(DEFAULT_COORDS.lon);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setError(null);
        setUserLat(pos.coords.latitude);
        setUserLon(pos.coords.longitude);
      },
      () => {
        setError("ℹ️ Location access denied. Showing Vancouver, BC.");
        setUserLat(DEFAULT_COORDS.lat);
        setUserLon(DEFAULT_COORDS.lon);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  // offline/online listeners
  useEffect(() => {
    function onOff() {
      setError("⚠️ Network error. Check your internet connection.");
    }
    function onOn() {
     
    }
    window.addEventListener("offline", onOff);
    window.addEventListener("online", onOn);
    return () => {
      window.removeEventListener("offline", onOff);
      window.removeEventListener("online", onOn);
    };
  }, []);

  // dark/light theme based on sun position
  function applyThemeBySun(current) {
    // sunrise/sunset times
    if (!current?.sunrise || !current?.sunset) return;
    const now = Math.floor(Date.now() / 1000); 
    const { sunrise, sunset } = current;
   
    setIsDark(now < sunrise || now > sunset);
  }

  // fetch weather data
  async function fetchAll(lat, lon) {
    try {
      setLoading(true);
      setError(null);

      const [cur, f] = await Promise.all([
        currentWeather(lat, lon, units),
        forecast5(lat, lon, units),
      ]);

      // current for WeatherNow
      const current = cur
        ? {
            dt: cur.dt,
            temp: cur.main?.temp,
            feels_like: cur.main?.feels_like,
            humidity: cur.main?.humidity,
            wind_speed: cur.wind?.speed,
            wind_deg: cur.wind?.deg,
            weather: cur.weather,
            sunrise: cur.sys?.sunrise,
            sunset: cur.sys?.sunset,
            timezone: cur.timezone,
          }
        : null;

      const locationName = cur?.name
        ? `${cur.name}${cur.sys?.country ? ", " + cur.sys.country : ""}`
        : "";

      // --- forecast → 24h + 5d ---
const list = Array.isArray(f?.list) ? f.list : [];
const tz = f?.city?.timezone ?? 0; 

const hourly24 = list.slice(0, 8).map(x => ({
  dt: x.dt,
  temp: x.main?.temp,
  weather: x.weather
}));

// group by day
const byDay = new Map();

for (const it of list) {
  const localSec = it.dt + tz;                      
  const dayKey   = Math.floor(localSec / 86400);    
  const dayStartLocalSec = dayKey * 86400;          
  const dtLocalStartUTC  = dayStartLocalSec - tz;   

  const rec = byDay.get(dayKey) || {
    dayKey,
    dt: dtLocalStartUTC,
    temp: { min: +Infinity, max: -Infinity },
    weather: it.weather
  };

  const t = it.main?.temp;
  if (typeof t === "number") {
    rec.temp.min = Math.min(rec.temp.min, t);
    rec.temp.max = Math.max(rec.temp.max, t);
  }

  const m = (it.weather?.[0]?.main || "").toLowerCase();
  if (m.includes("thunder") || m.includes("snow") || m.includes("rain")) {
    rec.weather = it.weather; // «буря»/дождь/снег пусть задают иконку дня
  }

  byDay.set(dayKey, rec);
}

const daily5 = Array.from(byDay.values()).slice(0, 5);

// не забудь положить сдвиг таймзоны в стейт — пригодится в UI
setWeather({ current, hourly24, daily5, locationName, timezoneOffset: tz });


      // 🔹 сразу решаем тему
      applyThemeBySun(current);
    } catch (e) {
      console.error("[fetchAll]", e.code || e.message, e);
      if (e.code === "NETWORK") {
        setError("⚠️ Network error. Check your internet connection.");
      } else if (e.code === "API_KEY") {
        setError("🔑 API key invalid or not activated.");
      } else if (e.code === "RATE_LIMIT") {
        setError("⏱️ Too many requests. Please wait a bit and try again.");
      } else if (e.code === "NOT_FOUND") {
        setError("🏙️ City not found. Try another name.");
      } else {
        setError("⚠️ Failed to load weather. Try again later.");
      }
      setWeather({ current: null, hourly24: [], daily5: [], locationName: "" });
    } finally {
      setLoading(false);
    }
  }

  // — загружаем когда есть координаты/меняются units —
  useEffect(() => {
    if (userLat != null && userLon != null) {
      fetchAll(userLat, userLon);
    }
  }, [userLat, userLon, units]);

  // 🔹 перепроверяем тему, когда обновился current, и дальше — раз в 5 минут
  useEffect(() => {
    if (weather?.current) applyThemeBySun(weather.current);
    const id = setInterval(() => applyThemeBySun(weather?.current), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [weather?.current]);

  function handlePick(place) {
    if (!place) return;
    setUserLat(Number(place.lat));
    setUserLon(Number(place.lon));
  }

  return (
    <div className={`app ${isDark ? "dark" : ""}`}>
      <header className="topbar">
        <h1 className="app-title">Weather Forecast</h1>
        <div className="controls">
          <SearchBar
            onPick={handlePick}
            userLat={userLat}
            userLon={userLon}
            onError={(msg) => setError(msg)}
          />
          <div className="unit-toggle">
            <button
              className={units === "metric" ? "active" : ""}
              onClick={() => setUnits("metric")}
            >
              °C
            </button>
            <button
              className={units === "imperial" ? "active" : ""}
              onClick={() => setUnits("imperial")}
            >
              °F
            </button>
          </div>
        </div>
      </header>

      {error && <ErrorBanner message={error} />}
      {loading && <p className="loading">Loading…</p>}

      {weather?.current && (
        <WeatherNow
          current={weather.current}
          units={units}
          locationName={weather.locationName || ""}
        />
      )}

      {weather.hourly24.length > 0 && <ForecastHourly hours={weather.hourly24} units={units} />}
      {weather.daily5.length > 0 && <ForecastDaily days={weather.daily5} units={units} timezoneOffset={weather.current?.timezone_offset ?? 0} />}

      {weather.hourly24.length === 0 && !loading && (
        <p style={{ textAlign: "center", opacity: 0.85, marginTop: 20 }}>
          Choose a city or allow location to see forecast.
        </p>
      )}

        <footer className="footer">
  <p className="footer-title">Weather Forecast App</p>
  <p className="footer-meta">
    © {new Date().getFullYear()} Built by Oksana Katysheva • Data by 
    <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">
      OpenWeatherMap
    </a>
  </p>
</footer>

    </div>
    
  );
}
