import { useState } from "react";
import type { AppState } from "../../shared/schema";
import { dogFrame } from "./dogArt";
import type { DogPose } from "./posePlayback";
import { useBreathingArt } from "./useBreathingArt";

export function DogSprite({ state, pose = "standing" }: { state: AppState; pose?: DogPose }) {
  const [failed, setFailed] = useState(false);
  const frame = dogFrame(state.pet.mood, pose);
  const breathing = useBreathingArt(frame);
  const seated = frame === "sitting" || frame === "tucking";
  const description = `${state.pet.name}, ${frame}${state.equippedItem ? `, ${state.equippedItem} equipped` : ""}`;
  return <div className={`dog dog-${frame}`} role="img" aria-label={description} data-pose={frame}>
    <img className="dog-base" src={failed ? "/inova.svg" : breathing.src} width={64} height={64}
      alt={failed ? "Dog artwork unavailable. Please reload." : ""} draggable={false} onError={() => setFailed(true)} />
    {state.equippedItem === "notebook" && <img className="dog-layer" src="/dog/notebook.png" alt="" draggable={false} />}
    {state.equippedItem === "bandana" && <img className={`dog-layer${seated ? " dog-layer-seated" : ""}${breathing.peak ? " dog-layer-inhale" : ""}`}
      src="/dog/bandana.png" alt="" draggable={false} />}
    {state.pet.mood === "happy" && <span className="spark" aria-hidden="true">✦</span>}
  </div>;
}
