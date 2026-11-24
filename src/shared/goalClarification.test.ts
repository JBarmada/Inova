import { expect, it } from "vitest";
import { goalClarification } from "./goalClarification";
import { chatPhrases } from "./personality";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";

it("asks about missing details without extracting or inventing a deadline", () => {
  expect(goalClarification("Prepare my presentation by Friday")).toContain("What have you already done?");
  expect(goalClarification("I've already drafted my presentation")).toContain("When is it due");
  expect(goalClarification("I've already drafted my presentation by Friday")).toContain("helpful next step");
  expect(goalClarification("Prepare my presentation")).toBe(chatPhrases().clarify);
  expect(goalClarification("I haven't started my presentation")).toBe(chatPhrases().clarify);
  expect(goalClarification("Prepare my presentation by Friday", "sad")).toContain("take this slowly");
});

it("uses the same clarification for a new goal or an existing chat message without creating a quest", () => {
  const goal = "Prepare my presentation by Friday";
  const direct = reduce(initialState(), { type: "chat-goal", text: goal });
  const shared = reduce(initialState(), { type: "chat-share", text: goal });
  const planned = reduce(shared, { type: "chat-plan-message", messageIndex: 0, originalText: goal });
  expect(direct.chat.messages.at(-1)?.text).toBe(planned.chat.messages.at(-1)?.text);
  expect(planned.chat.messages.at(-1)?.text).toContain("What have you already done?");
  expect(planned.quests).toEqual([]);
  expect(planned.chat.phase).toBe("context");
});
