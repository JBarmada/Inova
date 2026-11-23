import { describe, expect, it } from "vitest";
import { initialState } from "./defaults";
import { reduce } from "./reducer";
import { samplePlanner } from "../services/planner";
import type { AppState, Quest } from "../shared/schema";

function fixture(): AppState {
  return { ...initialState(), commitments: [{ id: "c1", title: "Outline project", createdAt: "2026-11-23T01:00:00.000Z" }] };
}

function quest(id = "q1"): Quest {
  return { id, commitmentId: "c1", title: "Draft an outline", reason: "Start small", minutes: 10, sourceIds: ["c1"], status: "proposed", planner: "sample" };
}

function complete(state: AppState, id: string): AppState {
  const proposed = reduce(state, { type: "propose-quest", quest: quest(id) });
  const accepted = reduce(proposed, { type: "quest-status", id, status: "accepted" });
  return reduce(accepted, { type: "complete-quest", id });
}

describe("shared domain agreements", () => {
  it("rewards accepted quests exactly once and preserves earned items", () => {
    const first = complete(fixture(), "q1");
    const duplicate = reduce(first, { type: "complete-quest", id: "q1" });
    expect(duplicate.rewardedQuestIds).toEqual(["q1"]);
    expect(duplicate.ownedItems).toEqual(["notebook"]);
    expect(complete(complete(duplicate, "q2"), "q3").ownedItems).toContain("bandana");
  });

  it("does not reward unaccepted, deferred, or dismissed quests", () => {
    const state = reduce(fixture(), { type: "propose-quest", quest: quest() });
    for (const status of ["proposed", "deferred", "dismissed"] as const) {
      const candidate = { ...state, quests: [{ ...quest(), status }] };
      expect(reduce(candidate, { type: "complete-quest", id: "q1" }).ownedItems).toEqual([]);
    }
  });

  it("rejects locked equipment and empty adoption names", () => {
    expect(() => reduce(fixture(), { type: "equip", item: "bandana" })).toThrow("locked");
    expect(() => reduce(fixture(), { type: "adopt", name: " " })).toThrow();
  });

  it("rejects fabricated source references", () => {
    expect(() => reduce(fixture(), { type: "propose-quest", quest: { ...quest(), sourceIds: ["c1", "fake"] } })).toThrow("evidence");
    expect(() => reduce(fixture(), { type: "propose-quest", quest: { ...quest(), sourceIds: [] } })).toThrow("commitment");
  });

  it("excludes private memories and forgets revoked/deleted references", async () => {
    let state = fixture();
    const memory = { id: "m1", text: "Short sessions help", createdAt: "2026-11-23T01:00:00.000Z", aiAllowed: false };
    state = reduce(state, { type: "add-memory", memory });
    expect((await samplePlanner.propose(state.commitments[0], state)).sourceIds).toEqual(["c1"]);
    state = reduce(state, { type: "memory-permission", id: "m1", allowed: true });
    const draft = await samplePlanner.propose(state.commitments[0], state);
    expect(draft.sourceIds).toContain("m1");
    state = reduce(state, { type: "propose-quest", quest: draft, memorySnapshot: [{ id: memory.id, text: memory.text }] });
    const revoked = reduce(state, { type: "memory-permission", id: "m1", allowed: false });
    expect(revoked.quests[0].reason).not.toContain(memory.text);
    state = reduce(state, { type: "delete-memory", id: "m1" });
    expect(state.memories).toEqual([]);
    expect((await samplePlanner.propose(state.commitments[0], state)).sourceIds).toEqual(["c1"]);
    expect(state.quests[0].sourceIds).not.toContain("m1");
  });
});

it("enforces total effort when saving a proposed quest", () => {
  const state = fixture();
  const commitment = { ...state.commitments[0], effortMinutes: 5 };
  const withEffort = { ...state, commitments: [commitment] };
  expect(() => reduce(withEffort, { type: "propose-quest", quest: quest() })).toThrow("total effort");
  expect(reduce(withEffort, { type: "propose-quest", quest: { ...quest(), minutes: 5 } }).quests).toHaveLength(1);
  expect(() => reduce(state, { type: "add-planned-quest", commitment: { ...commitment, id: "c2" },
    quest: { ...quest("q2"), commitmentId: "c2", sourceIds: ["c2"] }, memorySnapshot: [] })).toThrow("total effort");
  expect(state.commitments).toHaveLength(1);
});
