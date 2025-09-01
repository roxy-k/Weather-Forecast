// src/components/ForecastHourly.jsx
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

export default function ForecastHourly({ hours = [], units = "metric" }) {
  if (!hours.length) return null;

  //pick icon based on weather condition
  function pickIcon(main) {
    const m = main.toLowerCase();
    if (m.includes("clear")) return <WiDaySunny size={32} color="#facc15" />;
    if (m.includes("cloud")) return <WiCloud size={32} color="#9ca3af" />;
    if (m.includes("rain")) return <WiRain size={32} color="#3b82f6" />;
    if (m.includes("snow")) return <WiSnow size={32} color="#60a5fa" />;
    if (m.includes("thunder")) return <WiThunderstorm size={32} color="#a855f7" />;
    return <WiDaySunny size={32} color="#facc15" />; 
  }

  return (
    <section className="glass card hourly fade-in">
      <div className="card-title">TODAY • NEXT 24H</div>
      <div className="hourly-strip">
        {hours.slice(0, 8).map((h, i) => {
          const main = h.weather?.[0]?.main || "";
          const icon = pickIcon(main);

          return (
            <div className="h-item glass-mini" key={`${h.dt}-${i}`}>
              <div className="h-time">
                {new Date(h.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="h-ico" aria-label={main || "weather icon"}>
                {icon}
              </div>
              <div className="h-temp">
                {Math.round(h.temp)}°
                <span className="u">{units === "metric" ? "C" : "F"}</span>
              </div>
              <div className="h-desc">{main}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
