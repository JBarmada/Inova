import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { stateSchema } from "../shared/schema";
import { localChat } from "./localChat";

it("excludes a user statement and transitive dog replies from later context after reload", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Sam likes tea" });
  state = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "Sam likes tea", reply: "Tea for Sam!", memorySnapshot: [] });
  state = reduce(state, { type: "chat-share", text: "Tell me more" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Tea sounds nice." }));
  const result = await localChat("Tell me more", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  state = reduce(state, { type: "chat-reply", messageIndex: 2, originalText: "Tell me more", ...result });
  state = reduce(state, { type: "chat-context-exclusion", messageIndex: 0, originalText: "Sam likes tea", excluded: true });
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  state = reduce(state, { type: "chat-share", text: "What about that?" });
  await localChat("What about that?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 4 });
  const context = JSON.parse(call.mock.calls[1][1].input).recentConversation;
  expect(context).toEqual([{ role: "user", text: "Tell me more" }]);
  expect(state.chat.messages[0].text).toBe("Sam likes tea");
  state = reduce(state, { type: "chat-context-exclusion", messageIndex: 0, originalText: "Sam likes tea", excluded: false });
  await localChat("What about that?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 4 });
  expect(JSON.stringify(JSON.parse(call.mock.calls[2][1].input).recentConversation)).toContain("Tea for Sam!");
});

it("rejects an in-flight response when its context is excluded and omits legacy replies", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Old fact" });
  state = { ...state, chat: { ...state.chat, messages: [...state.chat.messages, { role: "dog", text: "Old reply", sourceIds: [] }] } };
  state = reduce(state, { type: "chat-share", text: "What about that?" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Hi" }));
  const result = await localChat("What about that?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  const changed = reduce(state, { type: "chat-context-exclusion", messageIndex: 0, originalText: "Old fact", excluded: true });
  expect(() => reduce(changed, { type: "chat-reply", messageIndex: 2, originalText: "What about that?", ...result })).toThrow("conversation changed");
  await localChat("What about that?", changed, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  expect(JSON.stringify(JSON.parse(call.mock.calls[1][1].input))).not.toContain("Old reply");
  expect(() => reduce(state, { type: "chat-context-exclusion", messageIndex: 1, originalText: "Old reply", excluded: true })).toThrow("conversation changed");
});

it("keeps unknown legacy reply dependencies out of context after an exclusion", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Old fact" });
  state = { ...state, chat: { ...state.chat, messages: [...state.chat.messages, { role: "dog", text: "Legacy reply", sourceIds: [] }] } };
  state = reduce(state, { type: "chat-share", text: "Continue" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Derived reply" }));
  const result = await localChat("Continue", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  state = reduce(state, { type: "chat-reply", messageIndex: 2, originalText: "Continue", ...result });
  expect(state.chat.messages[3].contextUnknown).toBe(true);
  state = reduce(state, { type: "chat-context-exclusion", messageIndex: 0, originalText: "Old fact", excluded: true });
  state = reduce(state, { type: "chat-share", text: "Next" });
  await localChat("Next", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 4 });
  const input = JSON.stringify(JSON.parse(call.mock.calls[1][1].input));
  expect(input).not.toContain("Legacy reply");
  expect(input).not.toContain("Derived reply");
});
