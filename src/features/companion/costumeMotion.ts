import type { CostumePose } from "./CostumePortrait";
import type { ClipFrame } from "./dogClips";
import { clipFit, clipTiming } from "./dogClips";
import { fittedFrames } from "./poseFrames";
import type { ArtFrame } from "./wearableAnchors";

const poseClips = new Set(["01-stand-to-sit", "03-tired-to-loaf", "04-loaf-to-sleep",
  "05-sleep-breathing", "06-wake-to-loaf", "07a-loaf-to-sit", "07b-sit-to-stand"]);

export function costumeMotion(frame: ArtFrame, clip: ClipFrame | null, reduced: boolean) {
  const posture = clip && poseClips.has(clip.clip) ? clipFit(clip.clip, clip.index).pose : frame;
  const step = fittedFrames.findIndex((pose) => pose === posture);
  const low = posture.startsWith("loaf") || posture.startsWith("sleep") || posture.startsWith("wake");
  const seated = posture.startsWith("sitting") || step >= 3 || posture === "tucking";
  const pose: CostumePose = low && posture !== "loaf-bend" ? "loaf" : seated || low ? "sitting" : "standing";
  const bark = clip?.clip === "12-single-bark" && clip.elapsed === clipTiming["12-single-bark"].markers.bark;
  const squash = posture === "loaf-bend" || posture === "loaf-tuck" ? .93
    : step < 0 ? 1 : [.98, .94, .90, .91, .95, .98][step];
  return { pose, bark, squash: reduced ? 1 : squash,
    resting: posture.startsWith("sleep") || posture === "wake-ear" };
}
