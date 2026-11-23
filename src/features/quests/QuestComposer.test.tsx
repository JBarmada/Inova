import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { QuestComposer, needsQuestReview } from "./QuestComposer";
import { ToyComposer } from "../companion/ToyComposer";
import { prepareQuest } from "../../services/prepareQuest";

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

it("explains why quest creation is unavailable before adoption", () => {
  const markup = renderToStaticMarkup(<QuestComposer state={initialState()} />);
  expect(markup).toContain("Adopt your dog to start a quest.");
  expect(markup).toMatch(/<button[^>]*disabled/);
});

it("requires review before saving an offline sample even without detected details", async () => {
  const draft = await prepareQuest("Start drawing", initialState(), async () => { throw Error("offline"); });
  expect(draft.fallback).toBe(true);
  expect(draft.detailsWarning).toBe(false);
  expect(needsQuestReview(draft)).toBe(true);
});
