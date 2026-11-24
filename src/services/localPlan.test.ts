import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { proposeLocalPlan } from "./localPlan";
import { prepareChatPlan } from "./prepareChatPlan";

const commitment = { id: "c", title: "Prepare a presentation", createdAt: "2026-11-23T00:00:00.000Z" };
const response = { explanation: "Start with structure, then rehearse.", steps: [
  { title: "Draft three points", reason: "A structure makes the rest easier.", minutes: 10 },
  { title: "Rehearse once", reason: "Try the structure aloud.", minutes: 5 },
], deadlineLocal: "", deadlineDate: "", deadlineEvidence: "", effortMinutes: 0, effortEvidence: "" };

it("validates a multi-step plan while sending only allowed memories", async () => {
  const state = initialState();
  state.memories = [{ id: "m", text: "Short sessions help", aiAllowed: true, createdAt: commitment.createdAt },
    { id: "private", text: "Do not send", aiAllowed: false, createdAt: commitment.createdAt }];
  const call = vi.fn().mockResolvedValue(JSON.stringify(response));
  const plan = await proposeLocalPlan(commitment, state, call as unknown as typeof invoke);
  expect(plan.steps).toHaveLength(2);
  expect(plan.quest).toMatchObject({ title: response.steps[0].title, status: "proposed", sourceIds: ["c", "m"] });
  expect(JSON.stringify(call.mock.calls[0][1])).not.toContain("Do not send");
  expect(call.mock.calls[0][0]).toBe("local_quest_plan");
});

it("rejects invalid or oversized plans and steps that exceed limits", async () => {
  const state = initialState();
  state.settings.questMinuteLimit = 5;
  for (const body of ["invalid", JSON.stringify({ ...response, steps: [] }),
    JSON.stringify({ ...response, steps: [...response.steps, ...response.steps] }), JSON.stringify(response)]) {
    const call = vi.fn().mockResolvedValue(body);
    await expect(proposeLocalPlan(commitment, state, call as unknown as typeof invoke)).rejects.toThrow();
  }
});

it("rejects a plan whose combined steps exceed the explicit total effort", async () => {
  const call = vi.fn().mockResolvedValue(JSON.stringify(response));
  await expect(proposeLocalPlan({ ...commitment, effortMinutes: 12 }, initialState(), call as unknown as typeof invoke))
    .rejects.toThrow("total effort");
});

it("falls back to a labeled sample and never saves preview steps automatically", async () => {
  let state = reduce(initialState(), { type: "chat-goal", text: commitment.title });
  state = reduce(state, { type: "chat-skip" });
  const draft = await prepareChatPlan(state.chat.goal, state, async () => { throw Error("offline"); });
  expect(draft.fallback).toBe(true);
  expect(draft.steps).toHaveLength(1);
  expect(state.quests).toHaveLength(0);
  const saved = reduce(state, { type: "accept-planned-quest", ...draft });
  expect(saved.quests).toHaveLength(1);
  expect(saved.quests[0]).toMatchObject({ status: "accepted", planner: "sample" });
});

it("checks a relative date against the exact local clock sent to the model", async () => {
  const call = vi.fn(async (_command, args) => {
    const localDate = JSON.parse(args.input).localNow.slice(0, 10);
    const [year, month, day] = localDate.split("-").map(Number);
    const wrong = new Date(Date.UTC(year, month - 1, day + 2)).toISOString().slice(0, 10);
    return JSON.stringify({ ...response, deadlineDate: wrong, deadlineEvidence: "tomorrow" });
  });
  const plan = await proposeLocalPlan({ ...commitment, title: "Prepare my presentation tomorrow" }, initialState(), call as unknown as typeof invoke);
  expect(plan.details.deadlineDate).toBeUndefined();
  expect(plan.detailsWarning).toBe(true);
});
