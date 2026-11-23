import { beforeEach, expect, it, vi } from "vitest";
import { initialState } from "./defaults";
import type { Quest } from "../shared/schema";

const fake = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn(), cue: vi.fn() }));
vi.mock("../services/storage", () => ({ loadState: fake.load, saveState: fake.save }));
vi.mock("../services/audio", () => ({ playCue: fake.cue }));

const quest = (id: string): Quest => ({ id, commitmentId: "c", title: id, reason: "reason", sourceIds: ["c"],
  minutes: 10, status: "accepted", planner: "sample" });

beforeEach(() => {
  vi.resetModules(); fake.cue.mockReset(); fake.save.mockReset().mockResolvedValue(undefined);
  fake.load.mockReset().mockResolvedValue({ ...initialState(), quests: [quest("one"), quest("two"), quest("three")] });
});

it("reports only newly saved unlocks across completions and duplicate actions", async () => {
  const store = await import("./store"); await store.initialize();
  expect(await store.dispatchWithReceipt({ type: "complete-quest", id: "one" })).toEqual({ completed: true, unlocked: ["notebook"] });
  expect(await store.dispatchWithReceipt({ type: "complete-quest", id: "one" })).toEqual({ completed: false, unlocked: [] });
  expect(await store.dispatchWithReceipt({ type: "complete-quest", id: "two" })).toEqual({ completed: true, unlocked: [] });
  expect(await store.dispatchWithReceipt({ type: "complete-quest", id: "three" })).toEqual({ completed: true, unlocked: ["bandana"] });
  expect(fake.cue).toHaveBeenCalledTimes(4);
});

it("does not report or publish a reward if saving fails", async () => {
  const store = await import("./store"); await store.initialize();
  fake.save.mockRejectedValueOnce(Error("Disk full"));
  await expect(store.dispatchWithReceipt({ type: "complete-quest", id: "one" })).rejects.toThrow("Disk full");
  expect(fake.cue).not.toHaveBeenCalled();
  expect(await store.dispatchWithReceipt({ type: "complete-quest", id: "one" })).toEqual({ completed: true, unlocked: ["notebook"] });
});
