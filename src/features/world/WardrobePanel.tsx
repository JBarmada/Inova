import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { items } from "../../shared/catalog";
import { DogSprite } from "../companion/DogSprite";
import type { DogPose } from "../companion/posePlayback";
import { wearableSlots } from "../../shared/equipment";
import { itemById } from "../../shared/catalog";
import { ItemGlyph } from "./ItemGlyph";
import { WardrobeLab } from "./WardrobeLab";
import { playCue } from "../../services/audio";
import "../../styles-wardrobe.css";

export function WardrobePanel() {
  const state = useInova();
  const { run, busy, message } = useAction();
  const [pose, setPose] = useState<DogPose>("standing");
  return <section aria-label="Wardrobe"><h2>Wardrobe</h2>
    <p>Wear one hat, one pair of glasses, one set of socks, and one body item together. Item graphics are temporary fitting markers.</p>
    <div className="wardrobe-preview"><DogSprite state={{ ...state, pet: { ...state.pet, mood: "idle" } }} pose={pose} />
      <label>Preview pose<select value={pose} onChange={(event) => {
        setPose(event.target.value as DogPose);
        playCue("click", state.settings.muted);
      }}>
        <option value="standing">Standing</option><option value="sitting">Sitting</option><option value="tucking">Transition study</option>
      </select></label></div>
    <div className="equipment-slots">{wearableSlots.map((slot) => {
      const id = state.equipment[slot];
      return <article key={slot}><h3>{slot}</h3><p>{id ? itemById(id).name : "Empty"}</p>
        <button disabled={busy || !id} onClick={() => void run(() => dispatch({ type: "unequip", slot }), `${slot} removed.`)}>Remove {slot}</button></article>;
    })}</div>
    <button disabled={busy || !Object.values(state.equipment).some(Boolean)} onClick={() => void run(() => dispatch({ type: "equip", item: null }), "Outfit cleared.")}>Clear outfit</button>
    {wearableSlots.map((slot) => <section key={slot} className="wardrobe-category" aria-label={`${slot} items`}><h3>{slot}</h3>
      <div className="wardrobe">{items.filter((item) => item.slot === slot).map((item) => {
        const equipped = state.equipment[slot] === item.id;
        return <article key={item.id}><span className="item-glyph"><ItemGlyph slot={slot} color={item.color} /></span>
          <h3>{item.name}</h3><p>{item.description}</p>
          <button aria-pressed={equipped} disabled={busy || equipped || !state.ownedItems.includes(item.id)}
            onClick={() => void run(() => dispatch({ type: "equip", item: item.id }), `${item.name} equipped.`)}>
            {equipped ? "Wearing" : state.ownedItems.includes(item.id) ? `Wear ${item.name}` : "Locked"}</button></article>;
      })}</div></section>)}
    {message && <p role="status">{message}</p>}
    {state.settings.devMode && <WardrobeLab state={state} />}
  </section>;
}
