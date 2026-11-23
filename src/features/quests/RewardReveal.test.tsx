import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { RewardReveal } from "./RewardReveal";

vi.mock("../../state/store", () => ({ useInova: () => initialState(), dispatch: vi.fn() }));

it("offers an optional private-by-default reflection only after a saved completion", () => {
  const result = { questId: "q", title: "Fictional quest", completed: true, unlocked: [] };
  const completed = renderToStaticMarkup(<RewardReveal result={result} />);
  expect(completed).toContain("Add an optional reflection");
  expect(completed).toContain("Allow this entry to inform suggestions");
  expect(completed).not.toContain('checked=""');
  const duplicate = renderToStaticMarkup(<RewardReveal result={{ ...result, completed: false }} />);
  expect(duplicate).not.toContain("Add an optional reflection");
});
