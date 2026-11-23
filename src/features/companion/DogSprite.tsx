import { useState } from "react";
import type { AppState } from "../../shared/schema";
import { itemById } from "../../shared/catalog";
import { dogArt, dogFrame } from "./dogArt";
import type { DogPose } from "./posePlayback";
import { WearableLayers } from "./WearableLayers";

export function DogSprite({ state, pose = "standing" }: { state: AppState; pose?: DogPose }) {
  const [failed, setFailed] = useState(false);
  const frame = dogFrame(state.pet.mood, pose);
  const outfit = Object.values(state.equipment).filter((id) => id !== null).map((id) => itemById(id).name);
  return <div className={`dog dog-${frame}`} role="img" data-pose={frame}
    aria-label={`${state.pet.name}, ${frame}${outfit.length ? `, wearing ${outfit.join(", ")}` : ""}`}>
    <img className="dog-base" src={failed ? "/inova.svg" : dogArt[frame]} width={64} height={64}
      alt={failed ? "Dog artwork unavailable. Please reload." : ""} draggable={false} onError={() => setFailed(true)} />
    {!failed && <WearableLayers equipment={state.equipment} frame={frame} />}
    {state.pet.mood === "happy" && <span className="spark" aria-hidden="true">✦</span>}
  </div>;
}
