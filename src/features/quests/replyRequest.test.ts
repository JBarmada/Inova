import { expect, it, vi } from "vitest";
import { replyRequest } from "./replyRequest";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

it("ignores a stopped reply while allowing a later request to finish", async () => {
  const gate = replyRequest<string>(), old = deferred<string>();
  const commit = vi.fn(async (_value: string) => {}), failure = vi.fn(), done = vi.fn();
  const first = gate.run(() => old.promise, commit, failure, done);
  expect(gate.cancel()).toBe(true);
  await gate.run(async () => "new", commit, failure, done);
  old.resolve("late");
  await first;
  expect(commit).toHaveBeenCalledTimes(1);
  expect(commit).toHaveBeenCalledWith("new");
  expect(done).toHaveBeenCalledTimes(1);
  expect(failure).not.toHaveBeenCalled();
});

it("suppresses errors after stopping or leaving chat", async () => {
  const gate = replyRequest<string>(), request = deferred<string>();
  const commit = vi.fn(async () => {}), failure = vi.fn(), done = vi.fn();
  const pending = gate.run(() => request.promise, commit, failure, done);
  gate.dispose();
  request.reject(Error("offline"));
  await pending;
  expect(commit).not.toHaveBeenCalled();
  expect(failure).not.toHaveBeenCalled();
  expect(done).not.toHaveBeenCalled();
});

it("finishes saving a reply once the commit has begun", async () => {
  const gate = replyRequest<string>(), saving = deferred<void>();
  const commit = vi.fn(() => saving.promise), failure = vi.fn(), done = vi.fn();
  const pending = gate.run(async () => "reply", commit, failure, done);
  await Promise.resolve();
  expect(gate.cancel()).toBe(false);
  saving.resolve();
  await pending;
  expect(commit).toHaveBeenCalledWith("reply");
  expect(done).toHaveBeenCalledOnce();
  expect(failure).not.toHaveBeenCalled();
});

it("reports a failed reply save", async () => {
  const gate = replyRequest<string>(), failure = vi.fn(), done = vi.fn();
  await gate.run(async () => "reply", async () => { throw Error("stale"); }, failure, done);
  expect(failure).toHaveBeenCalledOnce();
  expect(done).toHaveBeenCalledOnce();
});
