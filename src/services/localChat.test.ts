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
  expect(input.recentUserMessages).toEqual(["I take astronomy", "Sam likes tea", "The exam is December 8", "I studied today"]);
  expect(input.recentUserMessages).not.toContain("What class is it?");
  const action = { type: "chat-reply" as const, messageIndex: 5, originalText: "What class is it?", ...result };
  expect(reduce(state, action).chat.messages.at(-1)?.text).toBe("Astronomy!");
  const changed = { ...state, chat: { ...state.chat, messages: state.chat.messages.map((entry, index) => index === 1 ? { ...entry, text: "Changed" } : entry) } };
  expect(() => reduce(changed, action)).toThrow("conversation changed");
  await localChat("What class is it?", state, call as unknown as typeof invoke, { includeRecent: false, beforeIndex: 5 });
  expect(JSON.parse(call.mock.calls[1][1].input).recentUserMessages).toBeUndefined();
});

it("passes an adopted dog's personality to the local model as tone only", async () => {
  const state = reduce(initialState(), { type: "adopt", name: "Pip", personality: "mean" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Let's get started." }));
  await localChat("Hello", state, call as unknown as typeof invoke);
  expect(JSON.parse(call.mock.calls[0][1].input)).toMatchObject({ dogName: "Pip", dogPersonality: "mean", message: "Hello" });
});
