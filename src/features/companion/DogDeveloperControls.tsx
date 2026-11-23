import { dispatch, useInova } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { PixelStatus } from "./PixelStatus";
import { useState } from "react";
import { isStablePose, type DogPose } from "./posePlayback";
import { clipIds, clipLabels, type DogClip } from "./dogClips";

export function DogDeveloperControls({ pose, disabled, onPose, onPreview }: {
  pose: DogPose; disabled: boolean; onPose: () => void; onPreview: (clip: DogClip) => void;
}) {
  const state = useInova();
  const { run, busy, message } = useAction();
  const [selected, setSelected] = useState<DogClip>("08-post-nap-stretch");
  if (!state.pet.adopted || !state.settings.devMode) return null;
  const poseLabel = pose === "sleeping" ? "Wake up" : pose === "standing" ? "Sit" : "Stand up";
  return <>
    <div className="pose-controls hover-reveal"><button disabled={disabled || !isStablePose(pose)}
      onClick={onPose} aria-label={`Ask your dog to ${poseLabel.toLowerCase().replace("stand up", "stand")}`}>
      {poseLabel}</button></div>
    <div className="reactions hover-reveal" role="group" aria-label="Developer mood controls">
      {(["idle", "happy", "tired"] as const).map((mood) => <button key={mood} disabled={disabled || busy}
        aria-pressed={state.pet.mood === mood}
        onClick={() => void run(() => dispatch({ type: "mood", mood }), "")}>{mood}</button>)}
    </div>
    <div className="animation-controls hover-reveal" role="group" aria-label="Developer animation controls">
      <select aria-label="Animation clip" value={selected} disabled={disabled}
        onChange={(event) => setSelected(event.target.value as DogClip)}>
        {clipIds.map((clip) => <option key={clip} value={clip}>{clipLabels[clip]}</option>)}
      </select>
      <button disabled={disabled} onClick={() => onPreview(selected)}>Play</button>
    </div>
    {message && <PixelStatus text={message} />}
  </>;
}
