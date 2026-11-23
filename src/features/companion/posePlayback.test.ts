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

  it("keeps shared happy/tired moods ahead of the local idle pose", () => {
    expect(dogFrame("happy", "sitting")).toBe("happy");
    expect(dogFrame("tired", "tucking")).toBe("tired");
    expect(dogFrame("idle", "sitting")).toBe("sitting");
  });
});
