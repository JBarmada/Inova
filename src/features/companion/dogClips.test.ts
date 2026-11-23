import { afterEach, expect, it, vi } from "vitest";
import { clipFit, clipIds, clipTiming, createClipPlayback, type ClipFrame } from "./dogClips";
import { wearableAnchors } from "./wearableAnchors";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

it("reaches the cue frame at the approved time and releases the pose", () => {
  vi.useFakeTimers();
  const show = vi.fn<(frame: ClipFrame | null) => void>();
  createClipPlayback({ clip: "12-single-bark", demo: true }, false, show);
  vi.advanceTimersByTime(639);
  expect(show.mock.lastCall?.[0]?.index).toBe(1);
  vi.advanceTimersByTime(1);
  expect(show.mock.lastCall?.[0]).toMatchObject({ index: 2, elapsed: 640 });
  vi.advanceTimersByTime(2000);
  expect(show).toHaveBeenLastCalledWith(null);
});

it("repeats the wag finitely and cancels an interrupted preview", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  const stop = createClipPlayback({ clip: "11b-tail-wag-loop", demo: true }, false, show);
  vi.advanceTimersByTime(700);
  expect(show).toHaveBeenLastCalledWith(expect.objectContaining({ index: 0 }));
  stop();
  show.mockClear();
  vi.advanceTimersByTime(10_000);
  expect(show).not.toHaveBeenCalled();
});

it("shows one meaningful still with reduced motion", () => {
  vi.useFakeTimers();
  const show = vi.fn();
  createClipPlayback({ clip: "12-single-bark", demo: true }, true, show);
  vi.advanceTimersByTime(900);
  expect(show.mock.calls.map(([frame]) => frame?.elapsed ?? null)).toEqual([640, null]);
});

it("assigns usable wearable anchors and valid effect bounds to all twenty clips", () => {
  expect(clipIds).toHaveLength(20);
  for (const clip of clipIds) {
    const { durations, effects } = clipTiming[clip];
    const total = durations.reduce((sum, ms) => sum + ms, 0);
    durations.forEach((_, index) => expect(wearableAnchors(clipFit(clip, index).pose).hat).toHaveLength(1));
    effects.forEach(({ startMs, endMs }) => expect(startMs < endMs && endMs <= total).toBe(true));
  }
  expect(wearableAnchors("sleeping").socks).toEqual([]);
});
