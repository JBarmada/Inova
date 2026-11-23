import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { DogSprite } from "./DogSprite";

export function PetPanel({ floating }: { floating: boolean }) {
  const state = useInova();
  const [name, setName] = useState("Inu");
  const { run, busy, message } = useAction();
  return <section className="pet-panel" aria-label="Your companion">
    {!floating && <><p className="eyebrow">{state.pet.adopted ? "YOUR LITTLE COMPANION" : "THE ADOPTION CENTER"}</p>
      <h2>{state.pet.adopted ? `Hello, ${state.pet.name}.` : "A small friend. A new beginning."}</h2></>}
    <div className="dog-stage" data-tauri-drag-region={floating || undefined}><DogSprite state={state} /></div>
    {!state.pet.adopted ? <form onSubmit={(event) => {
      event.preventDefault();
      void run(() => dispatch({ type: "adopt", name }), "You adopted a new friend!");
    }}><label>Your dog's name<input value={name} maxLength={40} required onChange={(event) => setName(event.target.value)} /></label>
      <button className="primary" disabled={busy}>Adopt this dog</button><p>One placeholder variant. More dogs belong to the companion task.</p></form>
      : <div className="reactions">{(["idle", "happy", "tired"] as const).map((mood) => <button key={mood} disabled={busy}
        onClick={() => void run(() => dispatch({ type: "mood", mood }), `${state.pet.name} looks ${mood}.`)}>{mood}</button>)}</div>}
    {!floating && state.pet.adopted && <p>Visit quests to earn a notebook, then equip it in your wardrobe.</p>}
    {message && <p role="status">{message}</p>}
  </section>;
}
