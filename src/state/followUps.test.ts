import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { followUpIds } from "./followUps";
import { stateSchema } from "../shared/schema";
import { prepareChatPlan } from "../services/prepareChatPlan";

function completedQuests() {
  let state = initialState();
  for (const id of ["one", "two"]) {
    state = reduce(state, { type: "add-commitment", commitment: { id: `c-${id}`, title: `Goal ${id}`, createdAt: "2026-11-23T00:00:00.000Z" } });
    state = reduce(state, { type: "propose-quest", quest: { id, commitmentId: `c-${id}`, title: `Quest ${id}`, reason: "Start", minutes: 5, status: "proposed", planner: "sample", sourceIds: [`c-${id}`] } });
    state = reduce(state, { type: "quest-status", id, status: "accepted" });
    state = reduce(state, { type: "complete-quest", id });
  }
  return state;
}

it("retains multiple follow-ups across restart, abandoning a plan, and accepting another", async () => {
  let state = completedQuests();
  state = reduce(state, { type: "skip-chat-reflection", questId: "one" });
  state = reduce(state, { type: "skip-chat-reflection", questId: "two" });
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  expect(followUpIds(state.chat)).toEqual(["one", "two"]);
  expect(followUpIds(reduce(state, { type: "chat-clear" }).chat)).toEqual(["one", "two"]);
  state = reduce(state, { type: "chat-follow-up", questId: "one" });
  state = reduce(state, { type: "chat-reset" });
  expect(followUpIds(state.chat)).toEqual(["one", "two"]);
  state = reduce(state, { type: "chat-follow-up", questId: "two" });
  const draft = await prepareChatPlan(state.chat.goal, state, async () => { throw Error("offline"); });
  state = reduce(state, { type: "accept-planned-quest", ...draft });
  expect(state.quests.at(-1)?.priorQuestId).toBe("two");
  expect(followUpIds(state.chat)).toEqual(["one"]);
  expect(state.rewardedQuestIds).toEqual(["one", "two"]);
  expect(() => reduce(state, { type: "chat-follow-up", questId: "two" })).toThrow("no longer available");
  expect(reduce(state, { type: "chat-follow-up", questId: "one" }).chat.contextQuestId).toBe("one");
});

it("retains a legacy single follow-up and does not duplicate repeated reflection actions", () => {
  let state = completedQuests();
  state = reduce(state, { type: "skip-chat-reflection", questId: "one" });
  state = reduce(state, { type: "skip-chat-reflection", questId: "one" });
  expect(followUpIds(state.chat)).toEqual(["one"]);
  const legacy = { ...state, chat: { ...state.chat, followUpQuestIds: undefined, followUpQuestId: "one" } };
  expect(reduce(stateSchema.parse(legacy), { type: "chat-follow-up", questId: "one" }).chat.contextQuestId).toBe("one");
});
