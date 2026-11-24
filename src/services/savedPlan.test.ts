import { expect, it } from "vitest";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { stateSchema } from "../shared/schema";
import { prepareSavedPlan } from "./savedPlan";

const steps = [{ title: "Outline", reason: "Start", minutes: 5 }, { title: "Draft", reason: "Build", minutes: 10 }, { title: "Review", reason: "Finish", minutes: 5 }];
const commitment = { id: "c", title: "Prepare a project", createdAt: "2026-11-23T00:00:00.000Z", effortMinutes: 20 };
const memory = { id: "m", text: "I like outlines", createdAt: commitment.createdAt, aiAllowed: true };

function acceptedPlan() {
  let state = reduce(initialState(), { type: "chat-goal", text: commitment.title });
  state = reduce(state, { type: "chat-skip" });
  state = reduce(state, { type: "add-memory", memory });
  return reduce(state, { type: "accept-planned-quest", commitment, memorySnapshot: [{ id: memory.id, text: memory.text }],
    quest: { ...steps[0], id: "q", commitmentId: "c", sourceIds: ["c", "m"], status: "proposed", planner: "local", futureSteps: steps.slice(1) } });
}

function followUp() {
  let state = stateSchema.parse(JSON.parse(JSON.stringify(acceptedPlan())));
  state = reduce(state, { type: "complete-quest", id: "q" });
  state = reduce(state, { type: "skip-chat-reflection", questId: "q" });
  return reduce(state, { type: "chat-follow-up", questId: "q" });
}

it("retains future suggestions through reload and accepts only the reviewed next step", () => {
  const state = followUp();
  expect(state.quests).toHaveLength(1);
  expect(state.quests[0].futureSteps).toEqual(steps.slice(1));
  const draft = prepareSavedPlan(state);
  expect(draft.details.effortMinutes).toBe(15);
  const accepted = reduce(state, { type: "accept-planned-quest", ...draft, consumesSavedPlan: true,
    quest: { ...draft.quest, futureSteps: draft.steps.slice(1) } });
  expect(accepted.quests).toHaveLength(2);
  expect(accepted.quests[1]).toMatchObject({ title: "Draft", status: "accepted", priorQuestId: "q", futureSteps: [steps[2]] });
  expect(accepted.quests[0].futureSteps).toBeUndefined();
  expect(accepted.rewardedQuestIds).toEqual(["q"]);
});

it("scrubs later suggestions when their memory is changed, revoked or deleted", () => {
  const state = followUp();
  const draft = prepareSavedPlan(state);
  const actions = [{ type: "edit-memory" as const, id: "m", text: "Changed" },
    { type: "memory-permission" as const, id: "m", allowed: false }, { type: "delete-memory" as const, id: "m" }];
  for (const action of actions) {
    const changed = reduce(state, action);
    expect(changed.quests[0].futureSteps).toBeUndefined();
    expect(() => reduce(changed, { type: "accept-planned-quest", ...draft, consumesSavedPlan: true,
      quest: { ...draft.quest, futureSteps: draft.steps.slice(1) } })).toThrow();
  }
});

it("rejects a reviewed total effort smaller than the full plan", () => {
  const state = followUp();
  const draft = prepareSavedPlan(state);
  expect(() => reduce(state, { type: "accept-planned-quest", ...draft, consumesSavedPlan: true,
    commitment: { ...draft.commitment, effortMinutes: 11 }, quest: { ...draft.quest, futureSteps: draft.steps.slice(1) } })).toThrow("total effort");
});
