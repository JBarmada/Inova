import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryFilters } from "./MemoryCategories";
import { initialState } from "../../state/defaults";
import { reduce } from "../../state/reducer";
import { stateSchema } from "../../shared/schema";

it("renders five accessible named filters with the current selection exposed", () => {
  const html = renderToStaticMarkup(<MemoryFilters value="people" onChange={() => {}} />);
  for (const name of ["All", "People", "Events", "You", "Misc"]) expect(html).toContain(`aria-label="${name}"`);
  expect(html).toContain('aria-label="People" aria-pressed="true"');
});

it("persists category changes without changing memory text or personalization permission", () => {
  const memory = { id: "m", text: "Alex likes tea", aiAllowed: false, createdAt: "2026-11-23T00:00:00.000Z" };
  const original = reduce(initialState(), { type: "add-memory", memory });
  const changed = reduce(original, { type: "memory-category", id: "m", category: "people" });
  const restored = stateSchema.parse(JSON.parse(JSON.stringify(changed)));
  expect(restored.memories[0]).toEqual({ ...memory, category: "people" });
  expect(() => reduce(restored, { type: "memory-category", id: "missing", category: "you" })).toThrow("no longer exists");
});
