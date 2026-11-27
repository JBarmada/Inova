import { useEffect, useState } from "react";
import { useInova, dispatch } from "../../state/store";
import { useRewardReaction } from "../../state/rewardReaction";
import { useAction } from "../../shared/useAction";
import { PixelStatus } from "./PixelStatus";
import { DogDeveloperControls, type DeveloperClip } from "./DogDeveloperControls";
import { BoneQuestToy } from "./BoneQuestToy";
import { playCue } from "../../services/audio";
import { useDogPose, type PoseRequest } from "./useDogPose";
import { useCompanionClips } from "./useCompanionClips";
import { randomPersonality } from "../../shared/personality";
import { CompanionWalkStage } from "./CompanionWalkStage";
import { useBodyWalkInterruption } from "./walkInterruption";

export function PetPanel({ floating, onToyExpanded, rewardPending = false, onRewardShown }: {
  floating: boolean; onToyExpanded?: (open: boolean) => void; rewardPending?: boolean; onRewardShown?: () => void;
}) {
  const state = useInova();
  const rewarding = useRewardReaction();
  const [name, setName] = useState("Inu");
  const [welcome, setWelcome] = useState(false);
  const [walking, setWalking] = useState(false);
  const [walkReady, setWalkReady] = useState(false);
  const [walkKey, setWalkKey] = useState(0);
  useBodyWalkInterruption(state.equipment.body, walking, stopWalk);
  useEffect(() => {
    if (!state.settings.devMode && !welcome) setWalking(false);
  }, [state.settings.devMode, welcome]);
  useEffect(() => {
    if (!welcome || walking) return;
    const timer = setTimeout(() => setWelcome(false), 2800);
    return () => clearTimeout(timer);
  }, [welcome, walking]);
  const [request, setRequest] = useState<PoseRequest>(null);
  const { pose, ready, error } = useDogPose(state, request, walking);
  const { clip, setClip } = useCompanionClips(state, pose, rewardPending, onRewardShown);
  const { run, busy, message } = useAction();
  function stopWalk() { setWalking(false); setWalkReady(false); setWelcome(false); }
  async function changePose() {
    if (!state.settings.devMode) return;
    if (walking) stopWalk();
    const kind = pose === "sleeping" ? "wake" : (pose === "standing" || pose === "loaf") ? "sit" : "stand";
    playCue("click", state.settings.muted);
    setClip(null);
    setRequest((previous) => ({ kind, id: (previous?.id ?? 0) + 1 }));
  }
  function preview(clip: DeveloperClip) {
    if (!state.settings.devMode) return;
    playCue("click", state.settings.muted);
    if (clip === "welcome-walk") {
      setClip(null); setWalkReady(false); setWalkKey((key) => key + 1); setWalking(true);
    } else { setWalking(false); setClip({ clip, demo: true }); }
  }
  function completeWalk() {
    setWalking(false);
    if (welcome) setClip({ clip: "12-single-bark", demo: false });
  }
  const dogState = (welcome || rewarding) && state.pet.adopted ? { ...state, pet: { ...state.pet, mood: "happy" as const } } : state;
  return <section className="pet-panel" aria-label="Your companion">
    {!floating && <h2>{state.pet.adopted ? state.pet.name : "Adopt a dog"}</h2>}
    <CompanionWalkStage state={dogState} pose={pose} clip={clip} walking={walking} walkKey={walkKey}
      walkReady={walkReady} floating={floating} onWalkStart={setWalkReady}
      onWalkComplete={completeWalk} />
    {welcome && !floating && <p className="welcome-message" role="status">Welcome home, {state.pet.name}!</p>}
    {floating && state.pet.adopted && <BoneQuestToy state={state} onExpandedChange={onToyExpanded} />}
    <DogDeveloperControls pose={pose} disabled={busy || !ready} onPose={() => void run(changePose, "")} onPreview={preview} />
    {!state.pet.adopted ? <form onSubmit={(event) => {
      event.preventDefault();
      void run(async () => { await dispatch({ type: "adopt", name, personality: randomPersonality() }); setWalkReady(false); setWalking(true); setWelcome(true); }, "");
    }}><label>Your dog's name<input value={name} maxLength={40} required onChange={(event) => setName(event.target.value)} /></label>
      <button className="primary" disabled={busy}>Adopt this dog</button></form>
      : null}
    {!floating && state.settings.devMode && state.pet.adopted && state.pet.personality && <p>Personality: {state.pet.personality === "mean" ? "playfully grumpy" : state.pet.personality}</p>}
    {state.pet.adopted && state.settings.showStatus && <PixelStatus text={`${state.pet.name} · ${state.pet.mood}`} hoverOnly={floating} />}
    {message && <PixelStatus text={message} />}
    {error && <p role="alert">{error}</p>}
  </section>;
}
