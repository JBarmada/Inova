import { afterEach, expect, it, vi } from "vitest";
import { rewardReactionActive, subscribeRewardReaction, triggerRewardReaction } from "./rewardReaction";

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

it("shows a temporary reaction and extends it for another completion", () => {
  vi.useFakeTimers();
  const listener = vi.fn();
  const unsubscribe = subscribeRewardReaction(listener);
  triggerRewardReaction();
  expect(rewardReactionActive()).toBe(true);
  vi.advanceTimersByTime(3000);
  triggerRewardReaction();
  vi.advanceTimersByTime(3000);
  expect(rewardReactionActive()).toBe(true);
  vi.advanceTimersByTime(1000);
  expect(rewardReactionActive()).toBe(false);
  expect(listener).toHaveBeenCalledTimes(3);
  unsubscribe();
});
