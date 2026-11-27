import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DogSprite } from "./DogSprite";
import { costumeIds } from "../../shared/costumes";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { stateSchema } from "../../shared/schema";
import { previewOutfit } from "../world/previewOutfit";

beforeEach(() => vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) }));
afterEach(() => vi.unstubAllGlobals());

describe("costume wardrobe flow", () => {
  it("previews every locked costume in both poses without granting or equipping it", () => {
    const state = initialState();
    for (const id of costumeIds) {
      const equipment = previewOutfit(state.equipment, { body: id });
      for (const pose of ["standing", "sitting"] as const) {
        const html = renderToStaticMarkup(<DogSprite state={{ ...state, equipment }} pose={pose} />);
        expect(html).toContain(`data-pose="${pose}"`);
        if (id === "bee") {
          expect(html).toContain(pose === "standing" ? "bee-approved-standing.png" : "bee-sitting.png");
        } else {
          expect(html).toContain(`data-item="${id}"`);
          expect(html).toMatch(/dog-base/);
        }
      }
    }
    expect(state.equipment.body).toBeNull();
    expect(state.ownedItems).toEqual([]);
  });

  it("requires Dev mode for every unlock, equips only owned items, and reloads each costume", () => {
    const initial = initialState();
    for (const id of costumeIds) {
      expect(() => reduce(initial, { type: "dev-unlock-item", item: id })).toThrow(/developer mode/i);
      expect(() => reduce(initial, { type: "equip", item: id })).toThrow(/locked/i);
      const enabled = { ...initial, settings: { ...initial.settings, devMode: true } };
      const unlocked = reduce(enabled, { type: "dev-unlock-item", item: id });
      const equipped = reduce(unlocked, { type: "equip", item: id });
      const restored = stateSchema.parse(JSON.parse(JSON.stringify(equipped)));
      expect(restored.equipment.body).toBe(id);
      expect(restored.ownedItems).toEqual([id]);
      expect(reduce(restored, { type: "unequip", slot: "body" }).ownedItems).toEqual([id]);
    }
  });

  it("keeps other equipped slots when replacing or removing a costume", () => {
    let state = initialState();
    state.settings.devMode = true;
    for (const id of ["cap", "round-glasses", "mint-socks", "bee", "shrek"] as const) {
      state = reduce(state, { type: "dev-unlock-item", item: id });
      state = reduce(state, { type: "equip", item: id });
    }
    expect(state.equipment).toEqual({ hat: "cap", glasses: "round-glasses", socks: "mint-socks", body: "shrek" });
    const html = renderToStaticMarkup(<DogSprite state={state} pose="standing" />);
    for (const id of Object.values(state.equipment)) expect(html).toContain(`data-item="${id}"`);
    const removed = reduce(state, { type: "unequip", slot: "body" });
    expect(removed.equipment).toEqual({ ...state.equipment, body: null });
    expect(removed.ownedItems).toContain("shrek");
  });
});
