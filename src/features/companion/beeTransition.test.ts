import { expect, it } from "vitest";
import { costumeMotion } from "./costumeMotion";
import { clipTiming, type DogClip } from "./dogClips";
import { fittedFrames } from "./poseFrames";

const clip = (id: DogClip, index = 0, elapsed = 0) => ({ clip: id, index, elapsed, demo: true });

it("uses a single ordered costume pose in both directions", () => {
  expect(["standing", ...fittedFrames, "sitting"].map((frame) =>
    costumeMotion(frame as (typeof fittedFrames)[number] | "standing" | "sitting", null, false).pose))
    .toEqual(["standing", "standing", "standing", "standing", "sitting", "sitting", "sitting", "sitting"]);
  expect(["loaf-tuck", "loaf-bend", "sitting"].map((_, index) =>
    costumeMotion("loaf-tired", clip("07a-loaf-to-sit", index + 1), false).pose))
    .toEqual(["loaf", "sitting", "sitting"]);
});

it("keeps the current posture during greeting, celebration, and bark", () => {
  expect(costumeMotion("sitting-happy", clip("11a-happy-greeting"), false).pose).toBe("sitting");
  expect(costumeMotion("loaf-happy", clip("14-unlock-celebration"), false).pose).toBe("loaf");
  const marker = clipTiming["12-single-bark"].markers.bark;
  expect(costumeMotion("sitting", clip("12-single-bark", 2, marker), false)).toMatchObject({ pose: "sitting", bark: true });
  expect(costumeMotion("sitting", clip("12-single-bark"), false).bark).toBe(false);
});
