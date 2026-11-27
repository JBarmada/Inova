import { expect, it, vi } from "vitest";
import { sendPlanningReply } from "./sendPlanningReply";

it("handles an unrelated question as conversation without changing the pending goal", async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  const dispatch = vi.fn().mockResolvedValue(undefined);
  await sendPlanningReply("I don’t know what to eat tmrw", "Write a paper", share, dispatch);
  expect(share).toHaveBeenCalledWith("I don’t know what to eat tmrw");
  expect(dispatch).not.toHaveBeenCalled();
});

it("still adds an ordinary answer to the pending goal", async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  const dispatch = vi.fn().mockResolvedValue(undefined);
  await sendPlanningReply("I have done nothing", "Write a paper", share, dispatch);
  expect(dispatch).toHaveBeenCalledWith({ type: "chat-context", text: "I have done nothing" });
  expect(share).not.toHaveBeenCalled();
});
