import { dispatch, useInova } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { PixelStatus } from "./PixelStatus";
import type { DogPose } from "./posePlayback";

export function DogDeveloperControls({ pose, disabled, onPose }: {
  pose: DogPose; disabled: boolean; onPose: () => void;
}) {
  const state = useInova();
  const { run, busy, message } = useAction();
  if (!state.pet.adopted || !state.settings.devMode) return null;
  const canStand = pose === "sitting" || pose === "loaf";
  return <>
    <div className="pose-controls hover-reveal"><button disabled={disabled || (pose !== "standing" && !canStand)}
      onClick={onPose} aria-label={canStand ? "Ask your dog to stand" : "Ask your dog to sit"}>
      {canStand ? "Stand up" : "Sit"}</button></div>
    <div className="reactions hover-reveal" role="group" aria-label="Developer mood controls">
      {(["idle", "happy", "tired"] as const).map((mood) => <button key={mood} disabled={disabled || busy}
        aria-pressed={state.pet.mood === mood}
        onClick={() => void run(() => dispatch({ type: "mood", mood }), "")}>{mood}</button>)}
    </div>
    {message && <PixelStatus text={message} />}
  </>;
}
