import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { QuestComposer } from "./QuestComposer";
import { ToyComposer } from "../companion/ToyComposer";

it("offers the same single quest input in both layouts", () => {
  const state = initialState();
  state.pet.adopted = true;
  for (const markup of [renderToStaticMarkup(<QuestComposer state={state} />), renderToStaticMarkup(<ToyComposer state={state} />)]) {
    expect(markup.match(/<input\b/g)).toHaveLength(1);
    expect(markup).toContain('aria-label="Your next adventure"');
    expect(markup).toContain('aria-label="Make a quest"');
    expect(markup).not.toMatch(/Ollama|local model|deadline/i);
  }
});
