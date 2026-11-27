import { expect, it } from "vitest";
import { isClearTopicShift, topicContext } from "./topicContext";
import type { ChatContextEntry } from "./recentChat";
const history: ChatContextEntry[] = [
  { index: 0, role: "user", text: "Help me write a paper" },
  { index: 1, role: "dog", text: "Let's brainstorm the paper." },
];
it("drops the previous paper conversation for an unrelated food question", () => {
  expect(topicContext("I don't know what to eat tomorrow", history)).toEqual([]);
  expect(topicContext("I don’t know what to eat tmrw", history)).toEqual([]);
});
it("keeps recent context for same-topic and ambiguous follow-ups", () => {
  expect(topicContext("How should I structure my paper?", history)).toEqual(history);
  expect(topicContext("What about that?", history)).toEqual(history);
  expect(topicContext("Yes, please", history)).toEqual(history);
});

it("routes clear independent questions away from an unfinished goal", () => {
  expect(isClearTopicShift("I don't know what to eat tomorrow", "Write a paper")).toBe(true);
  expect(isClearTopicShift("I don’t know what to eat tmrw", "Write a paper")).toBe(true);
  expect(isClearTopicShift("What should I eat?", "Write a paper")).toBe(true);
  expect(isClearTopicShift("I have done nothing", "Write a paper")).toBe(false);
  expect(isClearTopicShift("What should I do?", "Write a paper")).toBe(false);
  expect(isClearTopicShift("What should I write in my paper?", "Write a paper")).toBe(false);
});
