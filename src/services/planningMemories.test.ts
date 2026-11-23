import { expect, it } from "vitest";
import { planningMemories } from "./planningMemories";

it("prefers permitted reflections sharing words and uses recency for ties", () => {
  const memory = (id: string, text: string, aiAllowed = true) => ({ id, text, aiAllowed, createdAt: "2026-11-23T00:00:00.000Z" });
  const entries = [memory("old", "Painting helps me relax"), memory("private", "painting painting", false),
    memory("new", "Take small breaks"), memory("recent", "Writing helps")];
  expect(planningMemories("Start PAINTING", entries).map((entry) => entry.id)).toEqual(["old", "recent", "new"]);
  expect(planningMemories("Unrelated task", entries, 1)[0].id).toBe("recent");
});
