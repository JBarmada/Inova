import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { prepareQuest } from "../../services/prepareQuest";
import { QuestDetailsReview } from "./QuestDetailsReview";

it("asks for a time when only a date was suggested", async () => {
  const draft = await prepareQuest("Paint by Friday", initialState(), async () => { throw Error("offline"); });
  const markup = renderToStaticMarkup(<QuestDetailsReview draft={{ ...draft, details: { deadlineDate: "2026-11-27" } }}
    onSave={async () => {}} onCancel={() => {}} />);
  expect(markup).toContain("Sample quest");
  expect(markup).toContain('type="date"');
  expect(markup).toContain('value="2026-11-27"');
  expect(markup).toContain('type="time"');
  expect(markup).not.toContain('type="datetime-local"');
});

it("shows proposed text for review before saving, with optional details collapsed", async () => {
  const draft = await prepareQuest("Start drawing", initialState(), async () => { throw Error("offline"); });
  const markup = renderToStaticMarkup(<QuestDetailsReview draft={draft} onSave={async () => {}} onCancel={() => {}} />);
  expect(markup).toContain(draft.quest.title);
  expect(markup).toContain(draft.quest.reason);
  expect(markup).toContain("Sample quest");
  expect(markup).toContain("<details><summary>Deadline and effort</summary>");
  expect(markup).toContain("Add quest");
  expect(markup).not.toContain("Memories included");
});

it("lets a user inspect the exact permitted memories included in a suggestion", async () => {
  const state = initialState();
  state.memories = [{ id: "allowed", text: "Painting helps me relax", aiAllowed: true, createdAt: "2026-11-23T00:00:00.000Z" },
    { id: "private", text: "A private thought", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" }];
  const draft = await prepareQuest("Start painting", state, async () => { throw Error("offline"); });
  const markup = renderToStaticMarkup(<QuestDetailsReview draft={draft} onSave={async () => {}} onCancel={() => {}} />);
  expect(markup).toContain("Memories included (1)");
  expect(markup).toContain("Painting helps me relax");
  expect(markup).not.toContain("A private thought");
});
