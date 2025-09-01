# Weather Forecast (React + OpenWeatherMap)

A modern **React (Vite)** weather forecasting app using the **OpenWeatherMap API**.  
Features include **city search with live suggestions**, **current weather (Now) block**, **24h hourly forecast** (3-hour steps), **5-day forecast**, **geolocation fallback**, **°C/°F toggle**, **sunrise/sunset times**, **auto dark mode**, and **clear error handling**.



##  Assignment mapping

1. **React project setup** – Vite + React; components, styles, utils, api.  
2. **OpenWeatherMap API** – used: `/geo/1.0/direct`, `/data/2.5/weather`, `/data/2.5/forecast`.  
3. **Components + state** – `SearchBar`, `WeatherNow`, `ForecastHourly`, `ForecastDaily`, `ErrorBanner`; state in `App.jsx`.  
4. **UI design** – custom CSS (glass style), icons via `react-icons/wi`.  
5. **Responsive** – mobile, tablet, desktop breakpoints; horizontal scroll on hourly for small screens.  
6. **Extra features** – °C/°F toggle, geolocation (with fallback), dark mode (auto by sunrise/sunset), sunrise/sunset times.  
7. **Error handling** – offline, invalid API key, rate limit, city not found, generic errors – all with clear banners.  
8. **README** – setup, scripts, env, APIs, deployment, troubleshooting, credits.  





## Scripts

```bash
npm install       # install dependencies
npm run dev       # start local dev server
npm run build     # production build to /dist
npm run preview   # preview production build
```



## Environment variables

Create a `.env` file in the project root:

```env
VITE_OWM_API_KEY=YOUR_API_KEY_HERE
```

> Do **not** commit your real API key.  
> A sample is provided as `.env.example`:

```env
VITE_OWM_API_KEY=
```


## Project structure

```
src/
  api/
    owm.js              # API calls + normalized error codes
  components/
    SearchBar.jsx       # search with suggestions & geolocation button
    WeatherNow.jsx      # current conditions + sunrise/sunset + local time/date
    ForecastHourly.jsx  # next 24h (3h steps)
    ForecastDaily.jsx   # 5-day forecast (min/max)
    ErrorBanner.jsx     # sticky error banner
    Spinner.jsx.        #loader
    UnitToggle.jsx.     # °C/°F toggle
  utils/
    format.js           # format helpers (temp, wind, humidity)
  App.jsx               # root component, state, theme (day/night), loading
  main.jsx              # entry
  styles.css            # global styles (light/dark, responsive)
index.html              # base HTML
```



## APIs used

- **/geo/1.0/direct** – city search & suggestions  
- **/data/2.5/weather** – current weather (Now block)  
- **/data/2.5/forecast** – 5-day / 3-hour forecast (used to compute 24h + 5d)  

> Note: true 1-hourly and 7-day daily require **One Call** (paid).  
> This app uses the free 3-hour forecast and derives **24h + 5d**.



## Error handling

The app shows clear banners for common cases:

- **Offline / no network** → “Network error. Check your internet connection.”  
  _Source:_ `App.jsx` (`window 'offline'`) and `fetchJson` mapping to `NETWORK`.

- **Invalid / inactive API key (401)** → “API key invalid or not activated.”  
  _Source:_ `src/api/owm.js` → `fetchJson` maps 401 to `API_KEY`.

- **Rate limit (429)** → “Too many requests. Please wait a bit and try again.”  
  _Source:_ `src/api/owm.js` → `fetchJson` maps 429 to `RATE_LIMIT`.

- **City not found (search)** → “City not found. Try another name.”  
  _Source:_ `SearchBar.jsx` → `onError(...)` shows the banner.


- **Geolocation unavailable/denied** (informational) →  
  “Location unavailable / access denied. Showing Vancouver, BC.”  
  _Source:_ `App.jsx` → `navigator.geolocation.getCurrentPosition(...)`.


## Features

-  City search with live suggestions  
-  Current weather (temp, feels like, humidity, wind)  
-  Sunrise/Sunset with local time  
-  24h hourly (3h steps) and 5-day forecast  
-  °C/°F toggle   
-  Auto **dark mode** after sunset (per selected city)  



## Design & UX

- Glassmorphism cards, subtle shadows  
- Smooth fade-in animations  
- Responsive layout (mobile → desktop)  
- Accessible keyboard navigation in suggestions  


## Browser support

- Chrome, Edge, Firefox, Safari (latest)  
- Safari note: suggestion selection handled via `pointerdown` to avoid blur.  



## Deployment (Netlify)

1. Push your project to GitHub.  
2. Go to Netlify → **Add new site → Import from Git**.  
3. Select your repository.  
4. **Build settings**  
   - Build command: `npm run build`  
   - Publish directory: `dist`  
5. **Site settings → Environment variables**  
   - `VITE_OWM_API_KEY` = your API key  
6. Deploy. Netlify will build and give you a public URL.  

**Troubleshooting**
- If suggestions don’t select in Safari: we prevent default on `pointerdown` to avoid input blur.  
 



## Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/api)  
- Weather icons: [react-icons/wi](https://react-icons.github.io/react-icons/)  
