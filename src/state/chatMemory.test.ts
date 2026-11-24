import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema, type AppState, type Memory } from "../shared/schema";
import { proposeLocalPlan } from "../services/localPlan";

const at = "2026-11-23T00:00:00.000Z";
function share(state: AppState, text: string, id: string, category: Memory["category"], allowed = true) {
  const next = reduce(state, { type: "chat-share", text });
  const index = next.chat.messages.length - 1;
  return reduce(next, { type: "save-chat-memory", messageIndex: index, originalText: text,
    memory: { id, text, category, source: "chat", aiAllowed: allowed, createdAt: at } });
}

it("builds user-confirmed memories across a fictional conversation and restart", async () => {
  let state = initialState();
  expect(state.memories).toEqual([]);
  state = share(state, "My name is Alex", "name", "you");
  state = share(state, "I am taking astronomy", "class", "you");
  state = share(state, "My friend Sam likes tea", "friend", "people");
  state = share(state, "Astronomy exam is December 8", "exam", "events", false);
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  expect(state.memories.map((entry) => entry.id)).toEqual(["name", "class", "friend", "exam"]);
  expect(state.chat.phase).toBe("goal");
  const call = vi.fn().mockResolvedValue(JSON.stringify({ explanation: "Start small.", steps: [{ title: "Review notes", reason: "Prepare", minutes: 5 }] }));
  await proposeLocalPlan({ id: "c", title: "Study astronomy", createdAt: at }, state, call as unknown as typeof invoke);
  const input = JSON.parse(call.mock.calls[0][1].input);
  expect(input.reflections).toContainEqual({ id: "class", text: "I am taking astronomy" });
  expect(input.reflections.some((entry: { id: string }) => entry.id === "exam")).toBe(false);
  state = reduce(state, { type: "edit-memory", id: "friend", text: "Sam likes coffee" });
  state = reduce(state, { type: "delete-memory", id: "class" });
  state = reduce(state, { type: "memory-permission", id: "name", allowed: false });
  expect(state.memories.find((entry) => entry.id === "friend")?.text).toBe("Sam likes coffee");
  expect(state.memories.some((entry) => entry.id === "class")).toBe(false);
  expect(state.memories.find((entry) => entry.id === "name")?.aiAllowed).toBe(false);
  await proposeLocalPlan({ id: "c2", title: "Plan tea with Sam", createdAt: at }, state, call as unknown as typeof invoke);
  const revised = JSON.parse(call.mock.calls[1][1].input);
  expect(revised.reflections).toContainEqual({ id: "friend", text: "Sam likes coffee" });
  expect(JSON.stringify(revised)).not.toContain("Alex");
  expect(JSON.stringify(revised)).not.toContain("taking astronomy");
  expect(JSON.stringify(revised)).not.toContain("likes tea");
});

it("does not save unconfirmed messages or allow stale or dog messages to become memories", () => {
  const state = reduce(initialState(), { type: "chat-share", text: "My name is Alex" });
  expect(state.memories).toEqual([]);
  const memory = { id: "m", text: "My name is Alex", source: "chat" as const, aiAllowed: false, createdAt: at };
  const action = { type: "save-chat-memory" as const, messageIndex: 0, originalText: "My name is Alex", memory };
  expect(reduce(state, action).memories[0].aiAllowed).toBe(false);
  expect(() => reduce(reduce(state, { type: "chat-clear" }), action)).toThrow("conversation changed");
  const withDog = reduce(state, { type: "chat-reply", messageIndex: 0, originalText: "My name is Alex", reply: "Hi!", memorySnapshot: [] });
  expect(() => reduce(withDog, { ...action, messageIndex: 1 })).toThrow("conversation changed");
});
