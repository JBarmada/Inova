import { expect, it, vi } from "vitest";
import type { Action } from "../shared/actions";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { shareAndReply } from "./shareAndReply";

it("saves a message before asking the dog and records a sourced response", async () => {
  let state = initialState();
  const memory = { id: "m", text: "My name is Alex", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" };
  state = reduce(state, { type: "add-memory", memory });
  const dispatch = vi.fn(async (action: Action) => { state = reduce(state, action); });
  const reply = vi.fn(async () => ({ reply: "Your name is Alex!", memorySnapshot: [{ id: "m", text: memory.text }] }));
  expect(await shareAndReply(" What is my name? ", state, dispatch, reply)).toBe("");
  expect(state.chat.messages).toEqual([{ role: "user", text: "What is my name?" },
    { role: "dog", text: "Your name is Alex!", sourceIds: ["m"] }]);
  expect(state.memories).toEqual([memory]);
});

it("keeps the user message and offers retry when AI or a stale memory fails", async () => {
  let state = initialState();
  const dispatch = async (action: Action) => { state = reduce(state, action); };
  const offline = vi.fn(async () => { throw Error("offline"); });
  expect(await shareAndReply("Hello", state, dispatch, offline)).toContain("try again");
  expect(state.chat.messages).toEqual([{ role: "user", text: "Hello" }]);
  const stale = vi.fn(async () => ({ reply: "Hi", memorySnapshot: [{ id: "missing", text: "old" }] }));
  expect(await shareAndReply("Again", state, dispatch, stale)).toContain("try again");
  expect(state.chat.messages.map((entry) => entry.text)).toEqual(["Hello", "Again"]);
});

it("does not call the model if saving the message fails", async () => {
  const reply = vi.fn(async () => ({ reply: "Hi", memorySnapshot: [] }));
  await expect(shareAndReply("Hello", initialState(), async () => { throw Error("save failed"); }, reply)).rejects.toThrow("save failed");
  expect(reply).not.toHaveBeenCalled();
});
