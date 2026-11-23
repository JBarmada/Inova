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
  return <>
    <div className="pose-controls hover-reveal"><button disabled={disabled || pose === "tucking"}
      onClick={onPose} aria-label={pose === "sitting" ? "Ask your dog to stand" : "Ask your dog to sit"}>
      {pose === "sitting" ? "Stand up" : "Sit"}</button></div>
    <div className="reactions hover-reveal" role="group" aria-label="Developer mood controls">
      {(["idle", "happy", "tired"] as const).map((mood) => <button key={mood} disabled={disabled || busy}
        onClick={() => void run(() => dispatch({ type: "mood", mood }), "")}>{mood}</button>)}
    </div>
    {message && <PixelStatus text={message} />}
  </>;
}
