import { expect, it } from "vitest";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { recentRecap } from "./recapData";
import type { Quest } from "../../shared/schema";

const now = Date.parse("2026-11-23T12:00:00.000Z");
const base: Quest = { id: "q", commitmentId: "c", title: "Walk", reason: "A step", sourceIds: ["c"], minutes: 10, status: "accepted", planner: "sample" };

it("records a completion timestamp once, leaving earlier undated records unchanged", () => {
  const state = { ...initialState(), quests: [base] };
  const result = reduce(state, { type: "complete-quest", id: "q", completedAt: "2026-11-22T00:00:00.000Z" });
  expect(result.quests[0].completedAt).toBe("2026-11-22T00:00:00.000Z");
  const duplicate = reduce(result, { type: "complete-quest", id: "q", completedAt: "2026-11-23T00:00:00.000Z" });
  expect(duplicate.quests[0].completedAt).toBe(result.quests[0].completedAt);
  expect(() => reduce(state, { type: "complete-quest", id: "q", completedAt: "invalid" })).toThrow();
});

it("counts only dated completions and memories in the trailing seven days", () => {
  const state = { ...initialState(), quests: [
    { ...base, id: "recent", status: "completed" as const, completedAt: "2026-11-22T00:00:00.000Z" },
    { ...base, id: "old", status: "completed" as const, completedAt: "2026-11-01T00:00:00.000Z" },
    { ...base, id: "future", status: "completed" as const, completedAt: "2026-11-24T00:00:00.000Z" },
    { ...base, id: "legacy", status: "completed" as const }, base,
  ], memories: [{ id: "m", text: "private", aiAllowed: false, createdAt: "2026-11-23T01:00:00.000Z" }] };
  expect(recentRecap(state, now)).toEqual({ quests: [state.quests[0]], memoryCount: 1, undatedCount: 1 });
});
