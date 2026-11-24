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

it("combines category and search without changing records, treating older entries as Misc", () => {
  const memories = [
    { id: "a", text: "Alex likes tea", category: "people" as const, aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" },
    { id: "b", text: "Tea date", category: "events" as const, aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" },
    { id: "c", text: "Old note", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" },
  ];
  expect(findMemories(memories, "tea", "people")).toEqual([memories[0]]);
  expect(findMemories(memories, "tea", "events")).toEqual([memories[1]]);
  expect(findMemories(memories, "", "misc")).toEqual([memories[2]]);
  expect(findMemories(memories, "", "all")).toEqual(memories);
});
