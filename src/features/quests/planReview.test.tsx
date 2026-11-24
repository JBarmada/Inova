import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { proposeLocalPlan } from "../../services/localPlan";
import { prepareChatPlan } from "../../services/prepareChatPlan";
import { retainedPlanSteps } from "./retainedPlanSteps";
import { PlanPreview } from "./PlanPreview";
import { possibleRepeat, skipFirstPlanStep } from "./planReview";

it("flags wording overlap without claiming to detect semantic repetition", () => {
  expect(possibleRepeat("Draft three presentation points", "Review Draft Points")).toBe(true);
  expect(possibleRepeat("Draft three points", "Practice transitions")).toBe(false);
  expect(possibleRepeat(undefined, "Review Draft Points")).toBe(false);
});

it("lets a user skip a newly proposed step without accepting it or losing evidence", async () => {
  const commitment = { id: "c", title: "Prepare a presentation", createdAt: "2026-11-23T00:00:00.000Z" };
  const completed = { id: "q", commitmentId: "c", title: "Draft three presentation points", reason: "Start small", minutes: 5,
    sourceIds: ["c"], status: "completed" as const, planner: "sample" as const };
  const memory = { id: "m", text: "Transitions need practice", aiAllowed: true, questId: "q", createdAt: commitment.createdAt };
  const state = { ...initialState(), commitments: [commitment], quests: [completed], memories: [memory],
    chat: { ...initialState().chat, phase: "ready" as const, goal: commitment.title, contextQuestId: "q" } };
  const response = JSON.stringify({ explanation: "Build on your draft.", steps: [
    { title: "Review Draft Points", reason: "Review them.", minutes: 5 },
    { title: "Practice transitions", reason: "Try them aloud.", minutes: 5 },
    { title: "Rehearse delivery", reason: "Put it together.", minutes: 5 },
  ] });
  const call = vi.fn().mockResolvedValue(response);
  const draft = await prepareChatPlan(state.chat.goal, state, (goal, current) => proposeLocalPlan(goal, current, call as unknown as typeof invoke));
  const preview = renderToStaticMarkup(<PlanPreview draft={draft} onSkip={() => {}} />);
  expect(preview).toContain("Some words match your completed quest");
  expect(preview).toContain("Skip this step");
  const next = skipFirstPlanStep(draft);
  expect(state.quests).toHaveLength(1);
  expect(draft.steps).toHaveLength(3);
  expect(next.quest).toMatchObject({ title: "Practice transitions", reason: "Try them aloud.", sourceIds: draft.quest.sourceIds });
  expect(next.explanation).toBeUndefined();
  expect(() => reduce(reduce(state, { type: "memory-permission", id: "m", allowed: false }),
    { type: "accept-planned-quest", ...next })).toThrow();
  const accepted = reduce(state, { type: "accept-planned-quest", ...next,
    quest: { ...next.quest, futureSteps: retainedPlanSteps(next.steps, next.quest.title) } });
  expect(accepted.quests[1]).toMatchObject({ title: "Practice transitions", status: "accepted",
    futureSteps: [{ title: "Rehearse delivery", reason: "Put it together.", minutes: 5 }] });
  expect(() => skipFirstPlanStep({ ...next, steps: next.steps.slice(0, 1) })).toThrow();
  expect(renderToStaticMarkup(<PlanPreview draft={{ ...draft, usesSavedPlan: true }} onSkip={() => {}} />)).toContain("Skip this step");
});
