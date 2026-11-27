import { fictionalPlan } from "../services/planFixture";
import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema } from "../shared/schema";
import { prepareChatPlan } from "../services/prepareChatPlan";
import { reviewQuestDetails } from "../features/quests/reviewQuestDetails";

it("turns a shared goal into an explicitly accepted quest and follow-up after restart", async () => {
  const text = "Prepare my astronomy presentation";
  let state = reduce(initialState(), { type: "chat-share", text });
  state = reduce(state, { type: "chat-plan-message", messageIndex: 0, originalText: text });
  expect(state.chat.goal).toBe(text);
  expect(state.chat.messages.filter((entry) => entry.role === "user")).toHaveLength(1);
  expect(state.quests).toEqual([]);
  state = reduce(state, { type: "chat-context", text: "I already have an outline" });
  state = reduce(state, { type: "chat-context", text: "Friday" });
  const draft = await prepareChatPlan(state.chat.goal, state, fictionalPlan);
  expect(draft.fallback).toBe(false);
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

it("keeps an edited draft unsaved until the user accepts it", async () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Prepare my presentation" });
  state = reduce(state, { type: "chat-skip" });
  const draft = await prepareChatPlan(state.chat.goal, state, fictionalPlan);
  const reviewed = reviewQuestDetails(draft, "", "", { title: "Gather my slides", minutes: "5" });
  expect(state.quests).toEqual([]);
  const accepted = reduce(state, { type: "accept-planned-quest", ...reviewed, memorySnapshot: draft.memorySnapshot });
  expect(accepted.quests[0]).toMatchObject({ title: "Gather my slides", minutes: 5, status: "accepted", reason: "You edited this quest before accepting it." });
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

it("offers planning without making a quest and honors explicit decline or acceptance", () => {
  const text = "I need to prepare for my astronomy presentation";
  const shared = reduce(initialState(), { type: "chat-share", text });
  const offered = reduce(shared, { type: "chat-reply", messageIndex: 0, originalText: text,
    reply: "We can work on that together.", memorySnapshot: [], offerQuest: true });
  expect(offered.quests).toEqual([]);
  expect(offered.chat.messages[1].questSuggestion).toEqual({ sourceIndex: 0 });
  const dismissed = reduce(offered, { type: "dismiss-quest-suggestion", replyIndex: 1, sourceIndex: 0 });
  expect(dismissed.chat.messages[1].questSuggestion).toBeUndefined();
  expect(dismissed.quests).toEqual([]);
  expect(() => reduce(dismissed, { type: "chat-plan-message", messageIndex: 0, originalText: text, suggestionReplyIndex: 1 })).toThrow("no longer available");
  const planned = reduce(offered, { type: "chat-plan-message", messageIndex: 0, originalText: text, suggestionReplyIndex: 1 });
  expect(planned.chat).toMatchObject({ phase: "context", goal: text });
  expect(planned.chat.messages[1].questSuggestion).toBeUndefined();
  expect(planned.quests).toEqual([]);
});
