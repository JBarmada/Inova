import { expect, it } from "vitest";
import type { Quest } from "../../shared/schema";
import { adventureTitle, toyQuests } from "./toyQuests";

function quest(id: string, status: Quest["status"]): Quest {
  return { id, status, commitmentId: "c", title: id, reason: "Test", sourceIds: ["c"], minutes: 10, planner: "sample" };
}

it("lists newest quests first across statuses without mutating saved order", () => {
  const source = [quest("one", "accepted"), quest("two", "proposed"), quest("three", "deferred"), quest("hidden", "dismissed")];
  const before = structuredClone(source);
  const rows = toyQuests(source);
  expect(rows.map((entry) => entry.id)).toEqual(["three", "two", "one"]);
  expect(source).toEqual(before);
});

it("keeps newly added quests above older ones after accepting or completing them", () => {
  const source = [quest("older", "proposed"), quest("newer", "proposed")];
  for (const status of ["proposed", "accepted", "completed"] as const) {
    source[1] = { ...source[1], status };
    expect(toyQuests(source).map((entry) => entry.id)).toEqual(["newer", "older"]);
  }
});

it("keeps completed adventures and removes mechanical wording from legacy titles", () => {
  expect(toyQuests([quest("done", "completed")])).toHaveLength(1);
  expect(adventureTitle("Spend 10 minutes starting: My project")).toBe("First pawsteps: My project");
});
