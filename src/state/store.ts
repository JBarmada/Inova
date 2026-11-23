import { useSyncExternalStore } from "react";
import type { Action } from "../shared/actions";
import { loadState, saveState } from "../services/storage";
import { playCue } from "../services/audio";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import type { ItemId } from "../shared/schema";

let state = initialState();
let queue: Promise<void> = Promise.resolve();
let stopping = false;
const listeners = new Set<() => void>();

export async function initialize(): Promise<void> {
  state = await loadState() ?? initialState();
}

export type MutationReceipt = { completed: boolean; unlocked: ItemId[] };

export function dispatchWithReceipt(action: Action): Promise<MutationReceipt> {
  if (stopping) return Promise.reject(Error("Inova is closing. Please wait."));
  const work = queue.catch(() => undefined).then(async () => {
    const next = reduce(state, action);
    await saveState(next);
    const rewarded = next.rewardedQuestIds.length > state.rewardedQuestIds.length;
    const adopted = !state.pet.adopted && next.pet.adopted;
    const unlocked = next.ownedItems.filter((item) => !state.ownedItems.includes(item));
    state = next;
    listeners.forEach((listener) => listener());
    playCue(rewarded || adopted ? "reward" : "click", state.settings.muted);
    return { completed: rewarded, unlocked };
  });
  queue = work.then(() => undefined);
  return work;
}

export function dispatch(action: Action): Promise<void> {
  return dispatchWithReceipt(action).then(() => undefined);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export const useInova = () => useSyncExternalStore(subscribe, () => state);

export function beginStateShutdown(): Promise<void> {
  stopping = true;
  return queue;
}

export function cancelStateShutdown(): void {
  stopping = false;
}
