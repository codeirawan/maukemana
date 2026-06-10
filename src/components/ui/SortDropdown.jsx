import { useState, useRef, useEffect } from "react";
import { IconChevronDown, IconCheck } from "./Icons";

export default function SortDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="sort-dd" ref={ref}>
      <button
        className={`sort-dd-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span>{current?.label ?? "Urut"}</span>
        <IconChevronDown size={12} />
      </button>

      {open && (
        <div className="sort-dd-menu">
          {options.map((o) => (
            <button
              key={o.value}
              className={`sort-dd-item${value === o.value ? " selected" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
              type="button"
            >
              <span>{o.label}</span>
              {value === o.value && <IconCheck size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
