import { describe, expect, it } from "vitest";
import { costumes, costumeIds } from "./costumes";
import { costumeUnlocks } from "./costumeUnlocks";
import { itemById, items } from "./catalog";
import { itemIdSchema, slotForItem } from "./equipment";
import { initialState } from "../state/defaults";
import { stateSchema } from "./schema";

describe("costume catalog", () => {
  it("gives every look one unique, valid item ID and a readable unlock goal", () => {
    expect(costumeIds).toHaveLength(37);
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    for (const [id, , clue] of costumes) {
      expect(itemIdSchema.safeParse(id).success).toBe(true);
      expect(slotForItem[id]).toBe("body");
      const rule = costumeUnlocks[id];
      expect(itemById(id).description).toBe("category" in rule ? clue : `Complete ${rule.count} quests. ${clue}`);
    }
    expect(itemById("usc-hoodie").name).toBe("UFC hoodie");
  });
  it("continues to accept old profiles and new owned equipment without changing existing slots", () => {
    const old = initialState();
    expect(stateSchema.safeParse(old).success).toBe(true);
    for (const id of costumeIds) {
      const state = { ...old, ownedItems: [id], equipment: { ...old.equipment, body: id } };
      expect(stateSchema.safeParse(state).success).toBe(true);
      expect(stateSchema.safeParse({ ...state, ownedItems: [] }).success).toBe(false);
    }
  });
});
