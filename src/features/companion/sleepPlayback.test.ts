import { afterEach, expect, it, vi } from "vitest";
import { createPosePlayback, FITTED_DURATION, LOAF_SLEEP_DELAY, TIRED_FACE_DURATION, TIRED_LOAF_DELAY } from "./posePlayback";
import { LOAF_FRAME_MS } from "./poseFrames";
import { dogFrame } from "./dogArt";

const loafTime = FITTED_DURATION + TIRED_FACE_DURATION + TIRED_LOAF_DELAY + 2 * LOAF_FRAME_MS;
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

it("falls asleep once after the tired loaf hold and wakes without looping back to sleep", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const playback = createPosePlayback(show, false, "tired");
  playback.sit();
  vi.advanceTimersByTime(loafTime + LOAF_SLEEP_DELAY - 1);
  expect(show).toHaveBeenLastCalledWith("loaf");
  vi.advanceTimersByTime(691);
  expect(show.mock.calls.flat().slice(-3)).toEqual(["sleep-drowsy", "sleep-doze", "sleeping"]);
  expect(dogFrame("happy", "sleeping")).toBe("sleeping");
  playback.wake();
  playback.wake();
  vi.advanceTimersByTime(60_000);
  expect(show.mock.calls.flat().slice(-4)).toEqual(["wake-ear", "wake-eyes", "sleep-drowsy", "loaf"]);
  playback.dispose();
});

it("cancels sleep if the dog brightens on the last millisecond", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const playback = createPosePlayback(show, true, "tired");
  playback.sit();
  vi.advanceTimersByTime(TIRED_LOAF_DELAY + LOAF_SLEEP_DELAY - 1);
  playback.setMood("happy");
  vi.advanceTimersByTime(60_000);
  expect(show.mock.calls.flat()).toEqual(["standing", "sitting", "loaf"]);
  playback.dispose();
});

it("uses stable sleeping and waking poses under reduced motion", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const playback = createPosePlayback(show, true, "tired");
  playback.sit();
  vi.advanceTimersByTime(TIRED_LOAF_DELAY + LOAF_SLEEP_DELAY);
  playback.setMood("happy");
  expect(show.mock.calls.flat()).toEqual(["standing", "sitting", "loaf", "sleeping", "loaf"]);
  playback.dispose();
});
