import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { DogSprite } from "./DogSprite";
import { PixelStatus } from "./PixelStatus";
import { BoneQuestToy } from "./BoneQuestToy";

export function PetPanel({ floating, onToyExpanded }: { floating: boolean; onToyExpanded?: (open: boolean) => void }) {
  const state = useInova();
  const [name, setName] = useState("Inu");
  const { run, busy, message } = useAction();
  return <section className="pet-panel" aria-label="Your companion">
    {!floating && <h2>{state.pet.adopted ? state.pet.name : "Adopt a dog"}</h2>}
    <div className="dog-stage" data-tauri-drag-region={floating || undefined} tabIndex={floating ? 0 : undefined}
      aria-label={floating ? "Your dog. Focus to reveal companion controls." : undefined}><DogSprite state={state} /></div>
    {floating && state.pet.adopted && <BoneQuestToy state={state} onExpandedChange={onToyExpanded} />}
    {!state.pet.adopted ? <form onSubmit={(event) => {
      event.preventDefault();
      void run(() => dispatch({ type: "adopt", name }), "");
    }}><label>Your dog's name<input value={name} maxLength={40} required onChange={(event) => setName(event.target.value)} /></label>
      <button className="primary" disabled={busy}>Adopt this dog</button></form>
      : state.settings.devMode && <div className="reactions hover-reveal" role="group" aria-label="Developer mood controls">{(["idle", "happy", "tired"] as const).map((mood) => <button key={mood} disabled={busy}
        onClick={() => void run(() => dispatch({ type: "mood", mood }), "")}>{mood}</button>)}</div>}
    {state.pet.adopted && state.settings.showStatus && <PixelStatus text={`${state.pet.name} · ${state.pet.mood}`} hoverOnly={floating} />}
    {message && <PixelStatus text={message} />}
  </section>;
}
