import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import type { Quest } from "../shared/schema";

const quest: Quest = { id: "q", commitmentId: "c", title: "Original", reason: "Reason", sourceIds: ["c"], minutes: 10, status: "proposed", planner: "sample" };

it("edits a nonterminal quest while preserving its evidence and status", () => {
  const state = { ...initialState(), quests: [quest] };
  const result = reduce(state, { type: "edit-quest", id: "q", title: "  Smaller step  " });
  expect(result.quests[0]).toEqual({ ...quest, title: "Smaller step" });
  expect(state.quests[0].title).toBe("Original");
});

it("rejects empty, missing, completed and dismissed quests", () => {
  const state = { ...initialState(), quests: [quest] };
  expect(() => reduce(state, { type: "edit-quest", id: "q", title: "  " })).toThrow();
  expect(() => reduce(state, { type: "edit-quest", id: "missing", title: "New" })).toThrow();
  for (const status of ["completed", "dismissed"] as const) {
    expect(() => reduce({ ...state, quests: [{ ...quest, status }] }, { type: "edit-quest", id: "q", title: "New" })).toThrow();
  }
});
