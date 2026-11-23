import { useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { DogSprite } from "./DogSprite";
import { PixelStatus } from "./PixelStatus";
import { DogDeveloperControls } from "./DogDeveloperControls";
import { BoneQuestToy } from "./BoneQuestToy";
import { playCue } from "../../services/audio";
import { useDogPose, type PoseRequest } from "./useDogPose";

export function PetPanel({ floating, onToyExpanded }: { floating: boolean; onToyExpanded?: (open: boolean) => void }) {
  const state = useInova();
  const [name, setName] = useState("Inu");
  const [request, setRequest] = useState<PoseRequest>(null);
  const { pose, ready, error } = useDogPose(state, request);
  const { run, busy, message } = useAction();
  async function changePose() {
    if (!state.settings.devMode) return;
    const kind = pose === "sitting" || pose === "loaf" ? "stand" : "sit";
    playCue("click", state.settings.muted);
    setRequest((previous) => ({ kind, id: (previous?.id ?? 0) + 1 }));
  }
  return <section className="pet-panel" aria-label="Your companion">
    {!floating && <h2>{state.pet.adopted ? state.pet.name : "Adopt a dog"}</h2>}
    <div className="dog-stage" data-tauri-drag-region={floating || undefined} tabIndex={floating ? 0 : undefined}
      aria-label={floating ? "Your dog. Focus to reveal companion controls." : undefined}><DogSprite state={state} pose={pose} /></div>
    {floating && state.pet.adopted && <BoneQuestToy state={state} onExpandedChange={onToyExpanded} />}
    <DogDeveloperControls pose={pose} disabled={busy || !ready} onPose={() => void run(changePose, "")} />
    {!state.pet.adopted ? <form onSubmit={(event) => {
      event.preventDefault();
      void run(() => dispatch({ type: "adopt", name }), "");
    }}><label>Your dog's name<input value={name} maxLength={40} required onChange={(event) => setName(event.target.value)} /></label>
      <button className="primary" disabled={busy}>Adopt this dog</button></form>
      : null}
    {state.pet.adopted && state.settings.showStatus && <PixelStatus text={`${state.pet.name} · ${state.pet.mood}`} hoverOnly={floating} />}
    {message && <PixelStatus text={message} />}
    {error && <p role="alert">{error}</p>}
  </section>;
}
