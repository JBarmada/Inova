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

it("does not fill relevant context with unrelated newer memories", () => {
  const entries = [memory("class", "I take astronomy"), memory("one", "My dog sleeps"),
    memory("two", "I enjoy painting"), memory("private", "I take physics", false)];
  expect(chatMemories("What class am I taking?", entries).map((entry) => entry.id)).toEqual(["class"]);
  expect(chatMemories("What class am I taking?", entries.slice(1)).map((entry) => entry.id)).toEqual(["two", "one"]);
});

it("recognizes common ways to express a name, enrollment and abbreviated dates", () => {
  const entries = [memory("name", "I go by Alex"), memory("class", "I take astronomy"),
    memory("event", "Astronomy exam: Dec. 8"), memory("unrelated", "I enjoy painting")];
  expect(chatMemories("What is my name?", entries)[0].id).toBe("name");
  expect(chatMemories("What am I enrolled in?", entries)[0].id).toBe("class");
  expect(chatMemories("When is my exam?", entries)[0].id).toBe("event");
  expect(chatMemories("What is my name?", [memory("n", "My name's Alex"), memory("other", "I enjoy painting")]).map((entry) => entry.id)).toEqual(["n"]);
});

it("does not substitute another person's birthday when a named birthday is private or absent", () => {
  const entries = [memory("friend", "My friend Sam likes tea"), memory("sam-date", "Sam's birthday is December 8", false),
    memory("pat-date", "Pat's birthday is July 1"), memory("lee-date", "Lee's birthday is May 2")];
  expect(chatMemories("When is Sam's birthday?", entries).map((entry) => entry.id)).toEqual(["friend"]);
  expect(chatMemories("When is Sam's birthday?", entries.slice(1)).map((entry) => entry.id)).toEqual([]);
  expect(chatMemories("When is Pat’s birthday?", entries).map((entry) => entry.id)).toEqual(["pat-date"]);
});
