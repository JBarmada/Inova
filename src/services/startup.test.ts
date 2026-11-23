import { expect, it, vi } from "vitest";
import { runStartup, StartupFailure } from "./startup";

it("shows phase feedback while waiting for both save and window initialization", async () => {
  let time = 300;
  let finishSave!: () => void;
  let finishWindow!: () => void;
  const phases: string[] = [];
  const done = vi.fn();
  const startup = runStartup({ clock: () => time, onPhase: (text) => phases.push(text),
    loadSave: () => new Promise<void>((resolve) => { finishSave = resolve; }),
    prepareWindow: () => new Promise<void>((resolve) => { finishWindow = resolve; }) });
  void startup.then(done);
  time = 450;
  finishSave();
  await Promise.resolve();
  expect(done).not.toHaveBeenCalled();
  expect(phases.at(-1)).toBe("Setting up your window…");
  time = 1100;
  finishWindow();
  expect(await startup).toEqual({ modulesMs: 300, saveMs: 150, windowMs: 800, readyMs: 1100 });
});

it("distinguishes window setup failures from save failures without hiding the cause", async () => {
  const error = Error("Placement unavailable");
  const startup = runStartup({ onPhase: () => undefined, loadSave: async () => undefined,
    prepareWindow: async () => { throw error; } });
  await expect(startup).rejects.toMatchObject({ phase: "window", cause: error, message: error.message });
  await expect(startup).rejects.toBeInstanceOf(StartupFailure);
});
