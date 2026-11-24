import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { proposeLocalPlan } from "./localPlan";
import { prepareChatPlan } from "./prepareChatPlan";
import type { Quest } from "../shared/schema";

const commitment = { id: "c", title: "Prepare a presentation", createdAt: "2026-11-23T00:00:00.000Z" };
const quest: Quest = { id: "q", commitmentId: "c", title: "Draft three points", reason: "Start small", minutes: 10,
  sourceIds: ["c"], status: "accepted", planner: "sample" };
const response = JSON.stringify({ explanation: "Build on the completed step.", steps: [{ title: "Rehearse once", reason: "Try the points aloud.", minutes: 5 }] });

it("plans from the completed quest and only an explicitly permitted linked reflection", async () => {
  let state = reduce({ ...initialState(), commitments: [commitment], quests: [quest] }, { type: "complete-quest", id: quest.id });
  state = reduce(state, { type: "add-memory", memory: { id: "m", text: "Speaking aloud helped", aiAllowed: true, questId: "q", createdAt: commitment.createdAt } });
  state = reduce(state, { type: "chat-follow-up", questId: "q" });
  const call = vi.fn().mockResolvedValue(response);
  const draft = await prepareChatPlan(state.chat.goal, state, (goal, current) => proposeLocalPlan(goal, current, call as unknown as typeof invoke));
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.previousQuest).toEqual({ id: "q", title: "Draft three points" });
  expect(input.reflections).toEqual([{ id: "m", text: "Speaking aloud helped" }]);
  expect(draft.quest.sourceIds).toContain("m");
  const revoked = reduce(state, { type: "memory-permission", id: "m", allowed: false });
  expect(() => reduce(revoked, { type: "accept-planned-quest", ...draft })).toThrow("changed");
  const saved = reduce(state, { type: "accept-planned-quest", ...draft });
  expect(saved.quests[1]).toMatchObject({ title: "Rehearse once", status: "accepted", priorQuestId: "q" });
  expect(saved.chat.contextQuestId).toBeUndefined();
});

it("does not send a private reflection or a prior title dependent on memory", async () => {
  const memory = { id: "m", text: "Sensitive detail", aiAllowed: false, questId: "q", createdAt: commitment.createdAt };
  const state = { ...initialState(), commitments: [commitment], memories: [memory],
    quests: [{ ...quest, status: "completed" as const, title: "Sensitive detail", sourceIds: ["c", "m"] }],
    chat: { ...initialState().chat, phase: "ready" as const, goal: commitment.title, contextQuestId: "q" } };
  const call = vi.fn().mockResolvedValue(response);
  await proposeLocalPlan(commitment, state, call as unknown as typeof invoke);
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.previousQuest).toEqual({ id: "q" });
  expect(JSON.stringify(input)).not.toContain("Sensitive detail");
});

it("shares an earlier title only with all permitted supporting memories tracked", async () => {
  const support = { id: "support", text: "Short outlines help", aiAllowed: true, createdAt: commitment.createdAt };
  const extra = ["a", "b", "c"].map((id) => ({ ...support, id, text: `Unrelated ${id}` }));
  const prior = { ...quest, status: "completed" as const, sourceIds: ["c", "support"] };
  const state = { ...initialState(), commitments: [commitment], memories: [support, ...extra], quests: [prior],
    chat: { ...initialState().chat, phase: "ready" as const, goal: commitment.title, contextQuestId: "q" } };
  const call = vi.fn().mockResolvedValue(response);
  const draft = await prepareChatPlan(state.chat.goal, state, (goal, current) => proposeLocalPlan(goal, current, call as unknown as typeof invoke));
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.previousQuest).toEqual({ id: "q", title: "Draft three points" });
  expect(input.reflections).toContainEqual({ id: "support", text: support.text });
  expect(draft.quest.sourceIds).toContain("support");
  expect(() => reduce(state, { type: "accept-planned-quest", ...draft, memorySnapshot: draft.memorySnapshot.filter((entry) => entry.id !== "support") })).toThrow("evidence changed");
  expect(() => reduce(reduce(state, { type: "memory-permission", id: "support", allowed: false }), { type: "accept-planned-quest", ...draft })).toThrow();
  expect(reduce(state, { type: "accept-planned-quest", ...draft }).quests[1].status).toBe("accepted");
});

it("omits a prior title when its dependencies exceed the context limit", async () => {
  const memories = ["a", "b", "d", "e"].map((id) => ({ id, text: `Fact ${id}`, aiAllowed: true, createdAt: commitment.createdAt }));
  const state = { ...initialState(), commitments: [commitment], memories,
    quests: [{ ...quest, status: "completed" as const, sourceIds: ["c", ...memories.map((entry) => entry.id)] }],
    chat: { ...initialState().chat, phase: "ready" as const, goal: commitment.title, contextQuestId: "q" } };
  const call = vi.fn().mockResolvedValue(response);
  await proposeLocalPlan(commitment, state, call as unknown as typeof invoke);
  expect(JSON.parse(call.mock.calls[0][1].input).previousQuest).toEqual({ id: "q" });
});

it("labels a fallback continuation without copying reflection context", async () => {
  let state = reduce({ ...initialState(), commitments: [commitment], quests: [quest] }, { type: "complete-quest", id: "q" });
  state = reduce(state, { type: "skip-chat-reflection", questId: "q" });
  state = reduce(state, { type: "chat-follow-up", questId: "q" });
  const draft = await prepareChatPlan(state.chat.goal, state, async () => { throw Error("offline"); });
  expect(draft.fallback).toBe(true);
  expect(draft.quest.title).toContain("continuing");
  expect(draft.quest.reason).toContain("Sample planner");
  expect(draft.memorySnapshot).toEqual([]);
  expect(reduce(state, { type: "accept-planned-quest", ...draft }).quests).toHaveLength(2);
});
