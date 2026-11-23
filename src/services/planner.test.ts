import { expect, it } from "vitest";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { proposeSample } from "./planner";

it("rejects a sample proposal if its permitted reflection changes before saving", async () => {
  const commitment = { id: "c", title: "Fictional task", createdAt: "2026-11-23T00:00:00.000Z" };
  const memory = { id: "m", text: "An old reflection", createdAt: commitment.createdAt, aiAllowed: true };
  const state = { ...initialState(), commitments: [commitment], memories: [memory] };
  const proposal = await proposeSample(commitment, state);
  expect(reduce(state, { type: "propose-quest", ...proposal }).quests).toHaveLength(1);
  expect(() => reduce(state, { type: "propose-quest", quest: proposal.quest })).toThrow("evidence is incomplete");
  const edited = reduce(state, { type: "edit-memory", id: "m", text: "Changed reflection" });
  expect(() => reduce(edited, { type: "propose-quest", ...proposal })).toThrow("changed");
  const revoked = reduce(state, { type: "memory-permission", id: "m", allowed: false });
  expect(() => reduce(revoked, { type: "propose-quest", ...proposal })).toThrow("changed");
  const deleted = reduce(state, { type: "delete-memory", id: "m" });
  expect(() => reduce(deleted, { type: "propose-quest", ...proposal })).toThrow("changed");
});
