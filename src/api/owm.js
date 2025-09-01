// src/api/owm.js
const BASE = "https://api.openweathermap.org";
const KEY  = import.meta.env.VITE_OWM_API_KEY;


async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      //map popular OWM responses
      const msg = await res.text().catch(() => "");
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      // recognizable types
      if (res.status === 401) err.code = "API_KEY";
      else if (res.status === 404) err.code = "NOT_FOUND";
      else if (res.status === 429) err.code = "RATE_LIMIT";
      else err.code = "HTTP";
      err.body = msg;
      throw err;
    }
    return res.json();
  } catch (e) {
    // offline, CORS and other errors come as TypeError
    if (e instanceof TypeError && !navigator.onLine) {
      const err = new Error("Network offline");
      err.code = "NETWORK";
      throw err;
    }
    if (e.code) throw e;
    const err = new Error(e.message || "Request failed");
    err.code = "NETWORK";
    throw err;
  }
}

// geocoding
export async function geocodeCity(query, limit = 5) {
  const url = new URL(`${BASE}/geo/1.0/direct`);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("appid", KEY);
  return fetchJson(url);
}

// 5-day / 3-hour forecast
export async function forecast5(lat, lon, units = "metric", lang = "en") {
  const url = new URL(`${BASE}/data/2.5/forecast`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);
  url.searchParams.set("appid", KEY);
  return fetchJson(url);
}

// Current weather
export async function currentWeather(lat, lon, units = "metric", lang = "en") {
  const url = new URL(`${BASE}/data/2.5/weather`);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);
  url.searchParams.set("appid", KEY);
  return fetchJson(url);
}
