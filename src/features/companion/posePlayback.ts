import { fittedFrames, fittedFrameMs, isFittedFrame, isLoafFrame, loafFrames, LOAF_FRAME_MS,
  type FittedFrame, type LoafFrame } from "./poseFrames";
import { TIRED_FACE_STEPS } from "./seatedFacePlayback";

export type DogPose = "standing" | "tucking" | "sitting" | "loaf" | FittedFrame | LoafFrame;
export const IDLE_SIT_DELAY = 8_000;
export const TIRED_LOAF_DELAY = 7_000;
export const TIRED_FACE_DURATION = TIRED_FACE_STEPS.reduce((total, [, ms]) => total + ms, 0);
export const FITTED_DURATION = fittedFrameMs.reduce<number>((total, ms) => total + ms, 0);

export type DogMood = "idle" | "happy" | "tired";

function standFrameIndex(pose: DogPose) {
  if (pose === "loaf") return loafFrames.length - 1;
  if (isLoafFrame(pose)) return loafFrames.indexOf(pose) - 1;
  return isFittedFrame(pose) ? fittedFrames.indexOf(pose) - 1 : fittedFrames.length - 1;
}

function restTimer() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return {
    set: (run: () => void, ms: number) => { timer = setTimeout(run, ms); },
    cancel: () => clearTimeout(timer),
  };
}

export function createPosePlayback(show: (pose: DogPose) => void, reducedMotion: boolean, initialMood: DogMood = "idle") {
  const timer = restTimer();
  let disposed = false;
  let pose: DogPose = "standing";
  let mood = initialMood;
  let reduced = reducedMotion;
  let destination: "standing" | "sitting" | "loaf" = "standing";
  let tiredSince: number | undefined;
  function publish(next: DogPose) { pose = next; show(next); }
  function scheduleRest() {
    if (pose === "standing" && mood === "idle") timer.set(sit, IDLE_SIT_DELAY);
    if (pose === "sitting" && mood === "tired") {
      tiredSince ??= Date.now();
      const remaining = tiredSince + (reduced ? 0 : TIRED_FACE_DURATION) + TIRED_LOAF_DELAY - Date.now();
      timer.set(loaf, Math.max(0, remaining));
    }
  }
  function finish() {
    publish(destination);
    scheduleRest();
  }
  function step(index: number) {
    const frame = fittedFrames[index];
    if (reduced || !frame) return finish();
    playFrame(frame, fittedFrameMs[index], () => step(index + (destination === "sitting" ? 1 : -1)));
  }
  function playFrame(frame: DogPose, duration: number, next: () => void) {
    publish(frame);
    timer.set(next, duration);
  }
  function sit() {
    if (disposed || pose !== "standing") return;
    timer.cancel();
    destination = "sitting";
    step(0);
  }
  function lower(index: number) {
    const frame = loafFrames[index];
    if (reduced) return finish();
    if (!frame) return destination === "loaf" ? finish() : playFrame("sitting", 130, () => step(fittedFrames.length - 1));
    playFrame(frame, LOAF_FRAME_MS, () => lower(index + (destination === "loaf" ? 1 : -1)));
  }
  function loaf() {
    if (disposed || pose !== "sitting" || mood !== "tired") return;
    tiredSince = undefined;
    destination = "loaf";
    lower(0);
  }
  function stand() {
    if (disposed || destination === "standing") return;
    timer.cancel();
    destination = "standing";
    tiredSince = undefined;
    const index = standFrameIndex(pose);
    if (pose === "loaf" || isLoafFrame(pose)) lower(index);
    else step(index);
  }
  function setMood(next: DogMood) {
    if (disposed || mood === next) return;
    mood = next;
    if (pose !== "standing" && (pose !== "sitting" || destination !== "sitting")) return;
    timer.cancel(); tiredSince = undefined; scheduleRest();
  }
  function setReducedMotion(next: boolean) {
    if (reduced === next || disposed) return;
    reduced = next;
    if (reduced && pose !== destination) { timer.cancel(); finish(); }
    else if (pose === "sitting" && mood === "tired") { timer.cancel(); scheduleRest(); }
  }
  function dispose() { disposed = true; timer.cancel(); }
  publish("standing");
  scheduleRest();
  return { sit, stand, setMood, setReducedMotion, dispose };
}
