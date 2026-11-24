import type { AppState } from "../shared/schema";
import { proposeLocalPlan } from "./localPlan";
import { prepareQuest } from "./prepareQuest";

export async function prepareChatPlan(text: string, state: AppState, local = proposeLocalPlan) {
  let plan: Awaited<ReturnType<typeof proposeLocalPlan>> | undefined;
  const draft = await prepareQuest(text, state, async (commitment, current) => {
    plan = await local(commitment, current);
    return plan;
  });
  return { ...draft, explanation: plan?.explanation, steps: plan?.steps ?? [draft.quest] };
}
