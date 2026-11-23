import { afterEach, expect, it, vi } from "vitest";
import { BREATH_DURATIONS, createBreathingPlayback } from "./breathingPlayback";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

it("holds each approved breathing phase and returns to the canonical rest frame", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const stop = createBreathingPlayback(show);
  expect(show).toHaveBeenLastCalledWith(0);
  for (let phase = 0; phase < BREATH_DURATIONS.length; phase++) {
    vi.advanceTimersByTime(BREATH_DURATIONS[phase]);
    expect(show).toHaveBeenLastCalledWith((phase + 1) % 4);
  }
  expect(show.mock.calls.flat()).toEqual([0, 1, 2, 3, 0]);
  stop();
});

it("stops breathing callbacks when a transition, reduced motion, or unmount replaces playback", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const stop = createBreathingPlayback(show);
  vi.advanceTimersByTime(800);
  stop();
  show.mockClear();
  vi.advanceTimersByTime(20_000);
  expect(show).not.toHaveBeenCalled();
});
