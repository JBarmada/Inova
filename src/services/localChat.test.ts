import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { localChat } from "./localChat";

const memory = { id: "m", text: "My friend Sam likes tea", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" };
const privateMemory = { ...memory, id: "private", text: "Private exam date", aiAllowed: false };

it("uses only the chosen message and permitted memories, and clears dependent replies", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "What does Sam like?" });
  state = reduce(state, { type: "add-memory", memory });
  state = reduce(state, { type: "add-memory", memory: privateMemory });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Sam likes tea!" }));
  const result = await localChat("What does Sam like?", state, call as unknown as typeof invoke);
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input).toEqual({ message: "What does Sam like?", dogName: state.pet.name, memories: [{ id: "m", text: memory.text }] });
  const action = { type: "chat-reply" as const, messageIndex: 0, originalText: "What does Sam like?", ...result };
  const saved = reduce(state, action);
  expect(saved.chat.messages.at(-1)).toMatchObject({ text: "Sam likes tea!", sourceIds: ["m"] });
  const revoked = reduce(saved, { type: "memory-permission", id: "m", allowed: false });
  expect(revoked.chat.messages.at(-1)?.text).not.toContain("Sam");
  expect(() => reduce(revoked, action)).toThrow("memory changed");
  expect(reduce(saved, { type: "delete-memory", id: "m" }).chat.messages.at(-1)?.text).not.toContain("Sam");
  expect(reduce(saved, { type: "edit-memory", id: "m", text: "Sam likes coffee" }).chat.messages.at(-1)?.text).not.toContain("Sam");
});

it("rejects malformed local replies and stale conversation requests", async () => {
  const state = reduce(initialState(), { type: "chat-share", text: "Hello" });
  const call = vi.fn().mockResolvedValue('{"reply":"", "extra":true}');
  await expect(localChat("Hello", state, call as unknown as typeof invoke)).rejects.toThrow("invalid reply");
  expect(() => reduce(reduce(state, { type: "chat-clear" }), { type: "chat-reply", messageIndex: 0,
    originalText: "Hello", reply: "Hi!", memorySnapshot: [] })).toThrow("conversation changed");
});

it("includes only opted-in earlier user messages and rejects changed context", async () => {
  let state = initialState();
  for (const text of ["I am Alex", "I take astronomy", "Sam likes tea", "The exam is December 8", "I studied today", "What class is it?"])
    state = reduce(state, { type: "chat-share", text });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Astronomy!" }));
  const result = await localChat("What class is it?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 5 });
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.recentConversation).toEqual(["I take astronomy", "Sam likes tea", "The exam is December 8", "I studied today"].map((text) => ({ role: "user", text })));
  expect(input.recentConversation.map((entry: { text: string }) => entry.text)).not.toContain("What class is it?");
  const action = { type: "chat-reply" as const, messageIndex: 5, originalText: "What class is it?", ...result };
  expect(reduce(state, action).chat.messages.at(-1)?.text).toBe("Astronomy!");
  const changed = { ...state, chat: { ...state.chat, messages: state.chat.messages.map((entry, index) => index === 1 ? { ...entry, text: "Changed" } : entry) } };
  expect(() => reduce(changed, action)).toThrow("conversation changed");
  await localChat("What class is it?", state, call as unknown as typeof invoke, { includeRecent: false, beforeIndex: 5 });
  expect(JSON.parse(call.mock.calls[1][1].input).recentConversation).toBeUndefined();
});

it("includes a previous dog question only when its memory sources remain in scope", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Tell me about Sam" });
  state = reduce(state, { type: "add-memory", memory });
  state = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "Tell me about Sam", reply: "Does Sam still like tea?", memorySnapshot: [memory] });
  state = reduce(state, { type: "chat-share", text: "Yes, Sam does" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Good to know!" }));
  const result = await localChat("Yes, Sam does", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  expect(JSON.parse(call.mock.calls[0][1].input).recentConversation).toEqual([
    { role: "user", text: "Tell me about Sam" }, { role: "dog", text: "Does Sam still like tea?" },
  ]);
  const action = { type: "chat-reply" as const, messageIndex: 2, originalText: "Yes, Sam does", ...result };
  const saved = reduce(state, action);
  expect(saved.chat.messages.at(-1)?.sourceIds).toContain("m");
  const revoked = reduce(saved, { type: "memory-permission", id: "m", allowed: false });
  expect(revoked.chat.messages.at(-1)?.text).toContain("removed");
  expect(() => reduce(reduce(state, { type: "memory-permission", id: "m", allowed: false }), action)).toThrow();
  const changed = { ...state, chat: { ...state.chat, messages: state.chat.messages.map((entry, index) => index === 1 ? { ...entry, text: "changed" } : entry) } };
  expect(() => reduce(changed, action)).toThrow("conversation changed");
  await localChat("Yes, Sam does", reduce(state, { type: "memory-permission", id: "m", allowed: false }), call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  expect(JSON.parse(call.mock.calls[1][1].input).recentConversation.some((entry: { text: string }) => entry.text.includes("tea"))).toBe(false);
});

it("keeps an older source and dog question together in a short follow-up despite newer memories", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "What does Sam like?" });
  state = reduce(state, { type: "add-memory", memory });
  state = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "What does Sam like?", reply: "Does Sam still like tea?", memorySnapshot: [memory] });
  for (const id of ["a", "b", "c"]) state = reduce(state, { type: "add-memory", memory: { ...memory, id, text: `Unrelated ${id}` } });
  state = reduce(state, { type: "chat-share", text: "Yes, he does." });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Good to know Sam still likes tea!" }));
  const result = await localChat("Yes, he does.", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.memories.map((entry: { id: string }) => entry.id)).toContain("m");
  expect(input.recentConversation).toContainEqual({ role: "dog", text: "Does Sam still like tea?" });
  const saved = reduce(state, { type: "chat-reply", messageIndex: 2, originalText: "Yes, he does.", ...result });
  expect(reduce(saved, { type: "delete-memory", id: "m" }).chat.messages.at(-1)?.text).toContain("removed");
});

