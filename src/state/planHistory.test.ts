import { expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { stateSchema } from "../shared/schema";
import { recentChat } from "../services/recentChat";

it("records accepted steps, retains provenance, and removes the copy when a memory is revoked", () => {
  let state = reduce(initialState(), { type: "chat-goal", text: "Paint a scene" });
  state = reduce(state, { type: "chat-skip" });
  const memory = { id: "m", text: "Short sessions help", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" };
  state = reduce(state, { type: "add-memory", memory });
  const commitment = { id: "c", title: state.chat.goal, createdAt: memory.createdAt };
  const quest = { id: "q", commitmentId: "c", title: "Pick a color", reason: "Start small", minutes: 5,
    planner: "local" as const, status: "proposed" as const, sourceIds: ["c", "m"],
    futureSteps: [{ title: "Sketch the scene", reason: "Build on it", minutes: 5 }] };
  const accepted = reduce(state, { type: "accept-planned-quest", commitment, quest, memorySnapshot: [{ id: "m", text: memory.text }] });
  const restored = stateSchema.parse(JSON.parse(JSON.stringify(accepted)));
  expect(restored.chat.messages.at(-1)).toMatchObject({ role: "dog", text: "Quest accepted: Pick a color\nSuggestions at acceptance: Sketch the scene", sourceIds: ["m"] });
  expect(reduce(restored, { type: "memory-permission", id: "m", allowed: false }).chat.messages.at(-1)?.text).toContain("removed");
  const excluded = reduce(restored, { type: "chat-context-exclusion", messageIndex: 0, originalText: "Paint a scene", excluded: true });
  expect(recentChat(excluded, excluded.chat.messages.length, ["m"]).some((message) => message.text.includes("Pick a color"))).toBe(false);
});

it("does not block accepting a quest when the conversation is full", () => {
  const base = initialState();
  const state = { ...base, chat: { ...base.chat, phase: "ready" as const, goal: "Paint", messages: Array.from({ length: 200 }, () => ({ role: "user" as const, text: "Earlier" })) } };
  const commitment = { id: "c", title: "Paint", createdAt: "2026-11-23T00:00:00.000Z" };
  const quest = { id: "q", commitmentId: "c", title: "Choose paint", reason: "Start", minutes: 5,
    planner: "sample" as const, status: "proposed" as const, sourceIds: ["c"] };
  const saved = reduce(state, { type: "accept-planned-quest", commitment, quest, memorySnapshot: [] });
  expect(saved.quests[0].status).toBe("accepted");
  expect(saved.chat.messages).toHaveLength(200);
});
