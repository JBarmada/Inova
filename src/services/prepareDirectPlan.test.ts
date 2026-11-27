import { fictionalPlan } from "./planFixture";
import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { prepareDirectPlan } from "./prepareDirectPlan";
import { proposeLocalPlan } from "./localPlan";
import { prepareSavedPlan } from "./savedPlan";
import { stateSchema } from "../shared/schema";
import { retainedPlanSteps } from "../features/quests/retainedPlanSteps";

it("accepts a direct AI plan atomically without changing an ongoing chat", async () => {
  let state = reduce(initialState(), { type: "adopt", name: "Pip" });
  state = reduce(state, { type: "chat-goal", text: "Another goal" });
  const draft = await prepareDirectPlan("Try painting", state, false, fictionalPlan);
  expect(draft.fallback).toBe(false);
  expect(state.quests).toHaveLength(0);
  const action = { type: "accept-direct-plan" as const, ...draft };
  const saved = reduce(state, action);
  expect(saved.quests[0]).toMatchObject({ status: "accepted", planner: "local" });
  expect(saved.chat).toEqual(state.chat);
  expect(() => reduce(saved, action)).toThrow();
  expect(() => reduce(initialState(), action)).toThrow("cannot be accepted");
});

it("continues a direct multi-step quest after completion, reflection and reload", async () => {
  let state = reduce(initialState(), { type: "adopt", name: "Pip" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ explanation: "Start small and build on it.", steps: [
    { title: "Pick a subject", reason: "Choose a starting point.", minutes: 5 },
    { title: "Sketch an outline", reason: "Build the idea.", minutes: 10 },
  ] }));
  const draft = await prepareDirectPlan("Try painting", state, false,
    (goal, current) => proposeLocalPlan(goal, current, call as unknown as typeof invoke));
  expect(JSON.parse(call.mock.calls[0][1].input).previousQuest).toBeUndefined();
  state = reduce(state, { type: "accept-direct-plan", ...draft,
    quest: { ...draft.quest, futureSteps: retainedPlanSteps(draft.steps, draft.quest.title) } });
  state = reduce(state, { type: "complete-quest", id: draft.quest.id });
  state = reduce(state, { type: "add-memory", memory: { id: "reflection", text: "The first step was fun", aiAllowed: false,
    questId: draft.quest.id, createdAt: "2026-11-23T00:00:00.000Z" } });
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  state = reduce(state, { type: "chat-follow-up", questId: draft.quest.id });
  const next = prepareSavedPlan(state);
  expect(next.quest.title).toBe("Sketch an outline");
  expect(next.memorySnapshot).toEqual([]);
  const saved = reduce(state, { type: "accept-planned-quest", ...next, consumesSavedPlan: true,
    savedPlanSnapshot: next.steps, quest: { ...next.quest, futureSteps: [] } });
  expect(saved.quests[1]).toMatchObject({ status: "accepted", priorQuestId: draft.quest.id });
  expect(saved.rewardedQuestIds).toEqual([draft.quest.id]);
  expect(reduce(saved, { type: "complete-quest", id: draft.quest.id }).rewardedQuestIds).toEqual([draft.quest.id]);
});

it("checks future durations, total effort and revoked sources before direct acceptance", async () => {
  const state = reduce(initialState(), { type: "adopt", name: "Pip" });
  const memory = { id: "m", text: "Small steps help", createdAt: "2026-11-23T00:00:00.000Z", aiAllowed: true };
  const allowed = reduce(state, { type: "add-memory", memory });
  const draft = await prepareDirectPlan("Try painting", allowed, false, fictionalPlan);
  const quest = { ...draft.quest, planner: "local" as const, sourceIds: [draft.commitment.id, "m"], futureSteps: [{ title: "Next", reason: "Continue", minutes: 20 }] };
  const action = { type: "accept-direct-plan" as const, commitment: { ...draft.commitment, effortMinutes: quest.minutes + 20 }, quest, memorySnapshot: [{ id: "m", text: memory.text }] };
  expect(reduce(allowed, action).quests[0].futureSteps).toEqual(quest.futureSteps);
  expect(() => reduce(reduce(allowed, { type: "memory-permission", id: "m", allowed: false }), action)).toThrow();
  expect(() => reduce(allowed, { ...action, commitment: { ...action.commitment, effortMinutes: 1 } })).toThrow("total effort");
  expect(() => reduce({ ...allowed, settings: { ...allowed.settings, questMinuteLimit: 10 } }, action)).toThrow();
});
