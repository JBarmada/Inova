import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { QuestSources } from "./QuestSources";
import type { Quest } from "../../shared/schema";

it("shows only linked permitted reflections and removes them when permission is revoked", () => {
  const state = { ...initialState(), commitments: [{ id: "c", title: "Fictional goal", createdAt: "2026-11-23T00:00:00.000Z" }],
    memories: [
      { id: "m1", text: "Breaks helped", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" },
      { id: "m2", text: "Private entry", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" },
      { id: "m3", text: "Unlinked entry", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" },
    ] };
  const quest: Quest = { id: "q", commitmentId: "c", title: "A step", reason: "Try it", minutes: 10,
    sourceIds: ["c", "m1"], status: "proposed", planner: "local" };
  const before = renderToStaticMarkup(<QuestSources state={state} quest={quest} />);
  expect(before).toContain("Fictional goal");
  expect(before).toContain("Breaks helped");
  expect(before).not.toContain("Private entry");
  expect(before).not.toContain("Unlinked entry");
  const revoked = reduce({ ...state, quests: [quest] }, { type: "memory-permission", id: "m1", allowed: false });
  const after = renderToStaticMarkup(<QuestSources state={revoked} quest={revoked.quests[0]} />);
  expect(after).not.toContain("Breaks helped");
  expect(after).toContain("No reflections currently linked");
});
