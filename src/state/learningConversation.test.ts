import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { localChat } from "../services/localChat";
import { stateSchema, type AppState, type Memory } from "../shared/schema";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

const at = "2026-11-23T00:00:00.000Z";

function remember(state: AppState, id: string, text: string, category: Memory["category"]) {
  const shared = reduce(state, { type: "chat-share", text });
  return reduce(shared, { type: "save-chat-memory", messageIndex: shared.chat.messages.length - 1, originalText: text,
    memory: { id, text, category, source: "chat", aiAllowed: true, createdAt: at } });
}

async function ask(state: AppState, text: string) {
  const shared = reduce(state, { type: "chat-share", text });
  const index = shared.chat.messages.length - 1;
  const call = vi.fn().mockResolvedValue(JSON.stringify({ reply: "Fictional placeholder." }));
  const result = await localChat(text, shared, call as unknown as typeof invoke, { includeRecent: false, beforeIndex: index });
  return { state: reduce(shared, { type: "chat-reply", messageIndex: index, originalText: text, ...result }),
    sent: JSON.parse(call.mock.calls[0][1].input).memories as { id: string; text: string }[] };
}

it("tracks confirmed learning, corrections and permission changes across a fictional conversation", async () => {
  let state = initialState();
  const before = await ask(state, "What is my name?");
  expect(before.sent).toEqual([]);
  state = remember(before.state, "name", "I'm Alex", "you");
  state = remember(state, "class", "I take astronomy", "you");
  state = remember(state, "effort", "I studied astronomy for three hours", "you");
  state = remember(state, "friend", "My friend Sam likes tea", "people");
  state = remember(state, "date", "Sam's birthday is December 8", "events");
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  expect((await ask(state, "What is my name?")).sent).toEqual([{ id: "name", text: "I'm Alex" }]);
  expect((await ask(state, "What class am I taking?")).sent.map((entry) => entry.id)).toContain("class");
  expect((await ask(state, "Do I like astronomy?")).sent.map((entry) => entry.id)).toContain("effort");
  expect(state.memories.some((entry) => /like astronomy/i.test(entry.text))).toBe(false);
  expect((await ask(state, "When is Sam's birthday?")).sent.map((entry) => entry.id)).toContain("date");
  state = reduce(state, { type: "edit-memory", id: "friend", text: "Sam likes coffee" });
  state = reduce(state, { type: "memory-permission", id: "date", allowed: false });
  state = reduce(state, { type: "delete-memory", id: "name" });
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  const changed = await ask(state, "What does Sam like?");
  expect(changed.sent).toContainEqual({ id: "friend", text: "Sam likes coffee" });
  expect(JSON.stringify(changed.sent)).not.toContain("likes tea");
  expect((await ask(state, "When is Sam's birthday?")).sent.map((entry) => entry.id)).not.toContain("date");
  expect((await ask(state, "What is my name?")).sent.map((entry) => entry.id)).not.toContain("name");
});
