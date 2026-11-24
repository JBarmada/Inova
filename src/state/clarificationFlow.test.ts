import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { stateSchema } from "../shared/schema";
import { prepareChatPlan } from "../services/prepareChatPlan";
import { proposeLocalPlan } from "../services/localPlan";
import { reviewQuestDetails } from "../features/quests/reviewQuestDetails";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

it("asks for remaining context once, survives reload, then moves to planning", () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Prepare a presentation" });
  state = reduce(state, { type: "chat-context", text: "Friday" });
  expect(state.chat.phase).toBe("context");
  expect(state.chat.messages.at(-1)?.text).toContain("What have you already done?");
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  state = reduce(state, { type: "chat-context", text: "I have an outline" });
  expect(state.chat.phase).toBe("ready");
  expect(state.chat.goal).toContain("Friday");
  expect(state.chat.goal).toContain("I have an outline");
  expect(state.quests).toEqual([]);
});

it("sends both clarification answers to planning and preserves a reviewed deadline", async () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Prepare a presentation" });
  state = reduce(state, { type: "chat-context", text: "Friday at 5pm" });
  state = reduce(state, { type: "chat-context", text: "I have an outline" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ explanation: "Build from your outline.", steps: [
    { title: "Draft the opening", reason: "Start from the outline.", minutes: 5 }],
    deadlineLocal: "2026-11-27T17:00", deadlineEvidence: "Friday at 5pm" }));
  const draft = await prepareChatPlan(state.chat.goal, state, (goal, current) => proposeLocalPlan(goal, current, call as unknown as typeof invoke));
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.commitment.title).toContain("Friday at 5pm");
  expect(input.commitment.title).toContain("I have an outline");
  expect(draft.details?.deadlineLocal).toBe("2026-11-27T17:00");
  const reviewed = reviewQuestDetails(draft, draft.details!.deadlineLocal!, "");
  const saved = reduce(state, { type: "accept-planned-quest", ...draft, ...reviewed });
  expect(saved.commitments[0].deadline?.at).toBe(new Date("2026-11-27T17:00").toISOString());
});

it("allows skipping the extra question and does not loop on unclear answers", () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Prepare a presentation" });
  state = reduce(state, { type: "chat-context", text: "I haven't started" });
  expect(state.chat.messages.at(-1)?.text).toContain("When is it due");
  expect(reduce(state, { type: "chat-skip" }).chat.phase).toBe("ready");
  expect(reduce(state, { type: "chat-context", text: "Not sure" }).chat.phase).toBe("ready");
  const unclear = reduce(reduce(initialState(), { type: "chat-goal", text: "Prepare a presentation" }), { type: "chat-context", text: "Maybe soon" });
  expect(unclear.chat.phase).toBe("ready");
});
