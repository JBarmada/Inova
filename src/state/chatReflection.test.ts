import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema, type Quest } from "../shared/schema";

const quest: Quest = { id: "q", commitmentId: "c", title: "Practice drawing", reason: "Start small",
  minutes: 10, sourceIds: ["c"], status: "accepted", planner: "sample" };
const memory = { id: "m", text: "Sketching felt good", createdAt: "2026-11-23T00:00:00.000Z", aiAllowed: false, questId: "q" };

it("queues one reflection on completion, survives reload, and saves a private linked entry", () => {
  const state = { ...initialState(), quests: [quest] };
  let completed = reduce(state, { type: "complete-quest", id: "q" });
  completed = reduce(completed, { type: "complete-quest", id: "q" });
  expect(completed.rewardedQuestIds).toEqual(["q"]);
  expect(completed.chat.pendingReflections).toEqual(["q"]);
  completed = stateSchema.parse(JSON.parse(JSON.stringify(completed)));
  const saved = reduce(completed, { type: "add-memory", memory });
  expect(saved.memories).toEqual([memory]);
  expect(saved.chat.pendingReflections).toEqual([]);
  expect(JSON.stringify(saved.chat)).not.toContain(memory.text);
  expect(reduce(saved, { type: "delete-memory", id: memory.id }).memories).toEqual([]);
});

it("supports skipping and removes prompts when the existing quest reflection form saves", () => {
  const completed = reduce({ ...initialState(), quests: [quest] }, { type: "complete-quest", id: "q" });
  expect(reduce(completed, { type: "skip-chat-reflection", questId: "q" }).chat.pendingReflections).toEqual([]);
  expect(reduce(completed, { type: "add-memory", memory }).chat.pendingReflections).toEqual([]);
  expect(reduce(completed, { type: "chat-clear" }).chat.pendingReflections).toEqual(["q"]);
});

it("loads old conversation records without a pending-reflection list", () => {
  const state = initialState();
  const { pendingReflections: _, ...oldChat } = state.chat;
  expect(stateSchema.parse({ ...state, chat: oldChat }).chat.pendingReflections).toEqual([]);
});
