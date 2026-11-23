import { useSyncExternalStore } from "react";
import type { Action } from "../shared/actions";
import { loadState, saveState } from "../services/storage";
import { playCue } from "../services/audio";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

let state = initialState();
let queue: Promise<void> = Promise.resolve();
const listeners = new Set<() => void>();

export async function initialize(): Promise<void> {
  state = await loadState() ?? initialState();
}

export function dispatch(action: Action): Promise<void> {
  const work = queue.catch(() => undefined).then(async () => {
    const next = reduce(state, action);
    await saveState(next);
    const rewarded = next.rewardedQuestIds.length > state.rewardedQuestIds.length;
    state = next;
    listeners.forEach((listener) => listener());
    playCue(rewarded ? "reward" : "click", state.settings.muted);
  });
  queue = work;
  return work;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export const useInova = () => useSyncExternalStore(subscribe, () => state);
