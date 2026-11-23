import { afterEach, describe, expect, it, vi } from "vitest";
import { createPosePlayback, IDLE_SIT_DELAY, FITTED_DURATION, TIRED_LOAF_DELAY, TIRED_FACE_DURATION, type DogPose } from "./posePlayback";
import { fittedFrames, fittedFrameMs, loafFrames, LOAF_FRAME_MS } from "./poseFrames";
import { dogFrame, breathingArt, dogArt } from "./dogArt";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

describe("companion pose playback", () => {
  it("plays the fitted frames once at their authored timings, then holds sitting", () => {
    vi.useFakeTimers();
    const shown: DogPose[] = [];
    const playback = createPosePlayback((pose) => shown.push(pose), false);
    vi.advanceTimersByTime(IDLE_SIT_DELAY - 1);
    expect(shown).toEqual(["standing"]);
    vi.advanceTimersByTime(1);
    for (const [index, frame] of fittedFrames.entries()) {
      expect(shown.at(-1)).toBe(frame);
      vi.advanceTimersByTime(fittedFrameMs[index] - 1);
      expect(shown.at(-1)).toBe(frame);
      vi.advanceTimersByTime(1);
    }
    expect(shown).toEqual(["standing", ...fittedFrames, "sitting"]);
    vi.advanceTimersByTime(60_000);
    expect(shown).toHaveLength(8);
    playback.dispose();
  });

  it("reverses the displayed sequence when asked to stand mid-clip", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false);
    playback.sit();
    vi.advanceTimersByTime(250);
    playback.stand();
    vi.advanceTimersByTime(FITTED_DURATION);
    expect(show.mock.calls.flat()).toEqual([
      "standing", ...fittedFrames.slice(0, 3), fittedFrames[1], fittedFrames[0], "standing",
    ]);
    playback.dispose();
  });

  it("cancels stale callbacks when the mood changes or the component unmounts", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false);
    playback.sit();
    playback.dispose();
    show.mockClear();
    vi.advanceTimersByTime(IDLE_SIT_DELAY + FITTED_DURATION);
    playback.sit();
    playback.stand();
    expect(show).not.toHaveBeenCalled();
  });

  it("skips the intermediate frame for reduced motion", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, true);
    playback.sit();
    playback.stand();
    expect(show.mock.calls.flat()).toEqual(["standing", "sitting", "standing"]);
    playback.dispose();
  });

  it("plays the fitted frames in reverse to stand and starts idle timing at the endpoint", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false);
    playback.sit();
    vi.advanceTimersByTime(FITTED_DURATION);
    show.mockClear();
    playback.stand();
    vi.advanceTimersByTime(FITTED_DURATION);
    expect(show.mock.calls.flat()).toEqual([...([...fittedFrames].reverse()), "standing"]);
    vi.advanceTimersByTime(IDLE_SIT_DELAY - 1);
    expect(show).toHaveBeenLastCalledWith("standing");
    vi.advanceTimersByTime(1);
    expect(show).toHaveBeenLastCalledWith(fittedFrames[0]);
    playback.dispose();
  });

});

describe("tired loaf", () => {
  it("chooses posture-compatible faces without substituting standing", () => {
    expect(dogFrame("happy", "sitting")).toBe("sitting-happy");
    expect(dogFrame("tired", "tucking")).toBe("tucking");
    expect(dogFrame("tired", "sitting")).toBe("sitting-tired");
    expect(dogFrame("idle", "sitting")).toBe("sitting");
  });

  it("preserves sitting through tiredness, duplicate events and recovery", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, true);
    playback.sit();
    playback.setMood("tired");
    playback.setMood("tired");
    vi.advanceTimersByTime(TIRED_LOAF_DELAY - 1);
    playback.setMood("happy");
    playback.setMood("idle");
    vi.advanceTimersByTime(60_000);
    expect(show.mock.calls.flat()).toEqual(["standing", "sitting"]);
    playback.dispose();
  });

  it("holds tired sitting for seven seconds after the eye sequence and lowers only once", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false, "tired");
    playback.sit();
    vi.advanceTimersByTime(FITTED_DURATION + TIRED_FACE_DURATION + TIRED_LOAF_DELAY - 1);
    expect(show).toHaveBeenLastCalledWith("sitting");
    playback.setMood("tired");
    vi.advanceTimersByTime(1);
    expect(show).toHaveBeenLastCalledWith("loaf-bend");
    vi.advanceTimersByTime(LOAF_FRAME_MS);
    expect(show).toHaveBeenLastCalledWith("loaf-tuck");
    vi.advanceTimersByTime(LOAF_FRAME_MS);
    expect(show.mock.calls.flat().slice(-3)).toEqual([...loafFrames, "loaf"]);
    playback.setMood("happy");
    expect(dogFrame("happy", "loaf")).toBe("loaf-happy");
    playback.stand();
    vi.advanceTimersByTime(1_500);
    expect(show.mock.calls.flat().slice(-10)).toEqual(["loaf-tuck", "loaf-bend", "sitting", ...[...fittedFrames].reverse(), "standing"]);
    playback.dispose();
  });

  it.each(["stand", "dispose"] as const)("cancels a pending reduced-motion loaf on %s", (action) => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, true, "tired");
    playback.sit();
    vi.advanceTimersByTime(TIRED_LOAF_DELAY - 1);
    playback[action]();
    vi.advanceTimersByTime(60_000);
    expect(show.mock.calls.flat()).not.toContain("loaf");
    playback.dispose();
  });

  it("provides four breathing phases for every displayed frame", () => {
    for (const frame of Object.keys(dogArt) as (keyof typeof dogArt)[]) {
      expect(new Set(breathingArt[frame]).size).toBe(4);
    }
  });
});

describe("mood and posture independence during movement", () => {
  it("finishes the approved tuck when tiredness arrives mid-clip", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false);
    playback.sit();
    vi.advanceTimersByTime(80);
    playback.setMood("tired");
    playback.sit();
    vi.advanceTimersByTime(FITTED_DURATION - 80);
    expect(show.mock.calls.flat()).toEqual(["standing", ...fittedFrames, "sitting"]);
    playback.dispose();
  });

  it("only schedules automatic sitting for standing idle", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false, "tired");
    vi.advanceTimersByTime(60_000);
    expect(show).toHaveBeenCalledTimes(1);
    playback.setMood("idle");
    vi.advanceTimersByTime(IDLE_SIT_DELAY - 1);
    expect(show).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(show).toHaveBeenLastCalledWith(fittedFrames[0]);
    playback.setReducedMotion(true);
    expect(show).toHaveBeenLastCalledWith("sitting");
    playback.dispose();
  });
});
