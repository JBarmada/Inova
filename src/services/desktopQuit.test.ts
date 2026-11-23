import { afterEach, expect, it, vi } from "vitest";
import { createQuitController, QUIT_SAVE_TIMEOUT_MS } from "./desktopQuit";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

function steps() {
  return { flush: vi.fn(async () => {}), savePlacement: vi.fn(async () => {}),
    exit: vi.fn(async () => {}), resume: vi.fn() };
}

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it("waits for progress and geometry, and shares concurrent X/settings quit requests", async () => {
  const progress = deferred();
  const geometry = deferred();
  const work = steps();
  work.flush.mockReturnValue(progress.promise);
  work.savePlacement.mockReturnValue(geometry.promise);
  const quit = createQuitController(work);
  const first = quit();
  expect(quit()).toBe(first);
  await Promise.resolve();
  progress.resolve();
  await Promise.resolve();
  expect(work.exit).not.toHaveBeenCalled();
  geometry.resolve();
  await first;
  expect(work.flush).toHaveBeenCalledTimes(1);
  expect(work.savePlacement).toHaveBeenCalledTimes(1);
  expect(work.exit).toHaveBeenCalledTimes(1);
});

it.each(["flush", "savePlacement"] as const)("still exits after %s rejects", async (failure) => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const work = steps();
  work[failure].mockRejectedValue(Error("Disk unavailable"));
  await createQuitController(work)();
  expect(console.warn).toHaveBeenCalled();
  expect(work.exit).toHaveBeenCalledTimes(1);
});

it.each(["flush", "savePlacement"] as const)("bounds a stuck %s and never exits twice after it resolves", async (blocked) => {
  vi.useFakeTimers();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const pending = deferred();
  const work = steps();
  work[blocked].mockReturnValue(pending.promise);
  const result = createQuitController(work)();
  await vi.advanceTimersByTimeAsync(QUIT_SAVE_TIMEOUT_MS - 1);
  expect(work.exit).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1);
  await result;
  expect(work.exit).toHaveBeenCalledTimes(1);
  pending.resolve();
  await vi.runAllTimersAsync();
  expect(work.exit).toHaveBeenCalledTimes(1);
});

it("resumes mutations and permits retry if native exit fails", async () => {
  const work = steps();
  work.exit.mockRejectedValueOnce(Error("Native exit unavailable"));
  const quit = createQuitController(work);
  await expect(quit()).rejects.toThrow("Native exit unavailable");
  expect(work.resume).toHaveBeenCalledTimes(1);
  await quit();
  expect(work.exit).toHaveBeenCalledTimes(2);
});
