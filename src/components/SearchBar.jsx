// src/components/SearchBar.jsx
import { useEffect, useRef, useState } from "react";
import { geocodeCity } from "../api/owm";
import { HiLocationMarker } from "react-icons/hi";

export default function SearchBar({ onPick, userLat, userLon, onError }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [localError, setLocalError] = useState("");

  const boxRef = useRef(null);
  const timerRef = useRef(null);
  const lastQueryRef = useRef("");

  // debounced search 
  useEffect(() => {
    const text = q.trim();

    if (text.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      setLocalError("");
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const list = await geocodeCity(text, 10);
        setSuggestions(list || []);
        setOpen(true);
        setActiveIndex(list?.length ? 0 : -1);
        lastQueryRef.current = text;
      } catch (e) {
        setSuggestions([]);
        setOpen(true);
        setActiveIndex(-1);
        onError?.(e.message || "Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [q, onError]);

  //  close on outside click 
  useEffect(() => {
    function onDocClick(e) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(item) {
    if (!item) return;
    setQ(`${item.name}${item.state ? ", " + item.state : ""}, ${item.country}`);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    onPick?.({ lat: Number(item.lat), lon: Number(item.lon), ...item });
  }

  function onKeyDown(e) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(suggestions[activeIndex] || suggestions[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  async function onSearchClick() {
    const text = q.trim();
    if (text.length < 2) {
      setLocalError("Enter at least 2 characters");
      return;
    }
    setLocalError("");
    setLoading(true);
    try {
      const list = await geocodeCity(text, 10);
      if (list?.length) pick(list[0]);
      else {
        onError?.("🏙️ City not found. Try another name.");
        setOpen(true);
        setSuggestions([]);
        setActiveIndex(-1);
        lastQueryRef.current = text;
      }
    } catch (e) {
      onError?.(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGeo() {
    if (!navigator.geolocation) {
      onError?.("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onPick?.({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setQ("");
        setOpen(false);
        setSuggestions([]);
      },
      () => onError?.("Geolocation denied. Please allow access."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="search" ref={boxRef}>
      <div className="search-inputwrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search city …"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="city-suggest"
        />

        {localError && <div className="field-hint">{localError}</div>}

        {open && suggestions.length > 0 && (
          <ul id="city-suggest" className="suggest" role="listbox">
            {suggestions.map((it, i) => (
              <li
                key={`${it.name}|${it.lat}|${it.lon}`}
                role="option"
                aria-selected={i === activeIndex}
                className={"suggest-item" + (i === activeIndex ? " active" : "")}
                // Safari chooses the item on pointer down
                onPointerDown={(e) => { e.preventDefault(); pick(it); }}
                onMouseDown={(e) => { e.preventDefault(); pick(it); }}
                onTouchStart={(e) => { e.preventDefault(); pick(it); }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="city">{it.name}</span>
                {it.state ? <span className="region">, {it.state}</span> : null}
                <span className="badge">{it.country}</span>
              </li>
            ))}
          </ul>
        )}

        {open && !loading && suggestions.length === 0 && lastQueryRef.current && (
          <div className="suggest-empty">No matches for “{lastQueryRef.current}”</div>
        )}
      </div>

      <button type="button" onClick={onSearchClick} disabled={loading}>
        {loading ? "…" : "Search"}
      </button>
      <button type="button" onClick={handleGeo} title="Use my location" aria-label="Use my location">
        <HiLocationMarker size={20} />
      </button>
    </div>
  );
}
