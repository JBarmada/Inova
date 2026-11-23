import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DogSprite } from "./DogSprite";
import { dogArt, dogFrame } from "./dogArt";
import { wearableAnchors } from "./wearableAnchors";
import { wardrobeScenarios } from "../../shared/wardrobeScenarios";
import { initialState } from "../../state/defaults";
import { fittedFrames } from "./poseFrames";

beforeEach(() => vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) }));
afterEach(() => vi.unstubAllGlobals());

describe("wearable presentation and pose contracts", () => {
  it("renders every full outfit slot on every supported frame", () => {
    for (const pose of ["standing", "tucking", ...fittedFrames, "sitting"] as const) {
      for (const scenario of wardrobeScenarios.slice(0, 2)) {
        const state = { ...initialState(), equipment: scenario.equipment };
        const html = renderToStaticMarkup(<DogSprite state={state} pose={pose} />);
        expect(html).toContain(`data-pose="${pose}"`);
        expect(html.match(/data-slot=/g)).toHaveLength(4);
        for (const id of Object.values(scenario.equipment)) expect(html).toContain(`data-item="${id}"`);
        expect(html).toContain("wearing");
        expect(html).toContain(dogArt[pose]);
      }
    }
  });
  it("puts head layers at the shifted head and socks on each pose's visible paws", () => {
    const standing = wearableAnchors("standing");
    const sitting = wearableAnchors("sitting");
    const tuck = wearableAnchors("tucking");
    expect(sitting.hat[0].y).toBe(standing.hat[0].y - 3);
    expect(tuck.glasses[0].y).toBe(standing.glasses[0].y - 2);
    expect(standing.socks.map((p) => p.x + 2)).toEqual([18, 27, 35, 44]);
    expect(sitting.socks.map((p) => p.x + 2)).toEqual([12, 18, 24, 30]);
    expect(tuck.socks).toHaveLength(3);
    for (const frame of Object.keys(dogArt) as (keyof typeof dogArt)[]) {
      for (const placements of Object.values(wearableAnchors(frame))) {
        for (const p of placements) {
          expect(p.x).toBeGreaterThanOrEqual(0);
          expect(p.y).toBeGreaterThanOrEqual(0);
          expect(p.x + p.width).toBeLessThanOrEqual(64);
          expect(p.y + p.height).toBeLessThanOrEqual(64);
        }
      }
    }
  });
  it("uses the actual mood frame for anchors and omits empty slots", () => {
    expect(dogFrame("happy", "sitting")).toBe("sitting-happy");
    expect(dogFrame("tired", "sitting")).toBe("sitting-tired");
    for (const frame of ["sitting-blink", "sitting-drowsy", "sitting-tired", "sitting-happy"] as const) {
      expect(wearableAnchors(frame)).toEqual(wearableAnchors("sitting"));
    }
    for (const mood of ["happy", "tired"] as const) {
      const state = initialState();
      state.pet.mood = mood;
      expect(renderToStaticMarkup(<DogSprite state={state} pose="sitting" />)).toContain(dogArt[`sitting-${mood}`]);
    }
    expect(wearableAnchors("loaf-tired").socks).toEqual([]);
    const empty = renderToStaticMarkup(<DogSprite state={initialState()} pose="sitting" />);
    expect(empty).not.toContain("data-slot=");
    const state = { ...initialState(), equipment: wardrobeScenarios[2].equipment };
    const html = renderToStaticMarkup(<DogSprite state={state} />);
    expect(html).not.toContain('data-slot="hat"');
    expect(html.match(/data-slot=/g)).toHaveLength(3);
    expect(html.indexOf('data-slot="body"')).toBeLessThan(html.indexOf('data-slot="glasses"'));
  });
});
