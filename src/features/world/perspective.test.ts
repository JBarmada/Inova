import { expect, it } from "vitest";
import { emptyPerspective, formatPerspective } from "./perspective";

it("saves only the person's own nonempty thoughts with their prompts", () => {
  const draft = { ...emptyPerspective(), situation: "  A fictional conversation  ", alternative: "Maybe they were busy." };
  expect(formatPerspective(draft)).toBe("Perspective exercise\n\nWhat is the situation, as you see it?\nA fictional conversation\n\nWhat is another possible perspective?\nMaybe they were busy.");
  expect(draft.situation).toBe("  A fictional conversation  ");
});

it("does not save an empty exercise", () => {
  expect(() => formatPerspective({ ...emptyPerspective(), evidence: "  " })).toThrow("Write at least one thought");
});
