import { describe, expect, it } from "vitest";
import { suggestedDetails } from "./suggestedDetails";

describe("model detail suggestions", () => {
  it("keeps valid details grounded in the original text", () => {
    expect(suggestedDetails("Write this by Friday at 5pm, about two hours", { deadlineLocal: "2026-11-27T17:00",
      deadlineEvidence: "Friday at 5pm", effortMinutes: 120, effortEvidence: "two hours" }))
      .toEqual({ deadlineLocal: "2026-11-27T17:00", effortMinutes: 120 });
  });
  it("does not invent a time for a date-only deadline", () => {
    expect(suggestedDetails("Write this by Friday", { deadlineLocal: "2026-11-27T17:00", deadlineEvidence: "Friday" })).toEqual({ deadlineDate: "2026-11-27" });
  });
  it("accepts only valid date suggestions with evidence in the entry", () => {
    expect(suggestedDetails("Write by Friday", { deadlineDate: "2026-11-27", deadlineEvidence: "Friday" }))
      .toEqual({ deadlineDate: "2026-11-27" });
    expect(suggestedDetails("Write this", { deadlineDate: "2026-11-27", deadlineEvidence: "Friday" })).toEqual({});
    expect(suggestedDetails("Write by Friday", { deadlineDate: "2026-02-30", deadlineEvidence: "Friday" })).toEqual({});
  });
  it("drops unsupported and invalid details", () => {
    expect(suggestedDetails("Write this by Friday", { deadlineLocal: "2026-02-30T17:00", deadlineEvidence: "Friday",
      effortMinutes: 60, effortEvidence: "one hour" })).toEqual({});
  });
});

it("drops recognizable model errors rather than showing conflicting details", () => {
  expect(suggestedDetails("Write by Friday at 5pm, about two hours", { deadlineLocal: "2026-11-29T17:00",
    deadlineDate: "2026-11-29", deadlineEvidence: "Friday at 5pm", effortMinutes: 2, effortEvidence: "two hours" })).toEqual({});
});

it("rejects dates that conflict with explicit numeric or named calendar dates", () => {
  for (const evidence of ["2026-11-27", "11/27/2026", "11/27/26", "November 27, 2026", "11/27", "November 27th"]) {
    expect(suggestedDetails(`Finish by ${evidence}`, { deadlineDate: "2026-11-27", deadlineEvidence: evidence })).toEqual({ deadlineDate: "2026-11-27" });
    expect(suggestedDetails(`Finish by ${evidence}`, { deadlineDate: "2026-11-28", deadlineEvidence: evidence })).toEqual({});
  }
  expect(suggestedDetails("Finish by November 27, 2026", { deadlineDate: "2027-11-27", deadlineEvidence: "November 27, 2026" })).toEqual({});
  expect(suggestedDetails("Finish by 11/27/2026", { deadlineDate: "2027-11-27", deadlineEvidence: "11/27/2026" })).toEqual({});
  expect(suggestedDetails("Finish by 11/27/26", { deadlineDate: "2027-11-27", deadlineEvidence: "11/27/26" })).toEqual({});
});

it("checks relative dates against the clock supplied to the model", () => {
  const cases = [
    { evidence: "today", now: "2026-12-31T23:59:00", expected: "2026-12-31", wrong: "2027-01-01" },
    { evidence: "tomorrow", now: "2026-12-31T23:59:00", expected: "2027-01-01", wrong: "2026-12-31" },
    { evidence: "day after tomorrow", now: "2028-02-28T09:00:00", expected: "2028-03-01", wrong: "2028-02-29" },
    { evidence: "tonight at 5pm", now: "2026-03-08T01:30:00", expected: "2026-03-08", wrong: "2026-03-09" },
  ];
  for (const { evidence, now, expected, wrong } of cases) {
    expect(suggestedDetails(`Finish ${evidence}`, { deadlineDate: expected, deadlineEvidence: evidence }, now)).toEqual({ deadlineDate: expected });
    expect(suggestedDetails(`Finish ${evidence}`, { deadlineDate: wrong, deadlineEvidence: evidence }, now)).toEqual({});
    expect(suggestedDetails(`Finish ${evidence}`, { deadlineDate: expected, deadlineEvidence: evidence })).toEqual({});
  }
  expect(suggestedDetails("Finish today or tomorrow", { deadlineDate: "2026-12-31", deadlineEvidence: "today or tomorrow" }, "2026-12-31T10:00:00")).toEqual({});
  expect(suggestedDetails("Finish the day after tomorrow", { deadlineDate: "2027-01-01", deadlineEvidence: "tomorrow" }, "2026-12-31T10:00:00")).toEqual({});
  expect(suggestedDetails("It is not due tomorrow", { deadlineDate: "2027-01-01", deadlineEvidence: "tomorrow" }, "2026-12-31T10:00:00")).toEqual({});
});
