import { expect, it } from "vitest";
import { motionIsReduced } from "./useReducedMotion";

it("reduces motion if either the operating system or user setting asks for it", () => {
  expect(motionIsReduced(false, false)).toBe(false);
  expect(motionIsReduced(true, false)).toBe(true);
  expect(motionIsReduced(false, true)).toBe(true);
  expect(motionIsReduced(true, true)).toBe(true);
});
