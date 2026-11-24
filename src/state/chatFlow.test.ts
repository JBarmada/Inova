import { expect, it } from "vitest";
import { prepareQuest } from "../services/prepareQuest";
import { stateSchema } from "../shared/schema";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

it("restores a conversation and atomically accepts its reviewed quest only once", async () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Prepare my presentation" });
  state = stateSchema.parse(JSON.parse(JSON.stringify(state)));
  expect(state.chat.phase).toBe("context");
  state = reduce(state, { type: "chat-context", text: "I have an outline" });
  expect(state.chat.goal).toContain("I have an outline");
  const draft = await prepareQuest(state.chat.goal, state, async () => { throw Error("offline"); });
  expect(state.quests).toHaveLength(0);
  const action = { type: "accept-planned-quest" as const, ...draft };
  const accepted = reduce(state, action);
  expect(accepted.quests[0]).toMatchObject({ status: "accepted", planner: "sample" });
  expect(accepted.chat.phase).toBe("goal");
  expect(() => reduce(accepted, action)).toThrow("conversation changed");
  const restored = stateSchema.parse(JSON.parse(JSON.stringify(accepted)));
  expect(restored.chat.messages.slice(0, state.chat.messages.length)).toEqual(state.chat.messages);
  expect(restored.chat.messages.at(-1)?.text).toContain("Sample quest accepted");
  expect(restored.quests).toHaveLength(1);
  expect(reduce(restored, { type: "chat-clear" }).chat.messages).toEqual([]);
});

it("does not discard old messages when the transcript reaches its limit", () => {
  const state = initialState();
  state.chat.messages = Array.from({ length: 200 }, () => ({ role: "user" as const, text: "Earlier message" }));
  expect(() => reduce(state, { type: "chat-goal", text: "New goal" })).toThrow("Conversation is full");
  expect(state.chat.messages).toHaveLength(200);
});

it("rejects changed permitted memory before acceptance and leaves the draft unsaved", async () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Try painting" });
  state = reduce(state, { type: "chat-skip" });
  const memory = { id: "m", text: "Painting helps", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" };
  state = reduce(state, { type: "add-memory", memory });
  const draft = await prepareQuest(state.chat.goal, state, async () => { throw Error("offline"); });
  const revoked = reduce(state, { type: "memory-permission", id: "m", allowed: false });
  expect(() => reduce(revoked, { type: "accept-planned-quest", ...draft })).toThrow("changed");
  expect(revoked.quests).toHaveLength(0);
  expect(revoked.commitments).toHaveLength(0);
  expect(JSON.stringify(revoked.chat)).not.toContain(memory.text);
});

it("loads older saves without conversation data", () => {
  const { chat: _, ...older } = initialState();
  expect(stateSchema.parse(older).chat).toEqual({ phase: "goal", goal: "", messages: [], pendingReflections: [] });
});
