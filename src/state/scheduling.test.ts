import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema, type Quest } from "../shared/schema";

const quest: Quest = { id: "q", commitmentId: "c", title: "A step", reason: "Start", minutes: 10,
  sourceIds: ["c"], status: "accepted", planner: "sample" };
const state = { ...initialState(), commitments: [{ id: "c", title: "Task", createdAt: "2026-11-23T00:00:00.000Z",
  deadline: { at: "2026-11-24T15:00:00.000Z", timeZone: "UTC" } }], quests: [quest] };
const request = { start: "2026-11-24T14:00:00.000Z", availableUntil: "2026-11-24T14:30:00.000Z",
  recordedAt: "2026-11-23T00:00:00.000Z", timeZone: "UTC" };

it("plans an accepted quest inside the supplied window and retains it across save parsing", () => {
  const result = reduce(state, { type: "plan-quest", id: "q", request });
  expect(result.quests[0].plan?.end).toBe("2026-11-24T14:10:00.000Z");
  expect(stateSchema.parse(JSON.parse(JSON.stringify(result))).quests[0].plan).toEqual(result.quests[0].plan);
  expect(reduce(result, { type: "clear-quest-plan", id: "q" }).quests[0].plan).toBeUndefined();
});

it("rejects missing acceptance, past starts, short windows, and deadline violations", () => {
  expect(() => reduce({ ...state, quests: [{ ...quest, status: "proposed" }] }, { type: "plan-quest", id: "q", request })).toThrow("Accept");
  expect(() => reduce(state, { type: "plan-quest", id: "q", request: { ...request, recordedAt: "2026-11-24T14:01:00.000Z" } })).toThrow("future");
  expect(() => reduce(state, { type: "plan-quest", id: "q", request: { ...request, availableUntil: "2026-11-24T14:09:00.000Z" } })).toThrow("free window");
  expect(() => reduce(state, { type: "plan-quest", id: "q", request: { ...request, start: "2026-11-24T14:55:00.000Z", availableUntil: "2026-11-24T16:00:00.000Z" } })).toThrow("deadline");
});

it("rejects overlapping accepted quest plans but permits adjacent times", () => {
  const planned = reduce(state, { type: "plan-quest", id: "q", request });
  const withOther = { ...planned, quests: [...planned.quests, { ...quest, id: "other" }] };
  expect(() => reduce(withOther, { type: "plan-quest", id: "other", request })).toThrow("overlaps");
  expect(reduce(withOther, { type: "plan-quest", id: "other", request: { ...request, start: "2026-11-24T14:10:00.000Z" } }).quests[1].plan).toBeDefined();
});

it("clears plans when duration changes or a quest is deferred and rejects corrupt saved durations", () => {
  const planned = reduce(state, { type: "plan-quest", id: "q", request });
  expect(reduce(planned, { type: "edit-quest", id: "q", title: "A step", minutes: 20 }).quests[0].plan).toBeUndefined();
  expect(reduce(planned, { type: "quest-status", id: "q", status: "deferred" }).quests[0].plan).toBeUndefined();
  expect(stateSchema.safeParse({ ...planned, quests: [{ ...planned.quests[0], minutes: 20 }] }).success).toBe(false);
});
