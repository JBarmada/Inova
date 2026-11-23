import { describe, expect, it } from "vitest";
import { suggestedDetails } from "./suggestedDetails";

describe("model detail suggestions", () => {
  it("keeps valid details grounded in the original text", () => {
    expect(suggestedDetails("Write this by Friday, about two hours", { deadlineLocal: "2026-11-27T17:00",
      deadlineEvidence: "Friday", effortMinutes: 120, effortEvidence: "two hours" }))
      .toEqual({ deadlineLocal: "2026-11-27T17:00", effortMinutes: 120 });
  });
  it("drops unsupported and invalid details", () => {
    expect(suggestedDetails("Write this by Friday", { deadlineLocal: "2026-02-30T17:00", deadlineEvidence: "Friday",
      effortMinutes: 60, effortEvidence: "one hour" })).toEqual({});
  });
});
