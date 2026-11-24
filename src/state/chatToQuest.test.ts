import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema } from "../shared/schema";
import { prepareChatPlan } from "../services/prepareChatPlan";

it("turns a shared goal into an explicitly accepted quest and follow-up after restart", async () => {
  const text = "Prepare my astronomy presentation";
  let state = reduce(initialState(), { type: "chat-share", text });
  state = reduce(state, { type: "chat-plan-message", messageIndex: 0, originalText: text });
  expect(state.chat.goal).toBe(text);
  expect(state.chat.messages.filter((entry) => entry.role === "user")).toHaveLength(1);
  expect(state.quests).toEqual([]);
  state = reduce(state, { type: "chat-context", text: "I already have an outline" });
  const draft = await prepareChatPlan(state.chat.goal, state, async () => { throw Error("offline"); });
  expect(draft.fallback).toBe(true);
  expect(state.quests).toEqual([]);
  state = reduce(state, { type: "accept-planned-quest", ...draft });
  expect(state.quests[0].status).toBe("accepted");
  const id = state.quests[0].id;
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  state = reduce(state, { type: "complete-quest", id });
  state = reduce(state, { type: "skip-chat-reflection", questId: id });
  state = reduce(state, { type: "chat-follow-up", questId: id });
  expect(state.chat.contextQuestId).toBe(id);
  expect(state.rewardedQuestIds).toEqual([id]);
});

it("rejects stale, dog-authored, and interrupted requests without changing the current goal", () => {
  const state = reduce(initialState(), { type: "chat-share", text: "First goal" });
  const action = { type: "chat-plan-message" as const, messageIndex: 0, originalText: "First goal" };
  expect(() => reduce(reduce(state, { type: "chat-clear" }), action)).toThrow("conversation changed");
  const planning = reduce(state, action);
  expect(() => reduce(planning, action)).toThrow("start over");
  const reset = reduce(planning, { type: "chat-reset" });
  expect(() => reduce(reset, { ...action, messageIndex: 1, originalText: reset.chat.messages[1].text })).toThrow("conversation changed");
  expect(planning.quests).toEqual([]);
});
