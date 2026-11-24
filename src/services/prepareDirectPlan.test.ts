import { expect, it } from "vitest";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { prepareDirectPlan } from "./prepareDirectPlan";

it("accepts a direct sample plan atomically without changing an ongoing chat", async () => {
  let state = reduce(initialState(), { type: "adopt", name: "Pip" });
  state = reduce(state, { type: "chat-goal", text: "Another goal" });
  const draft = await prepareDirectPlan("Try painting", state, true);
  expect(draft.fallback).toBe(true);
  expect(state.quests).toHaveLength(0);
  const action = { type: "accept-direct-plan" as const, ...draft };
  const saved = reduce(state, action);
  expect(saved.quests[0]).toMatchObject({ status: "accepted", planner: "sample" });
  expect(saved.chat).toEqual(state.chat);
  expect(() => reduce(saved, action)).toThrow();
  expect(() => reduce(initialState(), action)).toThrow("cannot be accepted");
});

it("checks future durations, total effort and revoked sources before direct acceptance", async () => {
  const state = reduce(initialState(), { type: "adopt", name: "Pip" });
  const memory = { id: "m", text: "Small steps help", createdAt: "2026-11-23T00:00:00.000Z", aiAllowed: true };
  const allowed = reduce(state, { type: "add-memory", memory });
  const draft = await prepareDirectPlan("Try painting", allowed, true);
  const quest = { ...draft.quest, planner: "local" as const, sourceIds: [draft.commitment.id, "m"], futureSteps: [{ title: "Next", reason: "Continue", minutes: 20 }] };
  const action = { type: "accept-direct-plan" as const, commitment: { ...draft.commitment, effortMinutes: quest.minutes + 20 }, quest, memorySnapshot: [{ id: "m", text: memory.text }] };
  expect(reduce(allowed, action).quests[0].futureSteps).toEqual(quest.futureSteps);
  expect(() => reduce(reduce(allowed, { type: "memory-permission", id: "m", allowed: false }), action)).toThrow();
  expect(() => reduce(allowed, { ...action, commitment: { ...action.commitment, effortMinutes: 1 } })).toThrow("total effort");
  expect(() => reduce({ ...allowed, settings: { ...allowed.settings, questMinuteLimit: 10 } }, action)).toThrow();
});
