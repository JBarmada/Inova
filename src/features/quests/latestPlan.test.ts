import { expect, it, vi } from "vitest";
import { latestPlanRequest } from "./latestPlan";

it("keeps the sample when a slower local request finishes later", async () => {
  const request = latestPlanRequest<string>();
  let finishLocal!: (value: string) => void;
  const local = new Promise<string>((resolve) => { finishLocal = resolve; });
  const show = vi.fn(), fail = vi.fn(), done = vi.fn();
  const pending = request.run(() => local, show, fail, done);
  await request.run(async () => "sample", show, fail, done);
  finishLocal("local");
  await pending;
  expect(show).toHaveBeenCalledOnce();
  expect(show).toHaveBeenCalledWith("sample");
  expect(done).toHaveBeenCalledOnce();
  expect(fail).not.toHaveBeenCalled();
});

it("ignores a late failure after the screen is left", async () => {
  const request = latestPlanRequest<string>();
  let rejectLocal!: (error: Error) => void;
  const local = new Promise<string>((_, reject) => { rejectLocal = reject; });
  const show = vi.fn(), fail = vi.fn(), done = vi.fn();
  const pending = request.run(() => local, show, fail, done);
  request.invalidate();
  rejectLocal(Error("offline"));
  await pending;
  expect(show).not.toHaveBeenCalled();
  expect(fail).not.toHaveBeenCalled();
  expect(done).not.toHaveBeenCalled();
});

it("ignores a stopped plan after the user starts a new one", async () => {
  const request = latestPlanRequest<string>();
  let finishFirst!: (value: string) => void;
  const first = new Promise<string>((resolve) => { finishFirst = resolve; });
  const show = vi.fn(), fail = vi.fn(), done = vi.fn();
  const pending = request.run(() => first, show, fail, done);
  request.invalidate();
  await request.run(async () => "revised plan", show, fail, done);
  finishFirst("old plan");
  await pending;
  expect(show).toHaveBeenCalledOnce();
  expect(show).toHaveBeenCalledWith("revised plan");
  expect(done).toHaveBeenCalledOnce();
  expect(fail).not.toHaveBeenCalled();
});
