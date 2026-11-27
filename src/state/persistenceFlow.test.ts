import { afterEach, expect, it, vi } from "vitest";
import { loadState, saveState } from "../services/storage";
import { samplePlanner } from "../services/planner";
import { initialState } from "./defaults";
import { reduce } from "./reducer";

vi.mock("@tauri-apps/api/core", () => ({ isTauri: () => false }));
afterEach(() => vi.unstubAllGlobals());

it("keeps rewards and memory permissions across browser storage reloads", async () => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  });
  const commitment = { id: "c", title: "Plan a nature walk", createdAt: "2026-11-23T00:00:00.000Z" };
  const memory = { id: "m", text: "Short walks help", createdAt: commitment.createdAt, aiAllowed: true };
  let state = reduce(initialState(), { type: "add-commitment", commitment });
  state = reduce(state, { type: "add-memory", memory });
  const quest = await samplePlanner.propose(commitment, state);
  state = reduce(state, { type: "propose-quest", quest, memorySnapshot: [{ id: memory.id, text: memory.text }] });
  state = reduce(state, { type: "quest-status", id: quest.id, status: "accepted" });
  state = reduce(state, { type: "complete-quest", id: quest.id });
  await saveState(state);
  state = (await loadState())!;
  state = reduce(state, { type: "complete-quest", id: quest.id });
  expect(state.rewardedQuestIds).toEqual([quest.id]);
  expect(state.ownedItems).toEqual(["notebook", "lorax"]);
  state = reduce(state, { type: "memory-permission", id: memory.id, allowed: false });
  await saveState(state);
  state = (await loadState())!;
  expect((await samplePlanner.propose(commitment, state)).sourceIds).toEqual([commitment.id]);
  expect(state.quests[0].reason).not.toContain(memory.text);
  state = reduce(state, { type: "delete-memory", id: memory.id });
  await saveState(state);
  state = (await loadState())!;
  expect(state.memories).toEqual([]);
  expect(state.quests[0].sourceIds).not.toContain(memory.id);
});
