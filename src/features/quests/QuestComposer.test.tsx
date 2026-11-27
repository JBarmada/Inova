import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { QuestComposer } from "./QuestComposer";
import { ToyComposer } from "../companion/ToyComposer";

it("uses the shared conversation in the floating toy", () => {
  const state = initialState(); state.pet.adopted = true;
  const markup = renderToStaticMarkup(<ToyComposer state={state} />);
  expect(markup).toContain('aria-label="Message your dog"');
  expect(markup).not.toContain('aria-label="Your next adventure"');
  expect(markup).not.toContain("Use sample instead");
});

it("explains why quest creation is unavailable before adoption", () => {
  const markup = renderToStaticMarkup(<QuestComposer state={initialState()} />);
  expect(markup).toContain("Adopt your dog to start a quest.");
  expect(markup).toMatch(/<button[^>]*disabled/);
});

