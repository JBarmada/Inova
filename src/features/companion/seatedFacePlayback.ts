import type { dogArt } from "./dogArt";

export type FaceFrame = keyof typeof dogArt;
export const TIRED_FACE_STEPS: [FaceFrame, number][] = [
  ["sitting", 900], ["sitting-blink", 100], ["sitting", 350],
  ["sitting-drowsy", 450], ["sitting-blink", 250],
];

export function createSeatedFacePlayback(show: (frame: FaceFrame) => void, reduced = false) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  function step(index: number) {
    if (disposed) return;
    const entry = TIRED_FACE_STEPS[index];
    if (!entry || reduced) { show("sitting-tired"); return; }
    show(entry[0]);
    timer = setTimeout(() => step(index + 1), entry[1]);
  }
  step(0);
  return () => { disposed = true; clearTimeout(timer); };
}
