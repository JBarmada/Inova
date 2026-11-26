import { afterEach, describe, expect, it, vi } from "vitest";
import { createPosePlayback, isResting, LOAF_DELAY, LOAF_STEP_DURATION, TUCK_DURATION, type DogPose } from "./posePlayback";
import { TIRED_FACE_ENTRY_MS } from "./seatedFacePlayback";
import { dogFrame } from "./dogArt";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

const DEADLINE = TIRED_FACE_ENTRY_MS + LOAF_DELAY;

function seatedTired(reduced = false) {
  vi.useFakeTimers();
  const shown: DogPose[] = [];
  const playback = createPosePlayback((pose) => shown.push(pose), reduced);
  playback.sit();
  vi.advanceTimersByTime(reduced ? 0 : TUCK_DURATION);
  playback.setMood("tired");
  return { shown, playback };
}

describe("approved v36 tired sit to loaf", () => {
  it("waits seven seconds after the tired face settles, then plays both breakdowns once", () => {
    const { shown, playback } = seatedTired();
    expect(TIRED_FACE_ENTRY_MS).toBe(2050);
    vi.advanceTimersByTime(DEADLINE - 1);
    expect(shown.at(-1)).toBe("sitting");
    vi.advanceTimersByTime(1);
    expect(shown.at(-1)).toBe("loaf-bend");
    vi.advanceTimersByTime(LOAF_STEP_DURATION);
    expect(shown.at(-1)).toBe("loaf-tuck");
    vi.advanceTimersByTime(LOAF_STEP_DURATION);
    vi.advanceTimersByTime(60_000);
    expect(shown).toEqual(["standing", "tucking", "sitting", "loaf-bend", "loaf-tuck", "loaf"]);
    playback.dispose();
  });

  it("starts the deadline when a tired dog finishes its tuck", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false, "tired");
    playback.sit();
    vi.advanceTimersByTime(TUCK_DURATION + DEADLINE);
    expect(show).toHaveBeenLastCalledWith("loaf-bend");
    playback.dispose();
  });

  it("cancels on idle or happy at the last moment and restarts fresh when tired again", () => {
    for (const mood of ["idle", "happy"] as const) {
      const { shown, playback } = seatedTired();
      vi.advanceTimersByTime(DEADLINE - 1);
      playback.setMood(mood);
      vi.advanceTimersByTime(60_000);
      expect(shown.at(-1)).toBe("sitting");
      playback.setMood("tired");
      vi.advanceTimersByTime(DEADLINE - 1);
      expect(shown.at(-1)).toBe("sitting");
      vi.advanceTimersByTime(1);
      expect(shown.at(-1)).toBe("loaf-bend");
      playback.dispose();
    }
  });

  it("keeps the original deadline through duplicate tired events", () => {
    const { shown, playback } = seatedTired();
    vi.advanceTimersByTime(5_000);
    playback.setMood("tired");
    playback.sit();
    vi.advanceTimersByTime(DEADLINE - 5_000);
    expect(shown.filter((pose) => pose === "loaf-bend")).toHaveLength(1);
    playback.dispose();
  });

  it("cancels on Stand before the deadline and stands directly from loaf", () => {
    const { shown, playback } = seatedTired();
    vi.advanceTimersByTime(DEADLINE - 1);
    playback.stand();
    vi.advanceTimersByTime(60_000);
    expect(shown.at(-1)).toBe("standing");
    playback.sit();
    vi.advanceTimersByTime(TUCK_DURATION + DEADLINE + 2 * LOAF_STEP_DURATION);
    expect(shown.at(-1)).toBe("loaf");
    playback.sit();
    expect(shown.at(-1)).toBe("loaf");
    playback.stand();
    expect(shown.at(-1)).toBe("standing");
    playback.dispose();
  });
});

describe("loaf interruptions, reduced motion and cleanup", () => {
  it("finishes the clip through mood changes and holds loaf afterwards", () => {
    const { shown, playback } = seatedTired();
    vi.advanceTimersByTime(DEADLINE);
    playback.setMood("happy");
    vi.advanceTimersByTime(2 * LOAF_STEP_DURATION);
    playback.setMood("idle");
    vi.advanceTimersByTime(60_000);
    expect(shown.at(-1)).toBe("loaf");
    playback.dispose();
  });

  it("skips the face entry and breakdowns with reduced motion, and on a mid-clip switch", () => {
    const reduced = seatedTired(true);
    vi.advanceTimersByTime(LOAF_DELAY);
    expect(reduced.shown).toEqual(["standing", "sitting", "loaf"]);
    reduced.playback.dispose();
    const { shown, playback } = seatedTired();
    vi.advanceTimersByTime(DEADLINE);
    playback.setReducedMotion(true);
    vi.advanceTimersByTime(60_000);
    expect(shown.slice(-2)).toEqual(["loaf-bend", "loaf"]);
    playback.dispose();
  });

  it("leaves no stale callbacks after disposal mid-deadline or mid-clip", () => {
    for (const wait of [DEADLINE - 1, DEADLINE]) {
      const { shown, playback } = seatedTired();
      vi.advanceTimersByTime(wait);
      const count = shown.length;
      playback.dispose();
      vi.advanceTimersByTime(60_000);
      expect(shown).toHaveLength(count);
    }
  });

  it("keeps the approved loaf art for every mood and offers Stand while resting", () => {
    for (const mood of ["idle", "happy", "tired"] as const) expect(dogFrame(mood, "loaf")).toBe("loaf");
    expect(dogFrame("happy", "loaf-tuck")).toBe("loaf-tuck");
    expect(["standing", "tucking", "sitting", "loaf-bend", "loaf"].map((p) => isResting(p as DogPose)))
      .toEqual([false, false, true, true, true]);
  });
});
