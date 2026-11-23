import type { WearableSlot } from "../../shared/equipment";
import type { dogArt } from "./dogArt";
import { fittedFrames, fittedHeadShift, isFittedFrame } from "./poseFrames";

export type ArtFrame = keyof typeof dogArt;
export type Placement = { x: number; y: number; width: number; height: number };
// Foot centers sampled from the cream socks in each native fitted frame.
const fittedFeet = [
  [[16, 52], [25, 52], [34, 52], [40, 52]],
  [[16, 52], [25, 52], [37, 52]],
  [[16, 52], [24, 52], [36, 52]],
  [[16, 52], [24, 52], [36, 52]],
  [[16, 52], [24, 52], [33, 52]],
  [[17, 52], [24, 52], [31, 52]],
];

export function wearableAnchors(frame: ArtFrame): Record<WearableSlot, Placement[]> {
  const seated = frame.startsWith("sitting");
  const restShift = { sleeping: 9, "sleep-drowsy": 7, "sleep-doze": 8, "wake-ear": 9, "wake-eyes": 8 };
  const low = restShift[frame as keyof typeof restShift];
  const loaf = frame.startsWith("loaf-") || low !== undefined;
  const fitted = isFittedFrame(frame) ? fittedFrames.indexOf(frame) : -1;
  const shift = fitted >= 0 ? fittedHeadShift[fitted] : loaf ? low ?? (frame === "loaf-bend" ? 0 : frame === "loaf-tuck" ? 4 : 7)
    : seated ? -3 : frame === "tucking" ? -2 : 0;
  const feet = loaf ? frame === "loaf-bend" ? [[18, 53], [24, 53]] : frame === "loaf-tuck" ? [[18, 53], [25, 53]] : []
    : fitted >= 0 ? fittedFeet[fitted] : seated ? [[12, 52], [18, 53], [24, 53], [30, 52]]
    : frame === "tucking" ? [[18, 53], [24, 53], [31, 52]]
      : [[18, 51], [27, 52], [35, 52], [44, 51]];
  return {
    hat: [{ x: 12, y: 15 + shift, width: 18, height: 9 }],
    glasses: [{ x: 10, y: 24 + shift, width: 21, height: 8 }],
    body: [{ x: 14, y: 41 + (loaf ? Math.min(shift, 4) : shift), width: 16, height: 10 }],
    socks: feet.map(([x, y]) => ({ x: x - 2, y: y - 1, width: 4, height: 3 })),
  };
}
