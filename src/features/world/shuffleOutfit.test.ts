import { expect, it } from "vitest";
import { shuffledOutfit } from "./shuffleOutfit";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { stateSchema } from "../../shared/schema";

it("picks only owned items in their compatible slots and leaves empty slots empty", () => {
  expect(shuffledOutfit(["cap", "beanie", "bandana"], () => 0.99)).toEqual({
    hat: "beanie", glasses: null, socks: null, body: "bandana",
  });
  expect(shuffledOutfit([], () => 0)).toEqual({ hat: null, glasses: null, socks: null, body: null });
});

it("saves an owned outfit atomically while rejecting locked or mismatched items", () => {
  const state = { ...initialState(), ownedItems: ["cap", "bandana"] as const };
  const owned = { ...state, ownedItems: [...state.ownedItems] };
  const equipment = shuffledOutfit(owned.ownedItems, () => 0);
  const result = reduce(owned, { type: "equip-outfit", equipment });
  expect(stateSchema.parse(JSON.parse(JSON.stringify(result))).equipment).toEqual(equipment);
  expect(result.ownedItems).toEqual(owned.ownedItems);
  expect(result.rewardedQuestIds).toEqual([]);
  expect(() => reduce(owned, { type: "equip-outfit", equipment: { ...equipment, socks: "gold-socks" } })).toThrow("locked");
  expect(() => reduce(owned, { type: "equip-outfit", equipment: { ...equipment, hat: "bandana" } })).toThrow();
});
