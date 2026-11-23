import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { items } from "../../shared/catalog";
import { DogSprite } from "../companion/DogSprite";
import { wearableSlots } from "../../shared/equipment";
import { ItemGlyph } from "./ItemGlyph";
import { WardrobeLab } from "./WardrobeLab";
import { WardrobeIcon } from "./WardrobeIcon";
import { OutfitStrip } from "./OutfitStrip";
import { WardrobeFilters, WardrobePoses, type PreviewPose, type WardrobeFilter } from "./WardrobeToolbar";
import { playCue } from "../../services/audio";
import { shuffledOutfit } from "./shuffleOutfit";
import "../../styles-wardrobe.css";

export function WardrobePanel() {
  const state = useInova();
  const { run, busy, message } = useAction();
  const [pose, setPose] = useState<PreviewPose>("standing");
  const [filter, setFilter] = useState<WardrobeFilter>("all");
  return <section aria-label="Wardrobe"><div className="wardrobe-heading"><h2>Wardrobe</h2></div>
    <WardrobeFilters filter={filter} onFilter={(value) => { setFilter(value); playCue("click", state.settings.muted); }} />
    <div className="wardrobe-preview"><DogSprite state={{ ...state, pet: { ...state.pet, mood: "idle" } }} pose={pose} />
      <WardrobePoses pose={pose} onPose={(value) => { setPose(value); playCue("click", state.settings.muted); }} /></div>
    <OutfitStrip state={state} busy={busy}
      onRemove={(slot) => void run(() => dispatch({ type: "unequip", slot }), `${slot} removed.`)}
      onClear={() => void run(() => dispatch({ type: "equip", item: null }), "Outfit cleared.")}
      onShuffle={() => void run(() => dispatch({ type: "equip-outfit", equipment: shuffledOutfit(state.ownedItems) }), "Outfit shuffled.")} />
    {wearableSlots.filter((slot) => filter === "all" || slot === filter).map((slot) => <section key={slot} className="wardrobe-category" aria-label={`${slot} items`}><h3>{slot}</h3>
      <div className="wardrobe">{items.filter((item) => item.slot === slot).map((item) => {
        const equipped = state.equipment[slot] === item.id;
        return <article key={item.id}><span className="item-glyph"><ItemGlyph slot={slot} color={item.color} /></span>
          <h3>{item.name}</h3>
          <button className="wardrobe-icon-button" aria-label={equipped ? `${item.name} worn` : state.ownedItems.includes(item.id) ? `Wear ${item.name}` : `${item.name} locked`}
            title={equipped ? "Wearing" : state.ownedItems.includes(item.id) ? `Wear ${item.name}` : "Locked"}
            aria-pressed={equipped} disabled={busy || equipped || !state.ownedItems.includes(item.id)}
            onClick={() => void run(() => dispatch({ type: "equip", item: item.id }), `${item.name} equipped.`)}>
            <WardrobeIcon kind={equipped ? "worn" : state.ownedItems.includes(item.id) ? "wear" : "locked"} /></button></article>;
      })}</div></section>)}
    {message && <p role="status">{message}</p>}
    {state.settings.devMode && <WardrobeLab state={state} />}
  </section>;
}
