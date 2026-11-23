import { expect, it } from "vitest";
import type { Quest } from "../../shared/schema";
import { adventureTitle, toyQuests } from "./toyQuests";

function quest(id: string, status: Quest["status"]): Quest {
  return { id, status, commitmentId: "c", title: id, reason: "Test", sourceIds: ["c"], minutes: 10, planner: "sample" };
}

it("lists every active quest and keeps the original state order untouched", () => {
  const source = [quest("one", "accepted"), quest("two", "proposed"), quest("three", "deferred"), quest("hidden", "dismissed")];
  const rows = toyQuests(source);
  expect(rows.map((entry) => entry.id)).toEqual(["two", "one", "three"]);
  expect(source[0].id).toBe("one");
});

it("keeps completed adventures and removes mechanical wording from legacy titles", () => {
  expect(toyQuests([quest("done", "completed")])).toHaveLength(1);
  expect(adventureTitle("Spend 10 minutes starting: My project")).toBe("First pawsteps: My project");
});
