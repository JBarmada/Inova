import { afterEach, expect, it, vi } from "vitest";
import { createPosePlayback, FITTED_DURATION, TIRED_LOAF_DELAY, TIRED_FACE_DURATION, type DogPose } from "./posePlayback";
import { LOAF_FRAME_MS } from "./poseFrames";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });
const deadline = TIRED_FACE_DURATION + TIRED_LOAF_DELAY;
function seatedTired() {
  vi.useFakeTimers();
  const shown: DogPose[] = [];
  const playback = createPosePlayback((pose) => shown.push(pose), false);
  playback.sit();
  vi.advanceTimersByTime(FITTED_DURATION);
  playback.setMood("tired");
  return { shown, playback };
}

it.each(["idle", "happy"] as const)("cancels the loaf deadline on %s and restarts when tired again", (mood) => {
  const { shown, playback } = seatedTired();
  vi.advanceTimersByTime(deadline - 1);
  playback.setMood(mood);
  vi.advanceTimersByTime(60_000);
  expect(shown.at(-1)).toBe("sitting");
  playback.setMood("tired");
  vi.advanceTimersByTime(deadline - 1);
  expect(shown.at(-1)).toBe("sitting");
  vi.advanceTimersByTime(1);
  expect(shown.at(-1)).toBe("loaf-bend");
  playback.dispose();
});

it("completes a lowering transition despite changing mood, without falling asleep", () => {
  const { shown, playback } = seatedTired();
  vi.advanceTimersByTime(deadline);
  playback.setMood("happy");
  vi.advanceTimersByTime(2 * LOAF_FRAME_MS);
  playback.setMood("idle");
  vi.advanceTimersByTime(60_000);
  expect(shown.slice(-3)).toEqual(["loaf-bend", "loaf-tuck", "loaf"]);
  playback.dispose();
});

it("settles at loaf when reduced motion is enabled mid-transition", () => {
  const { shown, playback } = seatedTired();
  vi.advanceTimersByTime(deadline);
  playback.setReducedMotion(true);
  expect(shown.slice(-2)).toEqual(["loaf-bend", "loaf"]);
  playback.dispose();
});

it.each([-1, 0])("cancels stale loaf callbacks on disposal at deadline %+i", (offset) => {
  const { shown, playback } = seatedTired();
  vi.advanceTimersByTime(deadline + offset);
  const count = shown.length;
  playback.dispose();
  vi.advanceTimersByTime(60_000);
  expect(shown).toHaveLength(count);
});
