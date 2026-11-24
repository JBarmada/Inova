import type { AppState } from "../shared/schema";
import { proposeLocalPlan } from "./localPlan";
import { prepareQuest } from "./prepareQuest";
import { previousQuestContext } from "./previousQuest";

export async function prepareChatPlan(text: string, state: AppState, local = proposeLocalPlan) {
  let plan: Awaited<ReturnType<typeof proposeLocalPlan>> | undefined;
  const previousQuest = previousQuestContext(state);
  const draft = await prepareQuest(text, state, async (commitment, current) => {
    plan = await local(commitment, current);
    return plan;
  });
  const quest = draft.fallback && previousQuest ? { ...draft.quest,
    title: `Spend ${draft.quest.minutes} minutes continuing: ${draft.commitment.title}`,
    reason: "Sample planner: choose a small next action. No schedule or AI service was consulted.",
    sourceIds: [draft.commitment.id] } : draft.quest;
  return { ...draft, quest, memorySnapshot: draft.fallback && previousQuest ? [] : draft.memorySnapshot,
    previousQuest, explanation: plan?.explanation, steps: plan?.steps ?? [quest] };
}
