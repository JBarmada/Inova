import { useEffect, useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useRewardReaction } from "../../state/rewardReaction";
import { useAction } from "../../shared/useAction";
import { DogSprite } from "./DogSprite";
import { PixelStatus } from "./PixelStatus";
import { DogDeveloperControls } from "./DogDeveloperControls";
import { BoneQuestToy } from "./BoneQuestToy";
import { playCue } from "../../services/audio";
import { useDogPose, type PoseRequest } from "./useDogPose";
import { useCompanionClips } from "./useCompanionClips";
import type { DogClip } from "./dogClips";

export function PetPanel({ floating, onToyExpanded, rewardPending = false, onRewardShown }: {
  floating: boolean; onToyExpanded?: (open: boolean) => void; rewardPending?: boolean; onRewardShown?: () => void;
}) {
  const state = useInova();
  const rewarding = useRewardReaction();
  const [name, setName] = useState("Inu");
  const [welcome, setWelcome] = useState(false);
  useEffect(() => {
    if (!welcome) return;
    const timer = setTimeout(() => setWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, [welcome]);
  const [request, setRequest] = useState<PoseRequest>(null);
  const { pose, ready, error } = useDogPose(state, request);
  const { clip, setClip } = useCompanionClips(state, pose, rewardPending, onRewardShown);
  const { run, busy, message } = useAction();
  async function changePose() {
    if (!state.settings.devMode) return;
    const kind = pose === "sleeping" ? "wake" : pose === "standing" ? "sit" : "stand";
    playCue("click", state.settings.muted);
    setClip(null);
    setRequest((previous) => ({ kind, id: (previous?.id ?? 0) + 1 }));
  }
  function preview(clip: DogClip) {
    if (!state.settings.devMode) return;
    playCue("click", state.settings.muted);
    setClip({ clip, demo: true });
  }
  return <section className="pet-panel" aria-label="Your companion">
    {!floating && <h2>{state.pet.adopted ? state.pet.name : "Adopt a dog"}</h2>}
    <div className="dog-stage" data-tauri-drag-region={floating || undefined} tabIndex={floating ? 0 : undefined}
      aria-label={floating ? "Your dog. Focus to reveal companion controls." : undefined}><DogSprite state={(welcome || rewarding) && state.pet.adopted ? { ...state, pet: { ...state.pet, mood: "happy" } } : state} pose={pose} clip={clip} /></div>
    {floating && state.pet.adopted && <BoneQuestToy state={state} onExpandedChange={onToyExpanded} />}
    <DogDeveloperControls pose={pose} disabled={busy || !ready} onPose={() => void run(changePose, "")} onPreview={preview} />
    {!state.pet.adopted ? <form onSubmit={(event) => {
      event.preventDefault();
      void run(async () => { await dispatch({ type: "adopt", name }); setWelcome(true); }, `Welcome home, ${name.trim()}!`);
    }}><label>Your dog's name<input value={name} maxLength={40} required onChange={(event) => setName(event.target.value)} /></label>
      <button className="primary" disabled={busy}>Adopt this dog</button></form>
      : null}
    {state.pet.adopted && state.settings.showStatus && <PixelStatus text={`${state.pet.name} · ${state.pet.mood}`} hoverOnly={floating} />}
    {message && <PixelStatus text={message} />}
    {error && <p role="alert">{error}</p>}
  </section>;
}
