import { useState } from "react";

export default function StarPicker({ value, onChange, readonly = false, size }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star${size === "lg" ? " lg" : ""}${(hovered || value) >= n ? " filled" : " empty"}${readonly ? " readonly" : ""}`}
          onClick={() => !readonly && onChange(value === n ? null : n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
