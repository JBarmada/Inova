import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { DogSprite } from "./DogSprite";
import { PixelStatus } from "./PixelStatus";
import { BoneQuestToy } from "./BoneQuestToy";
import { useDogPose, type PoseRequest } from "./useDogPose";
import { playCue } from "../../services/audio";

export function PetPanel({ floating, onToyExpanded }: { floating: boolean; onToyExpanded?: (open: boolean) => void }) {
  const state = useInova();
  const [name, setName] = useState("Inu");
  const [request, setRequest] = useState<PoseRequest>(null);
  const { pose, ready, error } = useDogPose(state, request);
  const { run, busy, message } = useAction();
  return <section className="pet-panel" aria-label="Your companion">
    {!floating && <h2>{state.pet.adopted ? state.pet.name : "Adopt a dog"}</h2>}
    <div className="dog-stage" data-tauri-drag-region={floating || undefined} tabIndex={floating ? 0 : undefined}
      aria-label={floating ? "Your dog. Focus to reveal companion controls." : undefined}><DogSprite state={state} pose={pose} /></div>
    {state.pet.adopted && <div className="pose-controls hover-reveal"><button disabled={busy || !ready || pose === "tucking"}
      onClick={() => void run(async () => {
        if (state.pet.mood !== "idle") await dispatch({ type: "mood", mood: "idle" });
        else playCue("click", state.settings.muted);
        setRequest((previous) => ({ kind: pose === "sitting" ? "stand" : "sit", id: (previous?.id ?? 0) + 1 }));
      }, "")}>
      {pose === "sitting" && state.pet.mood === "idle" ? "Stand up" : "Sit"}</button></div>}
    {error && <p role="alert">{error}</p>}
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
