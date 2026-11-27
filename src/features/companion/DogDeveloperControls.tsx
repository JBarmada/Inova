import { dispatch, useInova } from "../../state/store";
import { useAction } from "../../shared/useAction";
import { PixelStatus } from "./PixelStatus";
import { useState } from "react";
import { isStablePose, type DogPose } from "./posePlayback";
import { clipIds, clipLabels, type DogClip } from "./dogClips";

export type DeveloperClip = DogClip | "welcome-walk";

export function DogDeveloperControls({ pose, disabled, onPose, onPreview }: {
  pose: DogPose; disabled: boolean; onPose: () => void; onPreview: (clip: DeveloperClip) => void;
}) {
  const state = useInova();
  const { run, busy, message } = useAction();
  const [selected, setSelected] = useState<DeveloperClip>("12-single-bark");
  if (!state.pet.adopted || !state.settings.devMode) return null;
  const poseLabel = pose === "sleeping" ? "Wake up" : (pose === "standing" || pose === "loaf") ? "Sit" : "Stand up";
  const choices = clipIds.filter((clip) => clip !== "08-post-nap-stretch" && (state.equipment.body !== "bee"
    || ["01-stand-to-sit", "07b-sit-to-stand", "03-tired-to-loaf", "07a-loaf-to-sit", "12-single-bark"].includes(clip)));
  const active = selected === "welcome-walk" || choices.includes(selected) ? selected : "12-single-bark";
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
      <select aria-label="Animation clip" value={active} disabled={disabled}
        onChange={(event) => setSelected(event.target.value as DeveloperClip)}>
        <option value="welcome-walk">Welcome walk (trial)</option>
        {choices.map((clip) => <option key={clip} value={clip}>{clipLabels[clip]}</option>)}
      </select>
      <button disabled={disabled} onClick={() => onPreview(active)}>Play</button>
    </div>
    {message && <PixelStatus text={message} />}
  </>;
}
