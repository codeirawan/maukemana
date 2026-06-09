import { useState, useRef, useEffect } from "react";
import { searchPlaces, getPlaceDetails } from "../../services/googlePlaces";

export default function PlacesSearch({ onSelect, initialValue = "" }) {
  const [query, setQuery]           = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [open, setOpen]             = useState(false);
  const debounceRef = useRef(null);
  const wrapRef     = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchPlaces(val);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 380);
  }

  async function handleSelect(s) {
    setQuery(s.mainText);
    setOpen(false);
    setSuggestions([]);
    const details = await getPlaceDetails(s.placeId);
    if (details) {
      setQuery(details.name);
      onSelect(details);
    }
  }

  return (
    <div className="places-wrap" ref={wrapRef}>
      <div className="places-input-row">
        <input
          className="input input-lg"
          placeholder="Cari nama tempat atau restoran *"
          value={query}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />
        {loading && <span className="places-loading">⏳</span>}
      </div>

      {open && (
        <div className="places-dropdown">
          {suggestions.map((s) => (
            <button key={s.placeId} type="button" className="places-item" onClick={() => handleSelect(s)}>
              <span className="places-main">📍 {s.mainText}</span>
              {s.secondaryText && <span className="places-sub">{s.secondaryText}</span>}
            </button>
          ))}
          <div className="places-powered">Powered by Google</div>
        </div>
      )}
    </div>
  );
}
