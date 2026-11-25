import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { items, itemById } from "../../shared/catalog";
import { DogSprite } from "../companion/DogSprite";
import type { ClipRequest } from "../companion/dogClips";
import { wearableSlots, type ItemId } from "../../shared/equipment";
import { ItemGlyph } from "./ItemGlyph";
import { WardrobeLab } from "./WardrobeLab";
import { WardrobeIcon } from "./WardrobeIcon";
import { OutfitStrip } from "./OutfitStrip";
import { WardrobeFilters, WardrobePoses, type PreviewPose, type WardrobeFilter } from "./WardrobeToolbar";
import { playCue } from "../../services/audio";
import { shuffledOutfit } from "./shuffleOutfit";
import { previewOutfit } from "./previewOutfit";
import "../../styles-wardrobe.css";

export function WardrobePanel() {
  const state = useInova();
  const { run, busy, message } = useAction();
  const [pose, setPose] = useState<PreviewPose>("standing");
  const [fitting, setFitting] = useState<ClipRequest | null>(null);
  const [filter, setFilter] = useState<WardrobeFilter>("all");
  const [preview, setPreview] = useState<ItemId | null>(null);
  const previewItem = preview ? itemById(preview) : null;
  const previewEquipment = previewOutfit(state.equipment, preview);
  return <section aria-label="Wardrobe"><div className="wardrobe-heading"><h2>Wardrobe</h2></div>
    <WardrobeFilters filter={filter} onFilter={(value) => { setFilter(value); playCue("click", state.settings.muted); }} />
    <div className="wardrobe-preview"><DogSprite state={{ ...state, equipment: previewEquipment, pet: { ...state.pet, mood: "idle" } }} pose={pose}
      clip={pose === "sitting" ? fitting : null} />
      <WardrobePoses pose={pose} onPose={(value) => { setPose(value); setFitting(null); playCue("click", state.settings.muted); }} /></div>
    {previewItem && <div className="wardrobe-preview-notice" role="status">
      Trying on {previewItem.name} <button type="button" onClick={() => setPreview(null)}>End preview</button>
    </div>}
    <OutfitStrip state={state} busy={busy}
      onRemove={(slot) => void run(() => dispatch({ type: "unequip", slot }), `${slot} removed.`)}
      onClear={() => void run(() => dispatch({ type: "equip", item: null }), "Outfit cleared.")}
      onShuffle={() => void run(() => dispatch({ type: "equip-outfit", equipment: shuffledOutfit(state.ownedItems) }), "Outfit shuffled.")} />
    {wearableSlots.filter((slot) => filter === "all" || slot === filter).map((slot) => <section key={slot} className="wardrobe-category" aria-label={`${slot} items`}><h3>{slot}</h3>
      <div className="wardrobe">{items.filter((item) => item.slot === slot).map((item) => {
        const equipped = state.equipment[slot] === item.id;
        return <article key={item.id}><span className="item-glyph"><ItemGlyph slot={slot} color={item.color} /></span>
          <h3>{item.name}</h3>
          <button type="button" className="try-on-button" aria-label={preview === item.id ? `Stop previewing ${item.name}` : `Try on ${item.name}`} aria-pressed={preview === item.id}
            onClick={() => { setPreview(preview === item.id ? null : item.id); setFitting(null); playCue("click", state.settings.muted); }}>
            {preview === item.id ? "Previewing" : "Try on"}</button>
          <button className="wardrobe-icon-button" aria-label={equipped ? `${item.name} worn` : state.ownedItems.includes(item.id) ? `Wear ${item.name}` : `${item.name} locked`}
            title={equipped ? "Wearing" : state.ownedItems.includes(item.id) ? `Wear ${item.name}` : "Locked"}
            aria-pressed={equipped} disabled={busy || equipped || !state.ownedItems.includes(item.id)}
            onClick={() => void run(async () => {
              await dispatch({ type: "equip", item: item.id });
              setPreview(null);
              if (pose === "sitting") setFitting({ clip: "15-accessory-fitting", demo: false });
            }, `${item.name} equipped.`)}>
            <WardrobeIcon kind={equipped ? "worn" : state.ownedItems.includes(item.id) ? "wear" : "locked"} /></button></article>;
      })}</div></section>)}
    {message && <p role="status">{message}</p>}
    {state.settings.devMode && <WardrobeLab state={state} />}
  </section>;
}
