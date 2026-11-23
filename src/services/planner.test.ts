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

it("uses an explicit maximum for later samples and allows it to be cleared", async () => {
  const commitment = { id: "c", title: "Fictional task", createdAt: "2026-11-23T00:00:00.000Z" };
  const state = { ...initialState(), commitments: [commitment] };
  const limited = reduce(state, { type: "quest-minute-limit", minutes: 5 });
  const short = await proposeSample(commitment, limited);
  expect(short.quest.minutes).toBe(5);
  const proposed = reduce(limited, { type: "propose-quest", ...short });
  expect(reduce(proposed, { type: "edit-quest", id: short.quest.id, title: short.quest.title, minutes: 20 }).quests[0].minutes).toBe(20);
  const noLimit = reduce(limited, { type: "quest-minute-limit", minutes: 0 });
  const priorDraft = (await proposeSample(commitment, noLimit)).quest;
  expect(priorDraft.minutes).toBe(10);
  expect(() => reduce(limited, { type: "propose-quest", quest: priorDraft })).toThrow("length limit");
  expect(() => reduce(state, { type: "quest-minute-limit", minutes: 121 })).toThrow();
});
