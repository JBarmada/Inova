import { expect, it } from "vitest";
import { chatPhrases, personalities, randomPersonality } from "../shared/personality";
import { stateSchema } from "../shared/schema";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

it("selects all four personalities and persists the one generated on adoption", () => {
  expect([0, 0.25, 0.5, 0.75].map((value) => randomPersonality(() => value))).toEqual(personalities);
  expect(() => randomPersonality(() => 1)).toThrow();
  for (const personality of personalities) {
    const state = reduce(initialState(), { type: "adopt", name: "Pip", personality });
    const restored = stateSchema.parse(JSON.parse(JSON.stringify(state)));
    expect(restored.pet).toMatchObject({ name: "Pip", personality, mood: "idle" });
    expect(restored.rewardedQuestIds).toEqual([]);
    const chat = reduce(restored, { type: "chat-goal", text: "Prepare a project" });
    expect(chat.chat.messages.at(-1)?.text).toBe(chatPhrases(personality).clarify);
    expect(chat.pet.mood).toBe("idle");
  }
});

it("preserves older adopted dogs without assigning them a new personality", () => {
  const old = { ...initialState(), pet: { name: "Pip", adopted: true, mood: "idle" as const } };
  const restored = stateSchema.parse(JSON.parse(JSON.stringify(old)));
  expect(restored.pet.personality).toBeUndefined();
  expect(reduce(restored, { type: "chat-goal", text: "Learn" }).chat.messages.at(-1)?.text).toBe(chatPhrases().clarify);
});
