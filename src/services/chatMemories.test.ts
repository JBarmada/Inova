import { expect, it } from "vitest";
import { chatMemories } from "./chatMemories";

const memory = (id: string, text: string, aiAllowed = true) => ({ id, text, aiAllowed, createdAt: "2026-11-23T00:00:00.000Z" });

it("finds older permitted facts using related wording and keeps private facts out", () => {
  const entries = [memory("name", "Call me Alex"), memory("class", "I take astronomy"),
    memory("person", "My friend Sam likes tea"), memory("date", "Sam's birthday is December 8"),
    memory("private", "My name is Secret", false), memory("recent1", "I like drawing"), memory("recent2", "I like walks"), memory("recent3", "I like music")];
  expect(chatMemories("What is my name?", entries)[0].id).toBe("name");
  expect(chatMemories("What class am I taking?", entries)[0].id).toBe("class");
  expect(chatMemories("What does Sam like?", entries)[0].id).toBe("person");
  expect(chatMemories("When is Sam's birthday?", entries)[0].id).toBe("date");
  expect(chatMemories("What is my name?", entries).map((entry) => entry.id)).not.toContain("private");
});

it("uses recency for equally relevant memories and retains the bounded limit", () => {
  const entries = [memory("old", "I like drawing"), memory("new", "I like music"), memory("latest", "I like walking")];
  expect(chatMemories("Hello", entries, 2).map((entry) => entry.id)).toEqual(["latest", "new"]);
});
