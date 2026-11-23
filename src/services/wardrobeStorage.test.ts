import { beforeEach, describe, expect, it, vi } from "vitest";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { loadState, saveState } from "./storage";

vi.mock("@tauri-apps/api/core", () => ({ isTauri: () => false }));
const data = new Map<string, string>();
beforeEach(() => {
  data.clear();
  vi.stubGlobal("localStorage", { getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value) });
});
describe("wardrobe save and recovery", () => {
  it("migrates legacy storage without discarding it before the next successful save", async () => {
    const { equipment: _, ...state } = initialState();
    const original = JSON.stringify({ ...state, schemaVersion: 1, ownedItems: ["bandana"], equippedItem: "bandana" });
    data.set("inova-state-v1", original);
    const loaded = await loadState();
    expect(loaded?.equipment.body).toBe("bandana");
    expect(data.get("inova-state-v1")).toBe(original);
    await saveState(loaded!);
    expect((await loadState())?.schemaVersion).toBe(2);
  });
  it("restores four slots across a real storage round trip", async () => {
    const state = reduce(reduce(initialState(), { type: "dev-mode", enabled: true }), { type: "wardrobe-scenario", id: "cozy" });
    await saveState(state);
    expect(await loadState()).toEqual(state);
  });
  it("leaves malformed saves untouched and propagates storage failures", async () => {
    data.set("inova-state-v1", "broken-json");
    await expect(loadState()).rejects.toThrow();
    expect(data.get("inova-state-v1")).toBe("broken-json");
    vi.stubGlobal("localStorage", { setItem: () => { throw Error("Disk full"); } });
    await expect(saveState(initialState())).rejects.toThrow("Disk full");
  });
});
