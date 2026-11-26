import type { WearableSlot } from "../../shared/equipment";
import type { dogArt } from "./dogArt";

export type ArtFrame = keyof typeof dogArt;
export type Placement = { x: number; y: number; width: number; height: number };

type Fit = { head: number; body: number; feet: number[][] };
const SEATED_FEET = [[12, 52], [18, 53], [24, 53], [30, 52]];
// Loaf head offsets are the measured v36 head translation from tired sitting (3, 7, 10 px down).
// Body stays above the ground row; loaf paws are tucked out of sight, so socks are hidden there.
const FITS: Partial<Record<ArtFrame, Fit>> = {
  tucking: { head: -2, body: -2, feet: [[18, 53], [24, 53], [31, 52]] },
  "loaf-bend": { head: 0, body: 0, feet: SEATED_FEET },
  "loaf-tuck": { head: 4, body: 3, feet: [[18, 53], [25, 53]] },
  loaf: { head: 7, body: 3, feet: [] },
};

function fitFor(frame: ArtFrame): Fit {
  if (frame.startsWith("sitting")) return { head: -3, body: -3, feet: SEATED_FEET };
  return FITS[frame] ?? { head: 0, body: 0, feet: [[18, 51], [27, 52], [35, 52], [44, 51]] };
}

export function wearableAnchors(frame: ArtFrame): Record<WearableSlot, Placement[]> {
  const { head, body, feet } = fitFor(frame);
  return {
    hat: [{ x: 12, y: 15 + head, width: 18, height: 9 }],
    glasses: [{ x: 10, y: 24 + head, width: 21, height: 8 }],
    body: [{ x: 14, y: 41 + body, width: 16, height: 10 }],
    socks: feet.map(([x, y]) => ({ x: x - 2, y: y - 1, width: 4, height: 3 })),
  };
}
