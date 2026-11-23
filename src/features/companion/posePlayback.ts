export type DogPose = "standing" | "tucking" | "sitting";
export const IDLE_SIT_DELAY = 8_000;
export const TUCK_DURATION = 160;

export type DogMood = "idle" | "happy" | "tired";

export function createPosePlayback(show: (pose: DogPose) => void, reducedMotion: boolean, initialMood: DogMood = "idle") {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let pose: DogPose = "standing";
  let mood = initialMood;
  let reduced = reducedMotion;
  function cancel() { clearTimeout(timer); }
  function publish(next: DogPose) { pose = next; show(next); }
  function scheduleIdle() {
    if (!disposed && pose === "standing" && mood === "idle") timer = setTimeout(sit, IDLE_SIT_DELAY);
  }
  function sit() {
    if (disposed || pose !== "standing") return;
    cancel();
    if (reduced) publish("sitting");
    else {
      publish("tucking");
      timer = setTimeout(() => { if (!disposed) publish("sitting"); }, TUCK_DURATION);
    }
  }
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
  }
  function setReducedMotion(next: boolean) {
    reduced = next;
    if (!disposed && reduced && pose === "tucking") { cancel(); publish("sitting"); }
  }
  function dispose() { disposed = true; cancel(); }
  publish("standing");
  scheduleIdle();
  return { sit, stand, setMood, setReducedMotion, dispose };
}
