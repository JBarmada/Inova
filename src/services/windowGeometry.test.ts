import { expect, it } from "vitest";
import { visiblePosition } from "./windowGeometry";

const bounds = { x: 100, y: 80, width: 1040, height: 780, maximized: false };
const screens = [
  { position: { x: 0, y: 0 }, size: { width: 1920, height: 1040 } },
  { position: { x: -1280, y: 0 }, size: { width: 1280, height: 1000 } },
];

it("keeps a remembered position on a negative-coordinate monitor", () => {
  expect(visiblePosition({ ...bounds, x: -1000 }, { width: 248, height: 208 }, screens)).toEqual({ x: -1000, y: 80 });
});

it("brings windows from a disconnected monitor back into the work area", () => {
  expect(visiblePosition({ ...bounds, x: 4000, y: 3000 }, { width: 248, height: 208 }, screens)).toEqual({ x: 1672, y: 832 });
});
