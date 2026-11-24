import { expect, it } from "vitest";
import { initialState } from "../../state/defaults";
import { prepareQuest } from "../../services/prepareQuest";
import { dateOnlyDeadline, reviewQuestDetails } from "./reviewQuestDetails";
import { retainedPlanSteps } from "./retainedPlanSteps";

it("fits the quest into reviewed total effort without changing the original draft", async () => {
  const draft = await prepareQuest("Write a fictional outline", initialState(), async () => { throw Error("offline"); });
  const reviewed = reviewQuestDetails(draft, "", "1");
  expect(reviewed.commitment.effortMinutes).toBe(1);
  expect(reviewed.quest.minutes).toBe(1);
  expect(draft.commitment.effortMinutes).toBeUndefined();
  expect(() => reviewQuestDetails(draft, "", "0")).toThrow("total effort");
});

it("never assigns an invented time to a date-only deadline", () => {
  expect(() => dateOnlyDeadline("2026-11-27", "")).toThrow("Add a deadline time");
  expect(dateOnlyDeadline("", "")).toBe("");
  expect(dateOnlyDeadline("2026-11-27", "17:00")).toBe("2026-11-27T17:00");
});

it("lets the user edit the first quest without retaining an outdated reason or plan", async () => {
  const draft = await prepareQuest("Write an outline", initialState(), async () => { throw Error("offline"); });
  const reviewed = reviewQuestDetails(draft, "", "30", { title: "  Gather sources  ", minutes: "10" });
  expect(reviewed.quest).toMatchObject({ title: "Gather sources", minutes: 10, reason: "You edited this quest before accepting it." });
  const steps = [{ title: draft.quest.title, reason: draft.quest.reason, minutes: draft.quest.minutes }, { title: "Draft", reason: "Next", minutes: 10 }];
  expect(retainedPlanSteps(steps, reviewed.quest.title)).toEqual([]);
  expect(retainedPlanSteps(steps, draft.quest.title)).toEqual([steps[1]]);
  expect(() => reviewQuestDetails(draft, "", "", { title: " ", minutes: "5" })).toThrow("quest title");
  expect(() => reviewQuestDetails(draft, "", "5", { title: "Draft", minutes: "8" })).toThrow("cannot exceed total effort");
  expect(() => reviewQuestDetails(draft, "", "", { title: "Draft", minutes: "121" })).toThrow("1–120");
});

it("allows an existing sample title longer than the source goal", async () => {
  const draft = await prepareQuest("a".repeat(240), initialState(), async () => { throw Error("offline"); });
  expect(draft.quest.title.length).toBeGreaterThan(240);
  expect(reviewQuestDetails(draft, "", "", { title: draft.quest.title, minutes: String(draft.quest.minutes) }).quest.title).toBe(draft.quest.title);
});
