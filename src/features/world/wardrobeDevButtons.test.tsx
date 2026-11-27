import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { initialState } from "../../state/defaults";
import { items } from "../../shared/catalog";
import type { AppState } from "../../shared/schema";

const fake = vi.hoisted(() => ({ state: undefined as AppState | undefined }));
vi.mock("../../state/store", () => ({ useInova: () => fake.state, dispatch: vi.fn() }));
import { WardrobePanel } from "./WardrobePanel";

beforeEach(() => vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) }));
afterEach(() => vi.unstubAllGlobals());

it("only exposes item unlock controls in Dev mode and hides them for owned items", () => {
  const initial = initialState();
  fake.state = initial;
  const normal = renderToStaticMarkup(<WardrobePanel />);
  expect(normal).not.toContain(">Dev unlock</button>");
  expect(normal).not.toContain("Play or replay walk");
  fake.state = { ...initial, ownedItems: ["bee"], settings: { ...initial.settings, devMode: true } };
  const html = renderToStaticMarkup(<WardrobePanel />);
  expect((html.match(/>Dev unlock<\/button>/g) ?? [])).toHaveLength(items.length - 1);
  expect(html).toContain("Busy bee");
  expect(html).toContain("Play or replay walk");
});
