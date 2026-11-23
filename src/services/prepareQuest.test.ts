import { expect, it, vi } from "vitest";
import { prepareQuest } from "./prepareQuest";
import { initialState } from "../state/defaults";
import { reduce } from "../state/reducer";
import { proposeSample } from "./planner";

it("uses local planning and saves the commitment and proposal together", async () => {
  const state = initialState();
  const local = vi.fn(async (commitment, current) => ({ ...(await proposeSample(commitment, current)),
    quest: { ...(await proposeSample(commitment, current)).quest, planner: "local" as const } }));
  const result = await prepareQuest("  Write my outline  ", state, local);
  expect(result.fallback).toBe(false);
  const saved = reduce(state, { type: "add-planned-quest", ...result });
  expect(saved.commitments[0].title).toBe("Write my outline");
  expect(saved.quests[0].planner).toBe("local");
  expect(saved.quests[0].commitmentId).toBe(saved.commitments[0].id);
});

it("labels the sample fallback and preserves atomicity if evidence changes", async () => {
  const state = initialState();
  state.memories.push({ id: "m", text: "Take breaks", aiAllowed: true, createdAt: new Date().toISOString() });
  const result = await prepareQuest("Start painting", state, async () => { throw Error("offline"); });
  expect(result.fallback).toBe(true);
  expect(result.quest.planner).toBe("sample");
  const changed = { ...state, memories: [{ ...state.memories[0], aiAllowed: false }] };
  expect(() => reduce(changed, { type: "add-planned-quest", ...result })).toThrow("reflection changed");
  expect(changed.commitments).toHaveLength(0);
  expect(changed.quests).toHaveLength(0);
});
