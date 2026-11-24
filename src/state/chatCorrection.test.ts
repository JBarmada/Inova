import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema } from "../shared/schema";

const target = { id: "friend", text: "Sam likes tea", aiAllowed: true, category: "people" as const, createdAt: "2026-11-23T00:00:00.000Z" };
const text = "Sam prefers coffee now";

function setup() {
  let state = reduce(initialState(), { type: "add-memory", memory: target });
  state = reduce(state, { type: "chat-share", text });
  return reduce(state, { type: "chat-reply", messageIndex: 0, originalText: text, reply: "I'll remember that.",
    memorySnapshot: [target], memorySuggestion: { quote: text, category: "people" } });
}

it("updates the chosen memory, clears dependent replies and preserves permissions through reload", () => {
  const state = setup();
  const action = { type: "correct-chat-memory" as const, messageIndex: 0, originalText: text, target, text,
    suggestion: { replyIndex: 1, quote: text } };
  const saved = stateSchema.parse(JSON.parse(JSON.stringify(reduce(state, action))));
  expect(saved.memories).toEqual([{ ...target, text }]);
  expect(saved.chat.messages[1].text).toContain("removed");
  expect(saved.chat.messages[1].memorySuggestion).toBeUndefined();
  expect(() => reduce(saved, action)).toThrow("memory changed");
});

it("rejects stale targets, missing messages, stale suggestions and blank corrections", () => {
  const state = setup();
  const action = { type: "correct-chat-memory" as const, messageIndex: 0, originalText: text, target, text };
  expect(() => reduce(reduce(state, { type: "memory-permission", id: target.id, allowed: false }), action)).toThrow("memory changed");
  expect(() => reduce(reduce(state, { type: "chat-clear" }), action)).toThrow("conversation changed");
  expect(() => reduce(state, { ...action, suggestion: { replyIndex: 1, quote: "not the suggestion" } })).toThrow("no longer available");
  expect(() => reduce(state, { ...action, text: " " })).toThrow("Memory must contain");
  expect(state.memories[0]).toEqual(target);
});
