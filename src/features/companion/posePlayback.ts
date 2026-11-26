import { TIRED_FACE_ENTRY_MS } from "./seatedFacePlayback";

export type DogPose = "standing" | "tucking" | "sitting" | "loaf-bend" | "loaf-tuck" | "loaf";
export const IDLE_SIT_DELAY = 8_000;
export const TUCK_DURATION = 160;
/** Approved v36: tired sitting holds 7s (after the face entry), then two 220ms breakdowns. */
export const LOAF_DELAY = 7_000;
export const LOAF_STEP_DURATION = 220;

export type DogMood = "idle" | "happy" | "tired";

/** Poses where the dog is down and the pose control should offer Stand. */
export function isResting(pose: DogPose) { return pose !== "standing" && pose !== "tucking"; }

export function createPosePlayback(show: (pose: DogPose) => void, reducedMotion: boolean, initialMood: DogMood = "idle") {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let pose: DogPose = "standing";
  let mood = initialMood;
  let reduced = reducedMotion;
  function cancel() { clearTimeout(timer); timer = undefined; }
  function publish(next: DogPose) { pose = next; show(next); }
  function later(ms: number, action: () => void) {
    timer = setTimeout(() => { if (!disposed) action(); }, ms);
  }
  function scheduleIdle() {
    if (!disposed && pose === "standing" && mood === "idle") later(IDLE_SIT_DELAY, sit);
  }
  // One deadline per stable sitting+tired state; duplicate tired events never restart it.
  function scheduleLoaf() {
    if (!disposed && pose === "sitting" && mood === "tired") later((reduced ? 0 : TIRED_FACE_ENTRY_MS) + LOAF_DELAY, lieDown);
  }
  function settle() { publish("sitting"); scheduleLoaf(); }
  function sit() {
    if (disposed || pose !== "standing") return;
    cancel();
    if (reduced) settle();
    else { publish("tucking"); later(TUCK_DURATION, settle); }
  }
  function lieDown() {
    if (pose !== "sitting" || mood !== "tired") return;
    if (reduced) { publish("loaf"); return; }
    publish("loaf-bend");
    later(LOAF_STEP_DURATION, () => {
      publish("loaf-tuck");
      later(LOAF_STEP_DURATION, () => publish("loaf"));
    });
  }
  // No reviewed rise clip exists yet, so standing from any resting pose is a direct switch.
  function stand() {
    if (disposed || pose === "standing") return;
    cancel();
    publish("standing");
    scheduleIdle();
  }
  function setMood(next: DogMood) {
    if (disposed || mood === next) return;
    mood = next;
    if (pose === "standing") { cancel(); scheduleIdle(); }
    else if (pose === "sitting") { cancel(); scheduleLoaf(); }
  }
  function setReducedMotion(next: boolean) {
    reduced = next;
    if (disposed || !reduced) return;
    if (pose === "tucking") { cancel(); settle(); }
    else if (pose === "loaf-bend" || pose === "loaf-tuck") { cancel(); publish("loaf"); }
  }
  function dispose() { disposed = true; cancel(); }
  publish("standing");
  scheduleIdle();
  return { sit, stand, setMood, setReducedMotion, dispose };
}
