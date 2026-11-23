import { describe, expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema } from "../shared/schema";
import { wearableSlots } from "../shared/equipment";
import { wardrobeScenarios } from "../shared/wardrobeScenarios";

const demo = () => reduce(initialState(), { type: "dev-mode", enabled: true });
const dressed = () => reduce(demo(), { type: "wardrobe-scenario", id: "rainy" });

describe("simultaneous equipment and fixtures", () => {
  it("equips four distinct slots and replaces only the chosen slot", () => {
    const original = dressed();
    const cozy = reduce(original, { type: "wardrobe-scenario", id: "cozy" });
    const swapped = reduce(cozy, { type: "equip", item: "cap" });
    expect(swapped.equipment).toEqual({ ...cozy.equipment, hat: "cap" });
    expect(Object.values(original.equipment).filter(Boolean)).toHaveLength(4);
    expect(original.equipment.hat).toBe("cap");
    expect(original.equipment.body).toBe("raincoat");
  });
  it("removes one slot without touching the others or item ownership", () => {
    const state = dressed();
    const next = reduce(state, { type: "unequip", slot: "socks" });
    expect(next.equipment).toEqual({ ...state.equipment, socks: null });
    expect(next.ownedItems).toEqual(state.ownedItems);
    const empty = reduce(next, { type: "equip", item: null });
    expect(Object.values(empty.equipment).every((id) => id === null)).toBe(true);
    expect(empty.ownedItems).toEqual(state.ownedItems);
  });
  it("blocks locked items, wrong slots, and unowned saved equipment", () => {
    expect(() => reduce(initialState(), { type: "equip", item: "cap" })).toThrow("locked");
    const state = dressed();
    expect(stateSchema.safeParse({ ...state, equipment: { ...state.equipment, hat: "raincoat" } }).success).toBe(false);
    expect(stateSchema.safeParse({ ...state, ownedItems: [] }).success).toBe(false);
  });
  it("keeps fixture grants behind dev mode and never fabricates quest rewards", () => {
    expect(() => reduce(initialState(), { type: "wardrobe-scenario", id: "rainy" })).toThrow("developer");
    for (const scenario of wardrobeScenarios) {
      const state = reduce(demo(), { type: "wardrobe-scenario", id: scenario.id });
      for (const slot of wearableSlots) {
        const id = state.equipment[slot];
        if (id) expect(state.ownedItems).toContain(id);
      }
      expect(state.rewardedQuestIds).toEqual([]);
      expect(state.quests).toEqual([]);
      expect(reduce(state, { type: "wardrobe-scenario", id: scenario.id }).ownedItems).toEqual(state.ownedItems);
    }
  });
  it("retains an outfit when dev mode is disabled and sound is muted", () => {
    const original = dressed();
    const muted = reduce(reduce(original, { type: "dev-mode", enabled: false }), { type: "mute", muted: true });
    expect(muted.equipment).toEqual(original.equipment);
    expect(stateSchema.parse(JSON.parse(JSON.stringify(muted)))).toEqual(muted);
  });
  it("adds real quest rewards without replacing the worn outfit", () => {
    const original = dressed();
    const state = { ...original,
      commitments: [{ id: "c", title: "Fictional project", createdAt: "2026-11-23T00:00:00.000Z" }],
      quests: [{ id: "q", commitmentId: "c", title: "Draft", reason: "Start", minutes: 10,
        sourceIds: ["c"], status: "accepted" as const, planner: "sample" as const }] };
    const next = reduce(state, { type: "complete-quest", id: "q" });
    expect(next.equipment).toEqual(original.equipment);
    expect(next.ownedItems).toContain("notebook");
    expect(next.rewardedQuestIds).toEqual(["q"]);
  });
});

describe("version-one wardrobe migration", () => {
  function legacy(item: "notebook" | "bandana" | null) {
    const { equipment: _, ...state } = initialState();
    return { ...state, schemaVersion: 1, settings: { muted: true },
      ownedItems: item ? [item] : [], equippedItem: item,
      memories: [{ id: "demo-memory", text: "Fictional reflection", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" }] };
  }
  it.each(["notebook", "bandana", null] as const)("preserves legacy %s, ownership, memories and settings", (item) => {
    const old = legacy(item);
    const loaded = stateSchema.parse(old);
    expect(loaded.schemaVersion).toBe(2);
    expect(loaded.equipment).toEqual({ hat: null, glasses: null, socks: null, body: item });
    expect(loaded.ownedItems).toEqual(old.ownedItems);
    expect(loaded.memories).toEqual(old.memories);
    expect(loaded.settings).toEqual({ muted: true, devMode: false, showStatus: false, localModel: "gemma3:12b", questMinuteLimit: 0 });
    expect(loaded).not.toHaveProperty("equippedItem");
    expect(stateSchema.parse(loaded)).toEqual(loaded);
  });
  it("rejects broken and future saves rather than resetting them", () => {
    expect(stateSchema.safeParse({ ...legacy("bandana"), ownedItems: [] }).success).toBe(false);
    expect(stateSchema.safeParse({ ...legacy(null), schemaVersion: 99 }).success).toBe(false);
    expect(stateSchema.safeParse({ ...initialState(), equipment: {} }).success).toBe(false);
  });
});
