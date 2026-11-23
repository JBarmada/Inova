import { expect, it } from "vitest";
import { detailsMayBeMissing } from "./detailsMayBeMissing";

it("requests review when recognizable details were not extracted", () => {
  expect(detailsMayBeMissing("Write by Friday for two hours", {})).toBe(true);
  expect(detailsMayBeMissing("Write by Friday for two hours", { deadlineDate: "2026-11-27", effortMinutes: 120 })).toBe(false);
  expect(detailsMayBeMissing("I may paint", {})).toBe(false);
  expect(detailsMayBeMissing("Finish by 5pm", {})).toBe(true);
  expect(detailsMayBeMissing("Start painting", {})).toBe(false);
});
