import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { BoneQuestToy } from "./BoneQuestToy";

vi.mock("./useToyExpansion", () => ({ useToyExpansion: () => ({
  phase: "open", open: true, mounted: true, button: { current: null }, panel: { current: null },
  expand: vi.fn(), collapse: vi.fn(),
}) }));
vi.mock("./ToyComposer", () => ({ ToyComposer: () => <div>Composer</div> }));

it("keeps the expanded board free of close/minimize controls in normal and developer modes", () => {
  for (const devMode of [false, true]) {
    const state = initialState();
    state.settings.devMode = devMode;
    const markup = renderToStaticMarkup(<BoneQuestToy state={state} />);
    const board = markup.split('id="toy-quest-board"')[1];
    expect(board).toBeDefined();
    expect(board).not.toContain("<button");
    expect(markup).not.toMatch(/aria-label="[^"]*(?:minimize|close|collapse)/i);
  }
});
