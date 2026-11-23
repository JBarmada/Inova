import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import type { Memory, Quest } from "../shared/schema";

const quest: Quest = { id: "q", commitmentId: "c", title: "A walk", reason: "A small step", sourceIds: ["c"], minutes: 10, status: "completed", planner: "sample" };
const memory: Memory = { id: "m", text: "Felt good", createdAt: "2026-11-23T00:00:00.000Z", aiAllowed: false, questId: "q" };

it("saves a reflection connected to a completed adventure", () => {
  const state = { ...initialState(), quests: [quest] };
  const saved = reduce(state, { type: "add-memory", memory });
  expect(saved.memories[0]).toEqual(memory);
  expect(reduce(saved, { type: "edit-memory", id: "m", text: "Updated" }).memories[0].questId).toBe("q");
});

it("rejects links to unfinished or nonexistent adventures while allowing independent memories", () => {
  const state = { ...initialState(), quests: [{ ...quest, status: "accepted" as const }] };
  expect(() => reduce(state, { type: "add-memory", memory })).toThrow("completed first");
  expect(() => reduce(initialState(), { type: "add-memory", memory })).toThrow("completed first");
  const { questId: _, ...standalone } = memory;
  expect(reduce(state, { type: "add-memory", memory: standalone }).memories).toHaveLength(1);
});
