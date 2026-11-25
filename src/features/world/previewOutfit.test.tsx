import { expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { previewOutfit } from "./previewOutfit";
import { WardrobePanel } from "./WardrobePanel";

const fixture = vi.hoisted(() => ({ state: {} as ReturnType<typeof initialState> }));
vi.mock("../../state/store", () => ({ useInova: () => fixture.state, dispatch: vi.fn() }));
vi.mock("../companion/DogSprite", () => ({ DogSprite: () => <span>Dog</span> }));

it("previews one locked item without changing ownership or worn items", () => {
  const state = initialState();
  const original = structuredClone(state);
  const preview = previewOutfit(state.equipment, "cap");
  expect(preview.hat).toBe("cap");
  expect(state).toEqual(original);
  expect(state.ownedItems).not.toContain("cap");
  expect(previewOutfit(state.equipment, null)).toEqual(state.equipment);
});

it("lets the user try locked items while keeping their wear action locked", () => {
  fixture.state = initialState();
  const html = renderToStaticMarkup(<WardrobePanel />);
  expect(html).toContain('aria-label="Try on Trail cap"');
  expect(html).toMatch(/aria-label="Trail cap locked"[^>]*disabled/);
  expect(html).not.toContain("Developer wardrobe scenarios");
});
