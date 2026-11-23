import { afterEach, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

it("suppresses overlapping repeated cues and never starts audio while muted", async () => {
  const start = vi.fn();
  const oscillator = { type: "", frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(), start, stop: vi.fn() };
  const gain = { gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() };
  oscillator.connect.mockReturnValue(gain);
  const audio = { currentTime: 0, destination: {}, resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: vi.fn(() => oscillator), createGain: vi.fn(() => gain) };
  const construct = vi.fn(function () { return audio; });
  vi.stubGlobal("AudioContext", construct);
  const { playCue } = await import("./audio");
  playCue("reward", true);
  expect(construct).not.toHaveBeenCalled();
  playCue("reward", false);
  playCue("reward", false);
  expect(start).toHaveBeenCalledTimes(1);
  audio.currentTime = 0.17;
  playCue("reward", false);
  expect(start).toHaveBeenCalledTimes(2);
  playCue("squeak", false);
  playCue("squeak", false);
  expect(start).toHaveBeenCalledTimes(3);
  playCue("book", true);
  expect(start).toHaveBeenCalledTimes(3);
  playCue("book", false);
  playCue("book", false);
  expect(start).toHaveBeenCalledTimes(4);
});

it("does not throw if audio is unavailable", async () => {
  vi.stubGlobal("AudioContext", class { constructor() { throw Error("unavailable"); } });
  const { playCue } = await import("./audio");
  expect(() => playCue("click", false)).not.toThrow();
});
