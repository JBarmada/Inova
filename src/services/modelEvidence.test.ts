import { expect, it } from "vitest";
import { plausibleDate, plausibleEffort, plausibleTime } from "./modelEvidence";

it("rejects a weekday that conflicts with the suggested date", () => {
  expect(plausibleDate("2026-11-27", "Friday at 5pm")).toBe(true);
  expect(plausibleDate("2026-11-29", "Friday at 5pm")).toBe(false);
});
it("checks recognizable effort quantities and leaves ambiguous wording for review", () => {
  expect(plausibleEffort(120, "about two hours")).toBe(true);
  expect(plausibleEffort(2, "about two hours")).toBe(false);
  expect(plausibleEffort(90, "one hour and 30 minutes")).toBe(true);
  expect(plausibleEffort(30, "a short while")).toBe(true);
});

it("checks recognizable explicit clock times", () => {
  expect(plausibleTime("2026-11-27T17:00", "Friday at 5pm")).toBe(true);
  expect(plausibleTime("2026-11-27T18:00", "Friday at 5pm")).toBe(false);
  expect(plausibleTime("2026-11-27T00:30", "12:30am")).toBe(true);
  expect(plausibleTime("2026-11-27T18:00", "Friday at 17:00")).toBe(false);
});
