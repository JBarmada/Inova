import timings from "./clipTimings.json";
import { fittedFrames } from "./poseFrames";
import type { ArtFrame } from "./wearableAnchors";

export const clipLabels = {
  "01-stand-to-sit": "Standing to sitting", "02-seated-tired": "Getting tired while seated",
  "03-tired-to-loaf": "Tired sit to loaf", "04-loaf-to-sleep": "Loaf to sleep",
  "05-sleep-breathing": "Sleeping breaths", "06-wake-to-loaf": "Waking up",
  "07a-loaf-to-sit": "Loaf to sitting", "07b-sit-to-stand": "Sitting to standing",
  "08-post-nap-stretch": "Post-nap stretch", "09-standing-idle": "Standing idle",
  "09-sitting-idle": "Sitting idle", "10-notice-user": "Noticing you",
  "11a-happy-greeting": "Happy greeting", "11b-tail-wag-loop": "Tail wag",
  "12-single-bark": "Bark", "13-receive-treat": "Taking a treat",
  "14-unlock-celebration": "Unlock celebration", "15-accessory-fitting": "Accessory fitting",
  "m06-seated-happy-and-recovery": "Seated mood changes", "m07-m12-low-posture-moods": "Loaf and sleep moods",
} satisfies Record<keyof typeof timings, string>;

export type DogClip = keyof typeof clipLabels;
export type ClipRequest = { clip: DogClip; demo: boolean };
export type ClipFrame = ClipRequest & { index: number; elapsed: number };
export const clipIds = Object.keys(clipLabels) as DogClip[];
export const clipTiming = timings;
export const clipSource = (clip: DogClip) => `/dog/clips/${clip}.png`;

const poses: Partial<Record<DogClip, readonly ArtFrame[]>> = {
  "01-stand-to-sit": ["standing", ...fittedFrames, "sitting"],
  "02-seated-tired": ["sitting", "sitting-blink", "sitting", "sitting-drowsy", "sitting-blink", "sitting-tired"],
  "03-tired-to-loaf": [...Array<ArtFrame>(10).fill("sitting-tired"), "loaf-bend", "loaf-tuck", "loaf-tired"],
  "04-loaf-to-sleep": ["loaf-idle", "sleep-drowsy", "sleep-doze", "sleeping"],
  "06-wake-to-loaf": ["sleeping", "wake-ear", "wake-eyes", "sleep-drowsy", "loaf-idle"],
  "07a-loaf-to-sit": ["loaf-tired", "loaf-tuck", "loaf-bend", "sitting-tired", "sitting-blink", "sitting"],
  "07b-sit-to-stand": ["sitting", ...[...fittedFrames].reverse(), "standing"],
  "m07-m12-low-posture-moods": ["loaf-idle", "loaf-happy", "loaf-tired", "sleeping", "sleeping"],
};

export function clipFit(clip: DogClip, index: number): { pose: ArtFrame; headX?: number; headY?: number; peak?: boolean; feet?: number[][] } {
  const specified = poses[clip]?.[index];
  if (specified) return { pose: specified, peak: (clip === "03-tired-to-loaf" && (index === 2 || index === 6)) };
  if (clip === "05-sleep-breathing") return { pose: "sleeping" };
  if (clip === "09-sitting-idle" || clip === "m06-seated-happy-and-recovery" || clip === "15-accessory-fitting") {
    return { pose: "sitting", peak: (clip === "09-sitting-idle" && index === 2) || (clip === "15-accessory-fitting" && index === 3) };
  }
  if (clip === "08-post-nap-stretch" && index > 0 && index < 4) {
    const deep = index === 2;
    return { pose: "standing", headX: deep ? -3 : -1, headY: deep ? 6 : 4,
      feet: [[8, 53], [13, 54], [35, 52], [44, 51]] };
  }
  const tilt = (clip === "10-notice-user" || clip === "14-unlock-celebration") && index === 2;
  return { pose: "standing", headY: tilt ? 1 : 0, peak: clip === "09-standing-idle" && index === 2 };
}

export function createClipPlayback(request: ClipRequest, reduced: boolean, show: (frame: ClipFrame | null) => void) {
  const { durations, markers } = timings[request.clip];
  let timer: ReturnType<typeof setTimeout>;
  let repeats = request.clip === "11b-tail-wag-loop" ? 3 : 1;
  function step(index: number, elapsed: number) {
    if (index >= durations.length) {
      if (--repeats > 0) step(0, 0);
      else show(null);
      return;
    }
    show({ ...request, index, elapsed });
    timer = setTimeout(() => step(index + 1, elapsed + durations[index]), durations[index]);
  }
  if (reduced) {
    const event = Object.values(markers).find((value): value is number => typeof value === "number");
    let index = 0;
    let elapsed = 0;
    const target = event ?? durations.reduce((total, ms) => total + ms, 0) / 2;
    while (index < durations.length - 1 && elapsed + durations[index] <= target) elapsed += durations[index++];
    show({ ...request, index, elapsed });
    timer = setTimeout(() => show(null), 900);
  } else {
    step(0, 0);
  }
  return () => clearTimeout(timer);
}
