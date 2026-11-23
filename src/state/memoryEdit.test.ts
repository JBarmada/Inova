import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import type { Quest, Memory } from "../shared/schema";

const memory: Memory = { id: "m", text: "Old reflection", createdAt: "2026-11-23T00:00:00.000Z", aiAllowed: true };
const quest: Quest = { id: "q", commitmentId: "c", title: "Step", reason: "Old reflection", sourceIds: ["c", "m"], minutes: 10, status: "proposed", planner: "sample" };

it("updates only the memory text and clears stale copied rationale and evidence", () => {
  const state = { ...initialState(), memories: [memory], quests: [quest] };
  const updated = reduce(state, { type: "edit-memory", id: "m", text: "  New reflection  " });
  expect(updated.memories[0]).toEqual({ ...memory, text: "New reflection" });
  expect(updated.quests[0].sourceIds).toEqual(["c"]);
  expect(updated.quests[0].reason).not.toContain("Old reflection");
  expect(state.memories[0].text).toBe("Old reflection");
});

it("leaves references intact for unchanged text and rejects invalid edits", () => {
  const state = { ...initialState(), memories: [memory], quests: [quest] };
  expect(reduce(state, { type: "edit-memory", id: "m", text: memory.text }).quests[0]).toEqual(quest);
  expect(() => reduce(state, { type: "edit-memory", id: "m", text: "   " })).toThrow();
  expect(() => reduce(state, { type: "edit-memory", id: "missing", text: "Text" })).toThrow();
});
