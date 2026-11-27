import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { FittedFaceCostume } from "./FittedFaceCostume";
import { faceCostumePlacement } from "./faceCostumePlacement";
import { fittedFrames } from "./poseFrames";

describe("face costume registration", () => {
  it.each(["britney", "goth", "egirl"])("folds the %s skirt before the compact frame", (id) => {
    for (const [frame, fit] of [["sit-05", "standing"], ["sit-06", "folding"], ["sit-07", "compact"]] as const) {
      const art = renderToStaticMarkup(<FittedFaceCostume id={id} frame={frame} peak={false} />);
      expect(art).toContain('data-stage-fit="' + fit + '"');
    }
  });

  it("folds the White House side wing through a separate frame on the way to sitting", () => {
    const frames = [["sit-05", "wide"], ["sit-06", "folding"], ["sit-07", "compact"],
      ["sitting", "compact"]] as const;
    for (const [frame, fit] of frames) {
      const art = renderToStaticMarkup(<FittedFaceCostume id="white-house" frame={frame} peak={false} />);
      expect(art).toContain('data-house-fit="' + fit + '"');
    }
  });

  it("replaces the spa towel and cucumber slices independently while keeping its robe", () => {
    const withoutTowel = renderToStaticMarkup(<FittedFaceCostume id="spa" frame="standing" peak={false} showHat={false} />);
    const withoutSlices = renderToStaticMarkup(<FittedFaceCostume id="spa" frame="standing" peak={false} showGlasses={false} />);
    expect(withoutTowel).not.toContain("#6e566e");
    expect(withoutTowel).toContain("#486b47");
    expect(withoutSlices).toContain("#6e566e");
    expect(withoutSlices).not.toContain("#486b47");
    for (const spa of [withoutTowel, withoutSlices]) expect(spa).toContain("#e8ddeb");
  });
  it("tracks the nose landmark through both posture transitions", () => {
    const frames = ["standing", ...fittedFrames, "sitting", "loaf-bend", "loaf-tuck", "loaf-idle",
      "sleep-drowsy", "sleep-doze", "sleeping", "wake-ear", "wake-eyes"] as const;
    expect(frames.map((frame) => faceCostumePlacement(frame).y))
      .toEqual([32, 32, 32, 31, 31, 30, 30, 29, 32, 36, 39, 39, 40, 41, 41, 40]);
  });

  it("keeps the hair in place when the standing muzzle changes expression", () => {
    for (const [frame, y] of [["standing", 32], ["happy", 33], ["tired", 35]] as const) {
      expect(faceCostumePlacement(frame)).toEqual({ x: 20, y, headY: 0 });
    }
  });

  it("uses the walking atlas's face coordinates once without double-counting clip offsets", () => {
    const html = renderToStaticMarkup(<FittedFaceCostume id="mustache" frame="standing" peak={false}
      motion={{ walkFrame: 7, headX: 1, headY: -3 }} />);
    expect(html).toContain('translate(0 0)');
    expect(html).toContain('translate(22 29)');
  });
});

it.each([
  ["shrimp", "#82444b", "#b95a5b"],
  ["wonder-bread", "#675888", "#cb4c53"],
  ["chicken-nugget", "#fbc35d", "#df962e"],
  ["omen", "#78d9ec", "#4b3e64"],
  ["killjoy", "#30463d", "#eeb84e"],
  ["christmas-present", "#692d38", "#bb3d3d"],
  ["maple-leaf", "#ed775b", "#cb4846"],
  ["bibble", "#f5c2dc", "#91b9d9"],
  ["fungus", "#cf729d", "#d789ac"],
  ["bush", "#3f5036", "#3e5138"],
  ["soju", "#a0c074", "#689553"],
  ["white-house", "#b75853", "#d3c6b5"],
  ["elmo", "#fff0d8", "#d34946"],
  ["trojan", "#daa75c", "#a47547"],
  ["ahri", "#e3b86a", "#752f48"],
  ["teemo", "#71834d", "#86734e"],
  ["britney", "#daa267", "#766f80"],
  ["goth", "#766078", "#524353"],
  ["egirl", "#dc84a8", "#62455f"],
])("keeps %s clothing while giving a separately equipped hat precedence", (id, headColor, bodyColor) => {
  const html = renderToStaticMarkup(<FittedFaceCostume id={id} frame="standing" peak={false} showHat={false} />);
  const withoutSeparateHat = renderToStaticMarkup(<FittedFaceCostume id={id} frame="standing" peak={false} />);
  expect(withoutSeparateHat).toContain(headColor);
  expect(html).not.toContain(headColor);
  expect(html).toContain(bodyColor);
});
