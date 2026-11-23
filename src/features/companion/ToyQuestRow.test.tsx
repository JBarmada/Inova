import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { Quest } from "../../shared/schema";
import { ToyQuestRow } from "./ToyQuestRow";

it("shows a saved plan on an accepted floating quest without inventing one", () => {
  const quest: Quest = { id: "q", commitmentId: "c", title: "Fictional quest", reason: "Start", minutes: 5,
    sourceIds: ["c"], status: "accepted", planner: "sample" };
  const plain = renderToStaticMarkup(<ToyQuestRow quest={quest} busy={false} onAction={vi.fn()} />);
  expect(plain).not.toContain("Planned");
  const planned: Quest = { ...quest, plan: { start: "2026-12-01T21:00:00.000Z", end: "2026-12-01T21:05:00.000Z",
    availableUntil: "2026-12-01T21:30:00.000Z", recordedAt: "2026-11-23T00:00:00.000Z", timeZone: "America/Los_Angeles" } };
  const markup = renderToStaticMarkup(<ToyQuestRow quest={planned} busy={false} onAction={vi.fn()} />);
  expect(markup).toContain("Planned");
  expect(markup).toContain("America/Los_Angeles");
  expect(markup).toContain("Complete quest: Fictional quest");
});
