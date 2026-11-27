import type { ArtFrame } from "./wearableAnchors";
import { fittedFrames, fittedHeadShift } from "./poseFrames";

const fittedMuzzles = new Map<ArtFrame, number>(
  fittedFrames.map((frame, index) => [frame, 32 + fittedHeadShift[index]]),
);

const muzzleRows: Partial<Record<ArtFrame, number>> = {
  happy: 33, tired: 35, tucking: 30,
  "loaf-tuck": 36, "loaf-idle": 39, "loaf-happy": 39, "loaf-tired": 39,
  "sleep-drowsy": 39, "sleep-doze": 40, sleeping: 41, "wake-ear": 41, "wake-eyes": 40,
};

const registeredHeadwear = [
  "army-hat", "flower", "toad", "farquaad", "harry-potter", "clown",
  "bathrobe", "spa", "usc-hoodie", "pikachu", "shrek", "mort",
  "iso", "omen", "killjoy",
  "shrimp", "wonder-bread", "chicken-nugget",
  "christmas-present", "maple-leaf", "turkey",
  "bush", "bibble", "fungus",
  "soju", "white-house", "elmo",
  "trojan", "ahri", "teemo",
  "britney", "goth", "egirl",
] as const;
export type FittedHeadId = typeof registeredHeadwear[number];

export function isRegisteredHeadwear(id: string | null): id is FittedHeadId {
  return registeredHeadwear.some((candidate) => candidate === id);
}

export function fittedHeadCostume(id: string | null) {
  return id === "mustache" || id === "bob" || id === "lorax" || isRegisteredHeadwear(id);
}

export function faceCostumePlacement(frame: ArtFrame, walkFrame?: number) {
  const y = muzzleRows[frame] ?? fittedMuzzles.get(frame) ?? (frame.startsWith("sitting") ? 29 : 32);
  const expressionShift = frame === "happy" ? 1 : frame === "tired" ? 3 : 0;
  if (walkFrame !== undefined) {
    // Centers measured from the nose pixels in the eight welcome atlas columns.
    return { x: [23, 23, 23, 22.5, 22.5, 22.5, 23, 22][walkFrame] ?? 23, y: 29, headY: -3 };
  }
  return { x: 20, y, headY: y - 32 - expressionShift };
}
