import { afterEach, describe, expect, it, vi } from "vitest";
import { createPosePlayback, IDLE_SIT_DELAY, TUCK_DURATION, type DogPose } from "./posePlayback";
import { dogFrame } from "./dogArt";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

describe("companion pose playback", () => {
  it("plays standing, the approved tuck once, then holds sitting", () => {
    vi.useFakeTimers();
    const shown: DogPose[] = [];
    const playback = createPosePlayback((pose) => shown.push(pose), false);
    vi.advanceTimersByTime(IDLE_SIT_DELAY - 1);
    expect(shown).toEqual(["standing"]);
    vi.advanceTimersByTime(1);
    expect(shown.at(-1)).toBe("tucking");
    vi.advanceTimersByTime(TUCK_DURATION);
    expect(shown).toEqual(["standing", "tucking", "sitting"]);
    vi.advanceTimersByTime(60_000);
    expect(shown).toHaveLength(3);
    playback.dispose();
  });

  it("cancels an in-flight tuck when asked to stand", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false);
    playback.sit();
    playback.stand();
    vi.advanceTimersByTime(TUCK_DURATION);
    expect(show).toHaveBeenLastCalledWith("standing");
    playback.dispose();
  });

  it("cancels stale callbacks when the mood changes or the component unmounts", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false);
    playback.sit();
    playback.dispose();
    show.mockClear();
    vi.advanceTimersByTime(IDLE_SIT_DELAY + TUCK_DURATION);
    playback.sit();
    playback.stand();
    expect(show).not.toHaveBeenCalled();
  });

  it("skips the intermediate frame for reduced motion", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, true);
    playback.sit();
    expect(show.mock.calls.flat()).toEqual(["standing", "sitting"]);
    playback.dispose();
  });

  it("chooses posture-compatible faces without substituting standing", () => {
    expect(dogFrame("happy", "sitting")).toBe("sitting");
    expect(dogFrame("tired", "tucking")).toBe("tucking");
    expect(dogFrame("tired", "sitting")).toBe("sitting-tired");
    expect(dogFrame("idle", "sitting")).toBe("sitting");
  });

});

describe("mood and posture independence", () => {
  it("preserves sitting through tiredness, duplicate events and recovery", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, true);
    playback.sit();
    playback.setMood("tired");
    playback.setMood("tired");
    vi.advanceTimersByTime(60_000);
    playback.setMood("happy");
    playback.setMood("idle");
    expect(show.mock.calls.flat()).toEqual(["standing", "sitting"]);
    playback.dispose();
  });

  it("finishes the approved tuck when tiredness arrives mid-clip", () => {
    vi.useFakeTimers();
    const show = vi.fn();
    const playback = createPosePlayback(show, false);
    playback.sit();
    vi.advanceTimersByTime(80);
    playback.setMood("tired");
    playback.sit();
    vi.advanceTimersByTime(80);
    expect(show.mock.calls.flat()).toEqual(["standing", "tucking", "sitting"]);
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
    expect(show).toHaveBeenLastCalledWith("tucking");
    playback.setReducedMotion(true);
    expect(show).toHaveBeenLastCalledWith("sitting");
    playback.dispose();
  });
});
