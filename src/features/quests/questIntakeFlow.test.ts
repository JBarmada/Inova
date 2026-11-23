import { expect, it, vi } from "vitest";
import type { invoke } from "@tauri-apps/api/core";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { prepareQuest } from "../../services/prepareQuest";
import { proposeLocal } from "../../services/localPlanner";
import { reviewQuestDetails } from "./reviewQuestDetails";

it("plans, reviews, and saves a sourced quest from a single fictional entry", async () => {
  const state = initialState();
  state.memories.push({ id: "m", text: "Writing goes better in short sessions", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" });
  const call = vi.fn().mockResolvedValue(JSON.stringify({ title: "Start writing", reason: "Begin with a small step", minutes: 30,
    deadlineLocal: "2026-11-27T17:00", deadlineEvidence: "Friday at 5pm", effortMinutes: 20, effortEvidence: "20 minutes" }));
  const draft = await prepareQuest("Write by Friday at 5pm, 20 minutes total", state,
    (commitment, current) => proposeLocal(commitment, current, call as unknown as typeof invoke));
  expect(draft.details).toEqual({ deadlineLocal: "2026-11-27T17:00", effortMinutes: 20 });
  const reviewed = reviewQuestDetails(draft, draft.details!.deadlineLocal!, "20");
  const saved = reduce(state, { type: "add-planned-quest", ...reviewed });
  expect(saved.commitments[0].effortMinutes).toBe(20);
  expect(saved.commitments[0].deadline?.at).toBe(new Date("2026-11-27T17:00").toISOString());
  expect(saved.quests[0]).toMatchObject({ minutes: 20, status: "proposed", planner: "local", sourceIds: [saved.commitments[0].id, "m"] });
  expect(() => reduce(saved, { type: "add-planned-quest", ...reviewed })).toThrow("already exists");
});
