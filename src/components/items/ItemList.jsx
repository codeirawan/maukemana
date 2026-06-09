import { useState, useEffect } from "react";
import ItemRow from "./ItemRow";
import EmptyState from "../ui/EmptyState";

const PAGE = 20;

export default function ItemList({ items, mode, onVisit, onRestore, onDelete, emptyState }) {
  const [count, setCount] = useState(PAGE);

  useEffect(() => { setCount(PAGE); }, [items]);

  if (items.length === 0) {
    return <EmptyState {...emptyState} />;
  }

  const visible = items.slice(0, count);

  return (
    <>
      <div className="item-list">
        {visible.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            mode={mode}
            onVisit={onVisit}
            onRestore={onRestore}
            onDelete={onDelete}
          />
        ))}
      </div>
      {count < items.length && (
        <div className="load-more">
          <button className="btn btn-ghost btn-sm" onClick={() => setCount((c) => c + PAGE)}>
            Muat lebih banyak ({items.length - count} lagi)
          </button>
        </div>
      )}
    </>
  );
}
