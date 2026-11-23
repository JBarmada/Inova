import { useState } from "react";
import type { AppState } from "../../shared/schema";
import { WearableLayers } from "./WearableLayers";
import { itemById } from "../../shared/catalog";
import { useDogFace } from "./useDogFace";
import type { DogPose } from "./posePlayback";
import { useBreathingArt } from "./useBreathingArt";

export function DogSprite({ state, pose = "standing" }: { state: AppState; pose?: DogPose }) {
  const [failed, setFailed] = useState(false);
  const frame = useDogFace(pose, state.pet.mood);
  const breathing = useBreathingArt(frame);
  const outfit = Object.values(state.equipment).filter((id) => id !== null).map((id) => itemById(id).name);
  const description = `${state.pet.name}, ${frame}${outfit.length ? `, wearing ${outfit.join(", ")}` : ""}`;
  return <div className={`dog dog-${frame}`} role="img" aria-label={description} data-pose={frame}>
    <img className="dog-base" src={failed ? "/inova.svg" : breathing.src} width={64} height={64}
      alt={failed ? "Dog artwork unavailable. Please reload." : ""} draggable={false} onError={() => setFailed(true)} />
    {!failed && <WearableLayers equipment={state.equipment} frame={frame} peak={breathing.peak} />}
    {state.pet.mood === "happy" && <span className="spark" aria-hidden="true">Ã¢Å“Â¦</span>}
  </div>;
}
