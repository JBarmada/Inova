import { expect, it } from "vitest";
import { deadlineFromLocal, formatDeadline } from "./commitmentDetails";
import { commitmentSchema, stateSchema } from "../../shared/schema";
import { initialState } from "../../state/defaults";
import { samplePlanner } from "../../services/planner";

it("records valid local deadlines with their original time zone and rejects impossible dates", () => {
  expect(deadlineFromLocal("")).toBeUndefined();
  const deadline = deadlineFromLocal("2026-12-01T13:45")!;
  const date = new Date(deadline.at);
  expect(date.getFullYear()).toBe(2026);
  expect(date.getMonth()).toBe(11);
  expect(date.getDate()).toBe(1);
  expect(date.getHours()).toBe(13);
  expect(date.getMinutes()).toBe(45);
  expect(formatDeadline(deadline)).toContain(deadline.timeZone);
  expect(() => deadlineFromLocal("2026-02-30T13:45")).toThrow();
  expect(() => deadlineFromLocal("bad input")).toThrow();
});

it("loads old commitments, validates supplied details, and does not invent a schedule", async () => {
  const base = { id: "c", title: "Fictional task", createdAt: "2026-11-23T00:00:00.000Z" };
  expect(stateSchema.parse({ ...initialState(), commitments: [base] }).commitments[0]).toEqual(base);
  expect(commitmentSchema.safeParse({ ...base, effortMinutes: 0 }).success).toBe(false);
  expect(commitmentSchema.safeParse({ ...base, deadline: { at: base.createdAt, timeZone: "invalid/timezone" } }).success).toBe(false);
  const result = await samplePlanner.propose({ ...base, effortMinutes: 4 }, initialState());
  expect(result.minutes).toBe(4);
  expect(result.title).toContain("4 minutes");
  expect(result.reason).toContain("No schedule");
});
