export type DogPose = "standing" | "tucking" | "sitting";
export const IDLE_SIT_DELAY = 8_000;
export const TUCK_DURATION = 160;

export function createPosePlayback(show: (pose: DogPose) => void, reducedMotion: boolean) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  function cancel() { clearTimeout(timer); }
  function sit() {
    cancel();
    if (disposed) return;
    if (reducedMotion) show("sitting");
    else {
      show("tucking");
      timer = setTimeout(() => { if (!disposed) show("sitting"); }, TUCK_DURATION);
    }
  }
  function stand() {
    cancel();
    if (disposed) return;
    show("standing");
    timer = setTimeout(sit, IDLE_SIT_DELAY);
  }
  function dispose() { disposed = true; cancel(); }
  stand();
  return { sit, stand, dispose };
}
