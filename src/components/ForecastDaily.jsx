// src/components/ForecastDaily.jsx
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

export default function ForecastDaily({
  days = [],
  units = "metric",
  timezoneOffset = 0, 
}) {
  if (!days.length) return null;

  // format day/date in local timezone
function fmtDay(utcSec) {
  const d = new Date((utcSec + timezoneOffset) * 1000); 
  const wd = d.toLocaleDateString([], { weekday: "short" }).toUpperCase(); 
  const md = d.toLocaleDateString([], { month: "short", day: "2-digit" }); 
  return { wd, md };
}


  // Convert UTC seconds to local date
  const toLocalDate = (dt) => new Date((dt + timezoneOffset) * 1000);

  const pickIcon = (main = "") => {
    const m = main.toLowerCase();
    if (m.includes("clear")) return <WiDaySunny size={40} color="#facc15" />;
    if (m.includes("cloud")) return <WiCloud size={40} color="#9ca3af" />;
    if (m.includes("rain")) return <WiRain size={40} color="#3b82f6" />;
    if (m.includes("snow")) return <WiSnow size={40} color="#60a5fa" />;
    if (m.includes("thunder")) return <WiThunderstorm size={40} color="#a855f7" />;
    return <WiDaySunny size={40} color="#facc15" />;
  };

  return (
    <section className="glass card daily fade-in">
      <div className="card-title">5-DAY FORECAST</div>

      <div className="daily-grid">
        {days.slice(0, 5).map((d) => {
          const {wd:weekday, md:monthDay} = fmtDay(d.dt);

          const main = d.weather?.[0]?.main || "";
          const icon = pickIcon(main);

          return (
            <div className="d-card glass-mini" key={d.dt}>
              <div className="d-day">{weekday}</div>
              <div className="d-date" >
                {monthDay}
              </div>

              <div className="d-ico">{icon}</div>
              <div className="d-temps">
                <span className="hi">{Math.round(d.temp.max)}°</span>
                <span className="lo">{Math.round(d.temp.min)}°</span>
                <span className="u">{units === "metric" ? "C" : "F"}</span>
              </div>
              <div className="d-desc">{d.weather?.[0]?.main}</div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
