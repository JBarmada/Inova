import { expect, it } from "vitest";
import { bodyChangeInterruptsWalk } from "./walkInterruption";

it("interrupts a walk when switching to or from the separately timed bee renderer", () => {
  expect(bodyChangeInterruptsWalk(true, "bee", null)).toBe(true);
  expect(bodyChangeInterruptsWalk(true, null, "bee")).toBe(true);
  expect(bodyChangeInterruptsWalk(true, "bee", "bee")).toBe(false);
  expect(bodyChangeInterruptsWalk(false, "bee", null)).toBe(false);
});

