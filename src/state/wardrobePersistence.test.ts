import { afterEach, expect, it, vi } from "vitest";
import { costumeIds } from "../shared/costumes";
import type { AppState } from "../shared/schema";
import { loadState, saveState } from "../services/storage";
import { initialState } from "./defaults";

const desktop = vi.hoisted(() => ({ enabled: false, disk: new Map<string, string>() }));

vi.mock("@tauri-apps/api/core", () => ({ isTauri: () => desktop.enabled }));
vi.mock("@tauri-apps/plugin-store", () => ({
  load: async () => {
    const pending = new Map<string, string>();
    return {
      get: async (key: string) => JSON.parse(desktop.disk.get(key) ?? "null"),
      set: async (key: string, value: unknown) => { pending.set(key, JSON.stringify(value)); },
      save: async () => {
        for (const [key, value] of pending) desktop.disk.set(key, value);
      },
    };
  },
}));
vi.mock("../services/audio", () => ({ playCue: vi.fn() }));

const accessories = { hat: "cap", glasses: "round-glasses", socks: "mint-socks" } as const;

function savedWardrobe(): AppState {
  const initial = initialState();
  return {
    ...initial,
    equipment: { ...accessories, body: null },
    ownedItems: [...Object.values(accessories), ...costumeIds],
    settings: { ...initial.settings, muted: true },
  };
}

afterEach(() => {
  desktop.enabled = false;
  desktop.disk.clear();
  vi.unstubAllGlobals();
});

it.each(["browser", "desktop"] as const)("restores every costume and preserves the other slots through %s storage", async (platform) => {
  desktop.enabled = platform === "desktop";
  const browserDisk = new Map<string, string>();
  if (!desktop.enabled) {
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => browserDisk.get(key) ?? null,
      setItem: (key: string, value: string) => { browserDisk.set(key, value); },
    });
  }
  const original = savedWardrobe();
  await saveState(original);
  vi.resetModules();
  const { dispatch, initialize } = await import("./store");
  await initialize();

  for (const id of costumeIds) {
    await dispatch({ type: "equip", item: id });
    expect(await loadState(), id).toEqual({ ...original, equipment: { ...accessories, body: id } });
    await initialize();

    await dispatch({ type: "unequip", slot: "body" });
    expect(await loadState(), id).toEqual(original);
    await initialize();
  }
});
