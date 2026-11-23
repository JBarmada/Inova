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
