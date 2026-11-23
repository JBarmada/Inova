import { useSyncExternalStore } from "react";

let active = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

export function rewardReactionActive() { return active; }
export function subscribeRewardReaction(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function triggerRewardReaction() {
  clearTimeout(timer);
  active = true;
  listeners.forEach((listener) => listener());
  timer = setTimeout(() => {
    active = false;
    listeners.forEach((listener) => listener());
  }, 4000);
}
export function useRewardReaction() {
  return useSyncExternalStore(subscribeRewardReaction, rewardReactionActive, () => false);
}
