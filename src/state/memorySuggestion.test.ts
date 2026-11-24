import { expect, it } from "vitest";
import { stateSchema } from "../shared/schema";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

const text = "My friend Sam likes tea";
const memory = { id: "m", text, category: "people" as const, source: "chat" as const, aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" };
function suggested() {
  const state = reduce(initialState(), { type: "chat-share", text });
  return reduce(state, { type: "chat-reply", messageIndex: 0, originalText: text, reply: "Nice!", memorySnapshot: [], memorySuggestion: { quote: text, category: "people" } });
}

it("saves and removes a suggestion atomically, preventing duplicate acceptance", () => {
  const state = stateSchema.parse(JSON.parse(JSON.stringify(suggested())));
  const action = { type: "save-chat-memory" as const, messageIndex: 0, originalText: text, memory, suggestion: { replyIndex: 1, quote: text } };
  const saved = reduce(state, action);
  expect(saved.memories).toEqual([memory]);
  expect(saved.chat.messages[1].memorySuggestion).toBeUndefined();
  expect(() => reduce(saved, { ...action, memory: { ...memory, id: "m2" } })).toThrow("no longer available");
  expect(reduce(saved, { type: "chat-reply", messageIndex: 0, originalText: text, reply: "Hi", memorySnapshot: [],
    memorySuggestion: { quote: text, category: "people" } }).chat.messages.at(-1)?.memorySuggestion).toBeUndefined();
});

it("dismisses only the selected suggestion and rejects stale review", () => {
  const state = suggested();
  const dismissed = reduce(state, { type: "dismiss-memory-suggestion", replyIndex: 1, sourceIndex: 0, quote: text });
  expect(dismissed.memories).toEqual([]);
  expect(dismissed.chat.messages[1].memorySuggestion).toBeUndefined();
  expect(() => reduce(dismissed, { type: "save-chat-memory", messageIndex: 0, originalText: text, memory,
    suggestion: { replyIndex: 1, quote: text } })).toThrow("no longer available");
});
