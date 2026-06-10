import StarPicker from "../forms/StarPicker";
import EmptyState from "../ui/EmptyState";
import { IconUtensils, IconCoffee, IconMapPin, IconBuilding } from "../ui/Icons";

const CAT = {
  resto:  { Icon: IconUtensils, bg: "linear-gradient(135deg,#C84B31,#E8795A)" },
  cafe:   { Icon: IconCoffee,   bg: "linear-gradient(135deg,#8B5E3C,#C4955A)" },
  tempat: { Icon: IconMapPin,   bg: "linear-gradient(135deg,#2D6A4F,#52B788)" },
  hotel:  { Icon: IconBuilding, bg: "linear-gradient(135deg,#1A5276,#2E86C1)" },
};
const DEFAULT_CAT = { Icon: IconMapPin, bg: "linear-gradient(135deg,#475569,#94A3B8)" };

export default function ArchiveGrid({ items, onCardClick, emptyState }) {
  if (items.length === 0) return <EmptyState {...emptyState} />;

  return (
    <div className="archive-grid">
      {items.map((item) => {
        const cat = CAT[item.category] || DEFAULT_CAT;
        const { Icon } = cat;

        return (
          <div key={item.id} className="archive-cell" onClick={() => onCardClick?.(item)}>
            {item.photoUrl ? (
              <img src={item.photoUrl} alt={item.name} className="archive-cell-img" />
            ) : (
              <div className="archive-cell-placeholder" style={{ background: cat.bg }}>
                <Icon size={32} style={{ color: "rgba(255,255,255,.7)" }} />
              </div>
            )}

            {/* overlay */}
            <div className="archive-cell-overlay">
              <div className="archive-cell-name">{item.name}</div>
              {item.rating && (
                <div className="archive-cell-rating">
                  <StarPicker value={item.rating} onChange={() => {}} readonly size="xs" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
