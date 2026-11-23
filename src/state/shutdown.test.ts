import { beforeEach, expect, it, vi } from "vitest";

const fake = vi.hoisted(() => ({ save: vi.fn(async (_state: unknown) => {}) }));
vi.mock("../services/storage", () => ({ loadState: async () => null, saveState: fake.save }));
vi.mock("../services/audio", () => ({ playCue: vi.fn() }));

beforeEach(() => { vi.resetModules(); fake.save.mockReset(); fake.save.mockResolvedValue(undefined); });

it("drains pending state saves, blocks new mutations during quit, and can resume after exit failure", async () => {
  const store = await import("./store");
  await store.initialize();
  let finish!: () => void;
  fake.save.mockImplementationOnce(() => new Promise<void>((resolve) => { finish = resolve; }));
  const adoption = store.dispatch({ type: "adopt", name: "Saved pup" });
  await vi.waitFor(() => expect(fake.save).toHaveBeenCalledTimes(1));
  const drained = vi.fn();
  const pending = store.beginStateShutdown().then(drained);
  await expect(store.dispatch({ type: "mood", mood: "tired" })).rejects.toThrow("closing");
  expect(drained).not.toHaveBeenCalled();
  finish();
  await Promise.all([adoption, pending]);
  expect(drained).toHaveBeenCalledTimes(1);
  expect(fake.save).toHaveBeenLastCalledWith(expect.objectContaining({ pet: { name: "Saved pup", adopted: true, mood: "idle" } }));
  store.cancelStateShutdown();
  await store.dispatch({ type: "mood", mood: "happy" });
  expect(fake.save).toHaveBeenCalledTimes(2);
});
