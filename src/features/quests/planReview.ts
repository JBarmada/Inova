import type { prepareChatPlan } from "../../services/prepareChatPlan";

export type ChatDraft = Awaited<ReturnType<typeof prepareChatPlan>> & { usesSavedPlan?: boolean };
const common = new Set(["the", "and", "for", "your", "this", "with", "from", "step", "minutes", "minute", "review"]);

function words(text: string) {
  return new Set((text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length >= 3 && !common.has(word)));
}

export function possibleRepeat(previous: string | undefined, proposed: string): boolean {
  if (!previous) return false;
  const first = words(previous), second = words(proposed);
  if (!first.size || !second.size) return false;
  const shared = [...first].filter((word) => second.has(word)).length;
  return (shared >= 2 && shared / Math.min(first.size, second.size) >= 2 / 3) ||
    (first.size === 1 && second.size === 1 && shared === 1);
}

export function skipFirstPlanStep(draft: ChatDraft): ChatDraft {
  if (draft.usesSavedPlan || draft.steps.length < 2) throw Error("No other suggested step is available.");
  const steps = draft.steps.slice(1), first = steps[0];
  return { ...draft, steps, quest: { ...draft.quest, title: first.title, reason: first.reason, minutes: first.minutes }, explanation: undefined };
}
