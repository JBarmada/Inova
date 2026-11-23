import type { AppState } from "../../shared/schema";
import { wearableSlots, type WearableSlot } from "../../shared/equipment";
import { itemById } from "../../shared/catalog";
import { ItemGlyph } from "./ItemGlyph";
import { WardrobeIcon } from "./WardrobeIcon";

export function OutfitStrip({ state, busy, onRemove, onClear }: {
  state: AppState; busy: boolean; onRemove: (slot: WearableSlot) => void; onClear: () => void;
}) {
  return <div className="outfit-strip" role="group" aria-label="Currently worn">
    {wearableSlots.map((slot) => {
      const id = state.equipment[slot];
      const item = id ? itemById(id) : null;
      return <button key={slot} className="wardrobe-icon-button equipped-item" data-equipped={Boolean(item)}
        aria-label={item ? `Remove ${slot}` : `${slot} slot empty`}
        title={item ? `${item.name} · click to remove` : `No ${slot} equipped`}
        disabled={busy || !item} onClick={() => onRemove(slot)}>
        {item ? <ItemGlyph slot={slot} color={item.color} /> : <WardrobeIcon kind={slot} />}
        {item && <span className="equipped-dot" aria-hidden="true" />}
      </button>;
    })}
    <button className="wardrobe-icon-button outfit-clear" aria-label="Clear outfit" title="Clear outfit"
      disabled={busy || !Object.values(state.equipment).some(Boolean)} onClick={onClear}><WardrobeIcon kind="clear" /></button>
  </div>;
}
