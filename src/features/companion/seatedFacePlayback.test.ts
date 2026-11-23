import { afterEach, expect, it, vi } from "vitest";
import { createSeatedFacePlayback, TIRED_FACE_STEPS } from "./seatedFacePlayback";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

it("plays the approved face timings then stays tired without entering loaf", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const dispose = createSeatedFacePlayback(show);
  expect(show).toHaveBeenCalledWith("sitting-blink");
  for (const [frame, duration] of TIRED_FACE_STEPS) {
    expect(show).toHaveBeenLastCalledWith(frame);
    vi.advanceTimersByTime(duration);
  }
  expect(show).toHaveBeenLastCalledWith("sitting-tired");
  vi.advanceTimersByTime(60_000);
  expect(show).toHaveBeenCalledTimes(TIRED_FACE_STEPS.length + 1);
  dispose();
});

it("cancels stale facial callbacks on posture/mood change or unmount", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const dispose = createSeatedFacePlayback(show);
  vi.advanceTimersByTime(950);
  dispose();
  show.mockClear();
  vi.runAllTimers();
  expect(show).not.toHaveBeenCalled();
});

it("uses the approved tired endpoint immediately with reduced motion", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const dispose = createSeatedFacePlayback(show, true);
  expect(show.mock.calls.flat()).toEqual(["sitting-tired"]);
  expect(vi.getTimerCount()).toBe(0);
  dispose();
});