it("carries an eligible prior source into a pronoun question, but not after its conversation is excluded", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Tell me about Sam" });
  state = reduce(state, { type: "add-memory", memory });
  state = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "Tell me about Sam", reply: "Sam likes tea.", memorySnapshot: [memory] });
  for (const id of ["a", "b", "c"]) state = reduce(state, { type: "add-memory", memory: { ...memory, id, text: `Unrelated ${id}` } });
  state = reduce(state, { type: "chat-share", text: "What about her?" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "What would you like to know?" }));
  await localChat("What about her?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.memories.map((entry: { id: string }) => entry.id)).toContain("m");
  expect(input.recentConversation).toContainEqual({ role: "dog", text: "Sam likes tea." });
  const excluded = reduce(state, { type: "chat-context-exclusion", messageIndex: 0, originalText: "Tell me about Sam", excluded: true });
  await localChat("What about her?", excluded, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  const excludedInput = JSON.parse(call.mock.calls[1][1].input);
  expect(excludedInput.memories.map((entry: { id: string }) => entry.id)).not.toContain("m");
  expect(JSON.stringify(excludedInput.recentConversation ?? [])).not.toContain("Sam likes tea");
});

it("connects a follow-up birthday question to the person already discussed", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Tell me about Sam" });
  state = reduce(state, { type: "add-memory", memory });
  state = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "Tell me about Sam", reply: "Sam likes tea.", memorySnapshot: [memory] });
  state = reduce(state, { type: "add-memory", memory: { ...memory, id: "birthday", text: "Sam's birthday is December 8" } });
  state = reduce(state, { type: "chat-share", text: "When is her birthday?" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Sam's birthday is December 8." }));
  const result = await localChat("When is her birthday?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.memories.map((entry: { id: string }) => entry.id)).toEqual(["m", "birthday"]);
  expect(input.recentConversation).toContainEqual({ role: "dog", text: "Sam likes tea." });
  expect(reduce(state, { type: "chat-reply", messageIndex: 2, originalText: "When is her birthday?", ...result }).chat.messages.at(-1)?.sourceIds).toEqual(["m", "birthday"]);
  await localChat("When is her birthday?", state, call as unknown as typeof invoke, { includeRecent: false, beforeIndex: 2 });
  expect(JSON.parse(call.mock.calls[1][1].input).memories.map((entry: { id: string }) => entry.id)).toEqual(["birthday"]);
  expect(JSON.parse(call.mock.calls[1][1].input).recentConversation).toBeUndefined();
});

it("prefers the discussed person's birthday over newer dates from other people", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Tell me about Sam" });
  state = reduce(state, { type: "add-memory", memory });
  state = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "Tell me about Sam", reply: "Sam likes tea.", memorySnapshot: [memory] });
  for (const [id, text] of [["sam", "Sam's birthday is December 8"], ["alex", "Alex's birthday is June 9"], ["lee", "Lee's birthday is May 2"], ["pat", "Pat's birthday is July 1"]]) {
    state = reduce(state, { type: "add-memory", memory: { ...memory, id, text } });
  }
  state = reduce(state, { type: "chat-share", text: "When is her birthday?" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Let me check." }));
  await localChat("When is her birthday?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  expect(JSON.parse(call.mock.calls[0][1].input).memories.map((entry: { id: string }) => entry.id)).toEqual(["m", "sam", "pat"]);
  await localChat("When is her birthday?", state, call as unknown as typeof invoke, { includeRecent: false, beforeIndex: 2 });
  expect(JSON.parse(call.mock.calls[1][1].input).memories.map((entry: { id: string }) => entry.id)).toEqual(["pat", "lee", "alex"]);
});

it("uses the previous eligible user message to rank a follow-up even when the dog used no memories", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "Tell me about Sam" });
  state = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "Tell me about Sam", reply: "What would you like to know?", memorySnapshot: [] });
  for (const [id, text] of [["sam", "Sam's birthday is December 8"], ["alex", "Alex's birthday is June 9"], ["lee", "Lee's birthday is May 2"], ["pat", "Pat's birthday is July 1"]]) {
    state = reduce(state, { type: "add-memory", memory: { ...memory, id, text } });
  }
  state = reduce(state, { type: "chat-share", text: "When is her birthday?" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Let me check." }));
  await localChat("When is her birthday?", state, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  expect(JSON.parse(call.mock.calls[0][1].input).memories.map((entry: { id: string }) => entry.id)).toEqual(["sam", "pat", "lee"]);
  const excluded = reduce(state, { type: "chat-context-exclusion", messageIndex: 0, originalText: "Tell me about Sam", excluded: true });
  await localChat("When is her birthday?", excluded, call as unknown as typeof invoke, { includeRecent: true, beforeIndex: 2 });
  const input = JSON.parse(call.mock.calls[1][1].input);
  expect(input.memories.map((entry: { id: string }) => entry.id)).toEqual(["pat", "lee", "alex"]);
  expect(JSON.stringify(input.recentConversation ?? [])).not.toContain("Sam");
});

it("passes an adopted dog's personality to the local model as tone only", async () => {
  const state = reduce(initialState(), { type: "adopt", name: "Pip", personality: "mean" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Let's get started." }));
  await localChat("Hello", state, call as unknown as typeof invoke);
  expect(JSON.parse(call.mock.calls[0][1].input)).toMatchObject({ dogName: "Pip", dogPersonality: "mean", message: "Hello" });
});

it("offers only an exact quote from the current message and never saves it automatically", async () => {
  const text = "My friend Sam likes tea";
  const state = reduce(initialState(), { type: "chat-share", text });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Nice!", memoryQuote: text, memoryCategory: "people" }));
  const result = await localChat(text, state, call as unknown as typeof invoke);
  expect(result.memorySuggestion).toEqual({ quote: text, category: "people" });
  const saved = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: text, ...result });
  expect(saved.memories).toEqual([]);
  expect(saved.chat.messages[1].memorySuggestion).toEqual({ sourceIndex: 0, quote: text, category: "people" });
  call.mockResolvedValueOnce(JSON.stringify({ reply: "Nice!", memoryQuote: "Sam loves tea", memoryCategory: "people" }));
  expect((await localChat(text, state, call as unknown as typeof invoke)).memorySuggestion).toBeUndefined();
  expect(() => reduce(state, { type: "chat-reply", messageIndex: 0, originalText: text, reply: "Nice!", memorySnapshot: [],
    memorySuggestion: { quote: "Sam loves tea", category: "people" } })).toThrow("not a statement");
  call.mockResolvedValueOnce(JSON.stringify({ reply: "I don't know.", memoryQuote: "What is my name?", memoryCategory: "you" }));
  expect((await localChat("What is my name?", state, call as unknown as typeof invoke)).memorySuggestion).toBeUndefined();
});

it("returns a model goal signal without creating or accepting a quest", async () => {
  const state = reduce(initialState(), { type: "chat-share", text: "I need to study for my exam" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Let's work on that.", offerQuest: true }));
  const result = await localChat("I need to study for my exam", state, call as unknown as typeof invoke);
  expect(result.offerQuest).toBe(true);
  expect(state.quests).toEqual([]);
  expect((await localChat("What is my name?", state, call as unknown as typeof invoke)).offerQuest).toBeUndefined();
  expect((await localChat("I don't want to study", state, call as unknown as typeof invoke)).offerQuest).toBeUndefined();
});

it("sends an older relevant class memory and stops sending it after permission is revoked", async () => {
  let state = reduce(initialState(), { type: "chat-share", text: "What class am I taking?" });
  for (const entry of [
    { ...memory, id: "class", text: "I take astronomy" },
    { ...memory, id: "a", text: "I enjoy painting" },
    { ...memory, id: "b", text: "I enjoy baking" },
    { ...memory, id: "c", text: "I enjoy reading" },
  ]) state = reduce(state, { type: "add-memory", memory: entry });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "You take astronomy." }));
  const result = await localChat("What class am I taking?", state, call as unknown as typeof invoke);
  expect(result.memorySnapshot.map((entry) => entry.id)).toEqual(["class"]);
  const saved = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "What class am I taking?", ...result });
  expect(reduce(saved, { type: "memory-permission", id: "a", allowed: false }).chat.messages.at(-1)?.text).toBe("You take astronomy.");
  state = reduce(state, { type: "memory-permission", id: "class", allowed: false });
  expect(() => reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "What class am I taking?", ...result })).toThrow("memory changed");
  await localChat("What class am I taking?", state, call as unknown as typeof invoke);
  expect(JSON.parse(call.mock.calls[1][1].input).memories.map((entry: { id: string }) => entry.id)).not.toContain("class");
});
