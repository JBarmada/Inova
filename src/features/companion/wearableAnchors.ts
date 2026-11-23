import type { WearableSlot } from "../../shared/equipment";
import type { dogArt } from "./dogArt";

export type ArtFrame = keyof typeof dogArt;
export type Placement = { x: number; y: number; width: number; height: number };
export function wearableAnchors(frame: ArtFrame): Record<WearableSlot, Placement[]> {
  const shift = frame === "sitting" ? -3 : frame === "tucking" ? -2 : 0;
  const feet = frame === "sitting" ? [[12, 52], [18, 53], [24, 53], [30, 52]]
    : frame === "tucking" ? [[18, 53], [24, 53], [31, 52]]
      : [[18, 51], [27, 52], [35, 52], [44, 51]];
  return {
    hat: [{ x: 12, y: 15 + shift, width: 18, height: 9 }],
    glasses: [{ x: 10, y: 24 + shift, width: 21, height: 8 }],
    body: [{ x: 14, y: 41 + shift, width: 16, height: 10 }],
    socks: feet.map(([x, y]) => ({ x: x - 2, y: y - 1, width: 4, height: 3 })),
  };
}
