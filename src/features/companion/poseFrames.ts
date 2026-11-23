export const fittedFrames = [
  "sit-02", "sit-03", "sit-04", "sit-05", "sit-06", "sit-07",
] as const;

export type FittedFrame = typeof fittedFrames[number];
export const fittedFrameMs = [130, 120, 120, 140, 150, 180] as const;
export const fittedHeadShift = [0, 0, -1, -1, -2, -2] as const;

export const loafFrames = ["loaf-bend", "loaf-tuck"] as const;
export type LoafFrame = typeof loafFrames[number];
export const LOAF_FRAME_MS = 220;

export function isLoafFrame(frame: string): frame is LoafFrame {
  return loafFrames.some((name) => name === frame);
}

export function isFittedFrame(frame: string): frame is FittedFrame {
  return fittedFrames.some((name) => name === frame);
}
