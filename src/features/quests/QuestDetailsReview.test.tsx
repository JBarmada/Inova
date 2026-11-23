import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { prepareQuest } from "../../services/prepareQuest";
import { QuestDetailsReview } from "./QuestDetailsReview";

it("asks for a time when only a date was suggested", async () => {
  const draft = await prepareQuest("Paint by Friday", initialState(), async () => { throw Error("offline"); });
  const markup = renderToStaticMarkup(<QuestDetailsReview draft={{ ...draft, details: { deadlineDate: "2026-11-27" } }}
    onSave={async () => {}} onCancel={() => {}} />);
  expect(markup).toContain('type="date"');
  expect(markup).toContain('value="2026-11-27"');
  expect(markup).toContain('type="time"');
  expect(markup).not.toContain('type="datetime-local"');
});
