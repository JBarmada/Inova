import { isTauri } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";
import { stateSchema, type AppState } from "../shared/schema";

const key = "inova-state-v1";
const desktopStore = () => load("inova.json", { autoSave: false, defaults: {} });

export async function loadState(): Promise<AppState | null> {
  const raw = isTauri() ? await (await desktopStore()).get(key) : JSON.parse(localStorage.getItem(key) ?? "null");
  return raw == null ? null : stateSchema.parse(raw);
}

export async function saveState(state: AppState): Promise<void> {
  const valid = stateSchema.parse(state);
  if (!isTauri()) {
    localStorage.setItem(key, JSON.stringify(valid));
    return;
  }
  const store = await desktopStore();
  await store.set(key, valid);
  await store.save();
}
