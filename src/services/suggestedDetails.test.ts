import { describe, expect, it } from "vitest";
import { suggestedDetails } from "./suggestedDetails";

describe("model detail suggestions", () => {
  it("keeps valid details grounded in the original text", () => {
    expect(suggestedDetails("Write this by Friday at 5pm, about two hours", { deadlineLocal: "2026-11-27T17:00",
      deadlineEvidence: "Friday at 5pm", effortMinutes: 120, effortEvidence: "two hours" }))
      .toEqual({ deadlineLocal: "2026-11-27T17:00", effortMinutes: 120 });
  });
  it("does not invent a time for a date-only deadline", () => {
    expect(suggestedDetails("Write this by Friday", { deadlineLocal: "2026-11-27T17:00", deadlineEvidence: "Friday" })).toEqual({});
  });
  it("drops unsupported and invalid details", () => {
    expect(suggestedDetails("Write this by Friday", { deadlineLocal: "2026-02-30T17:00", deadlineEvidence: "Friday",
      effortMinutes: 60, effortEvidence: "one hour" })).toEqual({});
  });
});
