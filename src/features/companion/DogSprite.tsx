import { useState } from "react";
import type { AppState } from "../../shared/schema";
import { WearableLayers } from "./WearableLayers";
import { itemById } from "../../shared/catalog";
import { useDogFace } from "./useDogFace";
import type { DogPose } from "./posePlayback";
import { useBreathingArt } from "./useBreathingArt";
import { clipFit, clipLabels, type ClipRequest } from "./dogClips";
import { useDogClip } from "./useDogClip";
import { ClipLayers } from "./ClipLayers";

export function DogSprite({ state, pose = "standing", clip }: { state: AppState; pose?: DogPose; clip?: ClipRequest | null }) {
  const [failed, setFailed] = useState(false);
  const frame = useDogFace(pose, state.pet.mood, state.settings.reduceMotion);
  const breathing = useBreathingArt(frame, state.settings.reduceMotion);
  const shown = useDogClip(clip, state.settings.muted, breathing.reduced);
  const fit = shown ? clipFit(shown.clip, shown.index) : undefined;
  const outfit = Object.values(state.equipment).filter((id) => id !== null).map((id) => itemById(id).name);
  const description = `${state.pet.name}, ${shown ? clipLabels[shown.clip] : frame}${outfit.length ? `, wearing ${outfit.join(", ")}` : ""}`;
  return <div className={`dog dog-${frame}`} role="img" aria-label={description} data-pose={frame}>
    {shown ? <ClipLayers frame={shown} phase={breathing.phase} />
      : <img className="dog-base" src={failed ? "/inova.svg" : breathing.src} width={64} height={64}
        alt={failed ? "Dog artwork unavailable. Please reload." : ""} draggable={false} onError={() => setFailed(true)} />}
    {(!failed || shown) && <WearableLayers equipment={state.equipment} frame={fit?.pose ?? frame}
      peak={fit ? fit.peak : breathing.peak} motion={fit} />}
    {shown && <ClipLayers frame={shown} phase={breathing.phase} effects />}
    {!shown && pose !== "sleeping" && state.pet.mood === "happy" && <span className="spark" aria-hidden="true">✦</span>}
  </div>;
}
