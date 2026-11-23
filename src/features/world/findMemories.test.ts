import { expect, it } from "vitest";
import { findMemories } from "./findMemories";

it("finds local reflections without changing their permissions or text", () => {
  const memories = [
    { id: "a", text: "Quiet\nbreaks help", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" },
    { id: "b", text: "A WALK helped", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" },
  ];
  expect(findMemories(memories, "  BREAKS ")).toEqual([memories[0]]);
  expect(findMemories(memories, "walk")).toEqual([memories[1]]);
  expect(findMemories(memories, "missing")).toEqual([]);
  expect(findMemories(memories, " ")).toEqual(memories);
  expect(memories[0]).toMatchObject({ text: "Quiet\nbreaks help", aiAllowed: false });
});
