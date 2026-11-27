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
import { CostumePoseFrame } from "./CostumePoseFrame";
import { getCostumeArt } from "./CostumePortrait";
import { costumeMotion } from "./costumeMotion";
import { RearCostumeLayer } from "./RearCostumeLayer";
import { welcomeWalkPawLifts } from "./welcomeWalk";
import { PoseBark } from "./PoseBark";

export function DogSprite({ state, pose = "standing", clip, walkFrame, onBaseLoad }: {
  state: AppState; pose?: DogPose; clip?: ClipRequest | null; walkFrame?: number; onBaseLoad?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [failedCostume, setFailedCostume] = useState<string | null>(null);
  const frame = useDogFace(pose, state.pet.mood, state.settings.reduceMotion);
  const breathing = useBreathingArt(frame, state.settings.reduceMotion);
  const shown = useDogClip(clip, state.settings.muted, breathing.reduced);
  const layeredBark = shown?.clip === "12-single-bark";
  const bodyClip = layeredBark ? null : shown;
  const fit = bodyClip ? clipFit(bodyClip.clip, bodyClip.index) : undefined;
  const outfit = Object.values(state.equipment).filter((id) => id !== null).map((id) => itemById(id).name);
  const body = state.equipment.body;
  const costume = getCostumeArt(body);
  const fullCostume = body !== failedCostume && costume;
  const motion = costumeMotion(frame, shown, breathing.reduced);
  const expression = motion.bark ? "bark" : motion.resting || frame.endsWith("blink") ? "blink" : state.pet.mood;
  const equipment = costume ? { ...state.equipment, body: null } : state.equipment;
  const walking = walkFrame !== undefined;
  const activity = walking ? "walking" : shown ? clipLabels[shown.clip] : frame;
  const description = `${state.pet.name}, ${activity}${outfit.length ? `, wearing ${outfit.join(", ")}` : ""}`;
  return <div className={`dog dog-${frame}`} role="img" aria-label={description} data-pose={frame} data-walk-frame={walkFrame}>
    {(!failed || shown) && <RearCostumeLayer id={body} frame={fit?.pose ?? frame} fit={fit} peak={fit?.peak ?? breathing.peak} />}
    {fullCostume ? <CostumePoseFrame art={fullCostume} motion={motion} expression={expression} equipment={equipment}
      pawLifts={walking ? welcomeWalkPawLifts[walkFrame] : undefined} onError={() => setFailedCostume(body)} />
      : bodyClip ? <ClipLayers frame={bodyClip} phase={breathing.phase} />
      : <img className="dog-base" src={failed ? "/inova.svg" : breathing.src} width={64} height={64}
        alt={failed ? "Dog artwork unavailable. Please reload." : ""} draggable={false}
        onLoad={onBaseLoad} onError={() => setFailed(true)} />}
    {!fullCostume && !failed && motion.bark && layeredBark && <PoseBark frame={frame} breathingPeak={breathing.peak} />}
    {!fullCostume && (!failed || bodyClip) && <WearableLayers equipment={equipment} frame={fit?.pose ?? frame}
      peak={walking ? false : fit ? fit.peak : breathing.peak} motion={fit} />}
    {bodyClip && <ClipLayers frame={bodyClip} phase={breathing.phase} effects />}
    {!walking && !shown && pose !== "sleeping" && state.pet.mood === "happy" && <span className="spark" aria-hidden="true">✦</span>}
  </div>;
}
