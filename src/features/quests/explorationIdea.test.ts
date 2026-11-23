import { expect, it } from "vitest";
import { explorationIdea } from "./explorationIdea";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";

it("creates an idea from supplied details without scheduling or external claims", () => {
  const idea = explorationIdea("  watercolor  ", 8, "explore", new Date("2026-11-23T12:00:00Z"));
  expect(idea.interest).toBe("watercolor");
  expect(idea.minutes).toBe(8);
  expect(idea.title).toContain("watercolor");
  expect(explorationIdea("watercolor", 8, "gentle", new Date()).title).not.toBe(idea.title);
  expect(() => explorationIdea(" ", 8, "gentle", new Date())).toThrow();
  expect(() => explorationIdea("x", 0, "gentle", new Date())).toThrow();
});

it("saves a commitment and proposed quest atomically, respecting the current limit", () => {
  const state = { ...initialState(), settings: { ...initialState().settings, questMinuteLimit: 5 } };
  const commitment = { id: "c", title: "Explore watercolor", createdAt: "2026-11-23T00:00:00.000Z" };
  const quest = { id: "q", commitmentId: "c", title: "Try a small idea", reason: "Sample idea", minutes: 5,
    sourceIds: ["c"], planner: "sample" as const, status: "proposed" as const };
  const result = reduce(state, { type: "add-exploration", commitment, quest });
  expect(result.commitments).toHaveLength(1);
  expect(result.quests).toHaveLength(1);
  expect(result.rewardedQuestIds).toEqual([]);
  expect(() => reduce(state, { type: "add-exploration", commitment, quest: { ...quest, minutes: 6 } })).toThrow("length limit");
  expect(state.commitments).toEqual([]);
  expect(state.quests).toEqual([]);
});
